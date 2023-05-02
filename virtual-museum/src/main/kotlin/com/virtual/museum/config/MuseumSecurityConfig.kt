package com.virtual.museum.config;

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain


@Configuration
@EnableWebSecurity
class MuseumSecurityConfig {

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain =
        http.csrf().disable()
//            .httpBasic()
//            .and()
//            .authorizeHttpRequests {
//                it.requestMatchers(HttpMethod.GET, "/api/museums/**").permitAll()
//                    .requestMatchers(HttpMethod.POST, "/api/museums/**").hasRole("ADMIN")
//                    .requestMatchers(HttpMethod.DELETE, "/api/museums/**").hasRole("ADMIN")
//            }
            .build()
}
