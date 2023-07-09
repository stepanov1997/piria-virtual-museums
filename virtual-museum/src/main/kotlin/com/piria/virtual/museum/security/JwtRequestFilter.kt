package com.piria.virtual.museum.security

import com.piria.virtual.museum.service.UserService
import com.piria.virtual.museum.util.JwtTokenUtil
import io.jsonwebtoken.ExpiredJwtException
import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.io.IOException


@Component
class JwtRequestFilter(private val userService: UserService) : OncePerRequestFilter() {
    private val log = KotlinLogging.logger {}

    @Autowired
    private lateinit var jwtTokenUtil: JwtTokenUtil

    @Throws(ServletException::class, IOException::class)
    override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, chain: FilterChain) {
        var jwtToken: String? = null

        val requestTokenHeader = request.getHeader("Authorization")
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            // Token found in the Authorization header
            jwtToken = requestTokenHeader.substring(7)
        } else {
            // Token not found in the Authorization header, check query parameter
            val tokenFromQueryParam = request.getParameter("token")
            if (tokenFromQueryParam != null) {
                jwtToken = tokenFromQueryParam
            }
        }

        if (jwtToken != null) {
            try {
                val username = jwtTokenUtil.getUsernameFromToken(jwtToken)

                if (SecurityContextHolder.getContext().authentication == null) {
                    val userDetails: UserDetails = userService.loadUserByUsername(username)

                    if (jwtTokenUtil.validateToken(jwtToken, userDetails)) {
                        val usernamePasswordAuthenticationToken = UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.authorities
                        )
                        usernamePasswordAuthenticationToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                        SecurityContextHolder.getContext().authentication = usernamePasswordAuthenticationToken
                    }
                }
            } catch (e: IllegalArgumentException) {
                println("Unable to get JWT Token")
                log.error { e.stackTraceToString() }
            } catch (e: ExpiredJwtException) {
                println("JWT Token has expired")
                log.error { e.stackTraceToString() }
            }
        } else {
            log.warn("JWT Token not found")
        }

        chain.doFilter(request, response)
    }
}