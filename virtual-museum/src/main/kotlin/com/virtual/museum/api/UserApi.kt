package com.virtual.museum.api

import com.virtual.museum.model.User
import com.virtual.museum.service.UserService
import com.virtual.museum.util.JwtTokenUtil
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType.APPLICATION_JSON_VALUE
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.DisabledException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*
import java.io.Serializable

@RestController
@RequestMapping("/api/users")
@CrossOrigin(originPatterns = ["*"])
class UserApi(private val userService: UserService) {

    @Autowired
    private lateinit var authenticationManager : AuthenticationManager;

    @Autowired
    private lateinit var jwtTokenUtil : JwtTokenUtil

    @Autowired
    private lateinit var passwordEncoder: PasswordEncoder

    @PostMapping("/authenticate", consumes = [APPLICATION_JSON_VALUE], produces = [APPLICATION_JSON_VALUE])
    fun createAuthenticationToken(@RequestBody authenticationRequest:JwtRequest): ResponseEntity<*> {

        if(authenticationRequest.username.isNullOrEmpty()) {
            return ResponseEntity.badRequest().body(mapOf("error" to "Username should not be null or empty."))
        }

        if(authenticationRequest.password.isNullOrEmpty()) {
            return ResponseEntity.badRequest().body(mapOf("error" to "Password should not be null or empty."))
        }

        authenticate(authenticationRequest.username, authenticationRequest.password);

        val userDetails: UserDetails = userService
            .loadUserByUsername(authenticationRequest.username);

        val token: String = jwtTokenUtil.generateToken(userDetails);

        return ResponseEntity.ok(JwtResponse(token));
    }

    fun authenticate(username:String, password:String) {
        try {
            val authentication = authenticationManager.authenticate(UsernamePasswordAuthenticationToken(username, password))
            SecurityContextHolder.getContext().authentication = authentication;
            authentication.principal
        } catch (e: DisabledException) {
            throw Exception("USER_DISABLED", e);
        } catch (e: BadCredentialsException) {
            throw Exception("INVALID_CREDENTIALS", e);
        }
    }

    @GetMapping
    fun getAllUsers(): List<User> = userService.getAllUsers()

    @PostMapping
    fun saveUser(@RequestBody user: User): User {
        user.secret = passwordEncoder.encode(user.secret)
        return userService.saveUser(user)
    }

    @DeleteMapping("/{id}")
    fun deleteUserById(@PathVariable id: Long) = userService.deleteUserById(id)


    data class JwtRequest(
        val username: String?,
        val password: String?
    ) : Serializable {
        companion object {
            private const val serialVersionUID = 5926468583005150707L
        }
    }


    class JwtResponse(val token: String) : Serializable {
        companion object {
            private const val serialVersionUID = -8091879091924046844L
        }
    }


}

