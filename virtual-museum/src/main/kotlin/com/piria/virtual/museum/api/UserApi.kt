package com.piria.virtual.museum.api

import com.piria.virtual.museum.model.Response.Companion.generateCreatedResponse
import com.piria.virtual.museum.model.Response.Companion.generateErrorResponse
import com.piria.virtual.museum.model.Response.Companion.generateValidResponse
import com.piria.virtual.museum.model.User
import com.piria.virtual.museum.model.UserType
import com.piria.virtual.museum.repository.UserRepository
import com.piria.virtual.museum.service.EmailService
import com.piria.virtual.museum.service.UserActivityService
import com.piria.virtual.museum.service.UserService
import com.piria.virtual.museum.util.JwtTokenUtil
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus.*
import org.springframework.http.MediaType.APPLICATION_JSON_VALUE
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.DisabledException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.support.ServletUriComponentsBuilder
import java.io.Serializable

@RestController
@RequestMapping("/api/users")
@CrossOrigin(originPatterns = ["*"])
class UserApi(
    private val userService: UserService,
    private val userActivityService: UserActivityService,
    private val userRepository: UserRepository,
    private val emailService: EmailService
) {

    @Autowired
    private lateinit var authenticationManager: AuthenticationManager

    @Autowired
    private lateinit var jwtTokenUtil: JwtTokenUtil

    @Autowired
    private lateinit var passwordEncoder: PasswordEncoder

    @PostMapping("/authenticate", consumes = [APPLICATION_JSON_VALUE], produces = [APPLICATION_JSON_VALUE])
    fun createAuthenticationToken(@RequestBody authenticationRequest: JwtRequest): ResponseEntity<*> {

        if (authenticationRequest.username.isNullOrEmpty()) {
            return generateErrorResponse(status = BAD_REQUEST, error = "Username should not be null or empty.")
        }

        if (authenticationRequest.password.isNullOrEmpty()) {
            return generateErrorResponse(status = BAD_REQUEST, error = "Password should not be null or empty.")
        }

        return try {
            authenticate(authenticationRequest.username, authenticationRequest.password)
            val userDetails: User = userService.loadUserByUsername(authenticationRequest.username)
            val token: String = jwtTokenUtil.generateToken(userDetails)
            log.warn { "Successful authenticated user ${userDetails.name}" }
            ResponseEntity.ok(JwtResponse(token, userDetails.role))
        } catch (ex: Exception) {
            log.warn("Error while authentication or token creation. Message: {}", ex.message)
            generateErrorResponse(
                BAD_REQUEST, when (ex.localizedMessage) {
                    "USER_DISABLED" -> "User is disabled."
                    "INVALID_CREDENTIALS" -> "Invalid credentials."
                    else -> "Error while authentication."
                }
            )
        }
    }

    private fun authenticate(username: String, password: String) {
        try {
            val authentication =
                authenticationManager.authenticate(UsernamePasswordAuthenticationToken(username, password))
            SecurityContextHolder.getContext().authentication = authentication
            authentication.principal
        } catch (e: DisabledException) {
            throw Exception("USER_DISABLED", e)
        } catch (e: BadCredentialsException) {
            throw Exception("INVALID_CREDENTIALS", e)
        }
    }

    @GetMapping
    fun getAllUsers(): ResponseEntity<*> =
        try {
            val content = userService.getAllUsers()
            log.info { "Successfully retrieved all users." }
            generateValidResponse(content)
        } catch (e: Exception) {
            log.error("Error while retrieveing all users.", e)
            generateErrorResponse(NO_CONTENT, "Error while calculating number of active users by hour. Error: ${e.message}")
        }

    @GetMapping("/uas/all")
    fun getActiveUsersByHour(): ResponseEntity<*> =
        try {
            val content = userActivityService.getActiveUsersByHour()
            log.info { "Successfully calculated number of active users by hour." }
            generateValidResponse(content)
        } catch (e: Exception) {
            log.error("Error while calculating number of active users by hour...", e)
            generateErrorResponse(NO_CONTENT, "Error while calculating number of active users by hour. Error: ${e.message}")
        }

    @GetMapping("/uas")
    fun getCurrentlyActiveUsers(): ResponseEntity<*> =
        try {
            val content = userActivityService.getCurrentlyActiveUsers()
            log.info { "Successfully calculated number of active users." }
            generateValidResponse(content)
        } catch (e: Exception) {
            log.error("Error while calculating number of active users...", e)
            generateErrorResponse(NO_CONTENT, "Error while calculating number of active users. Error: ${e.message}")
        }

    @GetMapping("/non-admin-users")
    fun getAllNonAdminUsers(): ResponseEntity<*> =
        try {
            val content = userService.getAllNonAdminUsers()
            log.info { "Successfully retrieved non-admin users." }
            generateValidResponse(content)
        } catch (e: Exception) {
            log.error("Error while retrieving non-admin users.", e)
            generateErrorResponse(NO_CONTENT, "Error while retrieving non-admin users. Error: ${e.message}")
        }

    @PostMapping("/register", consumes = [APPLICATION_JSON_VALUE], produces = [APPLICATION_JSON_VALUE])
    fun saveUser(@RequestBody user: User): ResponseEntity<*> {
        try {
            if (userService.userExists(user.username)) {
                return generateErrorResponse(
                    status = CONFLICT,
                    error = "User with username '${user.username}' already exists."
                )
            }
            user.secret = passwordEncoder.encode(user.secret)
            val savedUser = userService.saveUser(user)
            val userUrl = ServletUriComponentsBuilder.fromCurrentServletMapping()
                .path("/api/users/${savedUser.id}")
                .toUriString()

            log.info { "User with id ${savedUser.id} is successfully registered." }
            return generateCreatedResponse(resourceUrl = userUrl, content = savedUser)
        } catch (e: Exception) {
            log.error("User registration failed.", e)
            return generateErrorResponse(BAD_REQUEST, "User registration failed. Error: ${e.message}")
        }
    }

    @GetMapping("/{id}")
    fun getUserById(@PathVariable id: Long): ResponseEntity<*> =
        try {
            val userById = userService.getUserById(id)
            log.info { "User $id is successfully retrieved." }
            generateValidResponse(userById)
        } catch (e: Exception) {
            log.error("Error while retrieving user ${id}", e)
            generateErrorResponse(BAD_REQUEST, "Error while retrieving user ${id}. Error: ${e.message}")
        }

    @DeleteMapping("/{id}")
    fun deleteUserById(@PathVariable id: Long): ResponseEntity<*> =
        try {
            userService.deleteUserById(id)
            log.info { "User $id is successfully deleted." }
            generateValidResponse(id)
        } catch (e: Exception) {
            log.error("Error while deleting user.", e)
            generateErrorResponse(BAD_REQUEST, "Error while deleting user. Error: ${e.message}")
        }

    @GetMapping("/approveRegistration/{userId}")
    fun approveRegistration(@PathVariable userId: Long): ResponseEntity<*> =
        try {
            val userById = userService.getUserById(userId)
            userById.isRegistrationEnabled = true
            val changedUser = userRepository.saveAndFlush(userById)
            log.info { "Registration approval for user ${userById.name} is successfully given." }
            generateValidResponse(changedUser)
        } catch (e: Exception) {
            log.error("User with $userId doesn't exist.", e)
            generateErrorResponse(BAD_REQUEST, "User with $userId doesn't exist.")
        }

    @GetMapping("/block/{userId}")
    fun blockUser(@PathVariable userId: Long): ResponseEntity<*> =
        try {
            val userById = userService.getUserById(userId)
            userById.isBlocked = true
            val changedUser = userRepository.saveAndFlush(userById)
            log.info { "User ${userById.name} is blocked successfully." }
            generateValidResponse(changedUser)
        } catch (e: Exception) {
            log.error("User with $userId doesn't exist.", e)
            generateErrorResponse(BAD_REQUEST, "User with $userId doesn't exist.")
        }

    @Suppress("HtmlRequiredLangAttribute")
    @GetMapping("/resetPassword/{userId}")
    fun resetPassword(@PathVariable userId: Long): ResponseEntity<*> =
        try {
            val userById = userService.getUserById(userId)
            val newPassword = generatePassword(8)
            userById.secret = passwordEncoder.encode(newPassword)

            emailService.sendEmailWithAttachment(
                to = userById.email,
                subject = "Virtual Museum Password Reset",
                body = """
            <html>
                <body>
                    <h2>Dear ${userById.name},</h2>
                    
                    <p>Your Virtual Museum account password has been reset. Below is your new password:</p>
                    
                    <p><strong>New Password:</strong> ${newPassword}</p>
                    
                    <p>Please use this password to log in to your Virtual Museum account.</p>
                    
                    <p>Thank you.</p>
                    
                    <p>Best regards,</p>
                    <p>Virtual Museum Support Team</p>
                </body>
            </html>
            """.trimIndent()
            )
            val changedUser = userRepository.saveAndFlush(userById)
            log.info { "User password is reseted successfully." }
            generateValidResponse(changedUser)
        } catch (e: Exception) {
            log.error("User with $userId doesn't exist.", e)
            generateErrorResponse(BAD_REQUEST, "User with $userId doesn't exist.")
        }

    data class JwtRequest(
        val username: String? = null,
        val password: String? = null
    ) : Serializable {
        companion object {
            private const val serialVersionUID = 5926468583005150707L
        }
    }


    class JwtResponse(val token: String, val userType: UserType) : Serializable {
        companion object {
            private const val serialVersionUID = -8091879091924046844L
        }
    }

    companion object {
        private val log = KotlinLogging.logger {}
    }

    private fun generatePassword(length: Int): String {
        val allowedChars = ('a'..'z') + ('A'..'Z') + ('0'..'9')
        return (1..length)
            .map { allowedChars.random() }
            .joinToString("")
    }
}

