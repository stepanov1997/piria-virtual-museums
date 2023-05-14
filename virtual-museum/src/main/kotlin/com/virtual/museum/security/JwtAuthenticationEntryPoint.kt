//package com.virtual.museum.security
//
//import jakarta.servlet.http.HttpServletRequest
//import jakarta.servlet.http.HttpServletResponse
//import org.springframework.security.core.AuthenticationException
//import org.springframework.security.web.AuthenticationEntryPoint
//import org.springframework.stereotype.Component
//import java.io.IOException
//import java.io.Serializable
//
//
//@Component
//class JwtAuthenticationEntryPoint : AuthenticationEntryPoint, Serializable {
//    @Throws(IOException::class)
//    override fun commence(
//        request: HttpServletRequest?, response: HttpServletResponse,
//        authException: AuthenticationException?
//    ) {
//        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")
//    }
//    companion object {
//        private const val serialVersionUID = -7858869558953243875L
//    }
//}