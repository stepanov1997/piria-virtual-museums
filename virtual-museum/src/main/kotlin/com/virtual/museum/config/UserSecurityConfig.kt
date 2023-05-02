package com.virtual.museum.config

import com.virtual.museum.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain


@Configuration
@EnableWebSecurity
class UserSecurityConfig(val userService: UserService) {
    @Bean
    fun configure(http: HttpSecurity) : SecurityFilterChain =
        http.csrf().disable()
//            .httpBasic()
//            .and()
//            .authorizeHttpRequests{
//                it.requestMatchers(HttpMethod.GET, "/api/museums/").permitAll()
//                    .requestMatchers(HttpMethod.POST, "/api/museums/").hasRole("ADMIN")
//                    .requestMatchers(HttpMethod.DELETE, "/api/museums/").hasRole("ADMIN")
//                    .requestMatchers("/api/users/").hasRole("ADMIN")
//            }
            .build()

//    @Bean
//    fun authProvider(passwordEncoder: PasswordEncoder): DaoAuthenticationProvider? {
//        val authProvider = DaoAuthenticationProvider()
//        authProvider.setUserDetailsService(userService)
//        authProvider.setPasswordEncoder(passwordEncoder)
//        return authProvider
//    }
}

