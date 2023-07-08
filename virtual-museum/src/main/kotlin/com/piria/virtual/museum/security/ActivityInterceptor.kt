package com.piria.virtual.museum.security

import com.piria.virtual.museum.model.UserActivity
import com.piria.virtual.museum.service.UserActivityService
import com.piria.virtual.museum.service.UserService
import com.piria.virtual.museum.util.JwtTokenUtil
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders
import org.springframework.web.servlet.HandlerInterceptor
import java.time.ZoneId
import java.time.ZonedDateTime

class ActivityInterceptor(
    val jwtTokenUtil: JwtTokenUtil,
    val userService: UserService,
    val userActivityService: UserActivityService,
) : HandlerInterceptor {
    override fun afterCompletion(
        request: HttpServletRequest,
        response: HttpServletResponse,
        handler: Any,
        ex: Exception?
    ) {
        val jwtToken = request.getHeader(HttpHeaders.AUTHORIZATION)?.substring(7) ?: return
        val usernameFromToken = jwtTokenUtil.getUsernameFromToken(jwtToken)
        val user = userService.loadUserByUsername(usernameFromToken)
        userActivityService.save(
            UserActivity(
                timestamp = ZonedDateTime.now(ZoneId.systemDefault()).toEpochSecond(),
                requestUrl = request.requestURL.toString(),
                user = user
            )
        )
    }
}