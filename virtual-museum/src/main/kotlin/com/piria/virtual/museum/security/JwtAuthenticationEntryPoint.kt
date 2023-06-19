package com.piria.virtual.museum.security

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import mu.KotlinLogging
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.stereotype.Component
import java.io.IOException
import java.io.Serializable


@Component
class JwtAuthenticationEntryPoint : AuthenticationEntryPoint, Serializable {
    private val logger = KotlinLogging.logger {}

    @Throws(IOException::class)
    override fun commence(
        request: HttpServletRequest?, response: HttpServletResponse,
        authException: AuthenticationException?
    ) {
        logger.error { authException?.stackTraceToString() }
        if(response.status == 401) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")
        }
    }
    companion object {
        private const val serialVersionUID = -7858869558953243875L
    }
}