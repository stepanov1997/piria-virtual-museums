//package com.virtual.museum.security;
//
//import org.springframework.context.annotation.Bean
//import org.springframework.context.annotation.Configuration
//import org.springframework.http.HttpMethod
//import org.springframework.security.config.annotation.web.builders.HttpSecurity
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
//import org.springframework.security.web.SecurityFilterChain
//
//
//@Configuration
//@EnableWebSecurity
//class NewsSecurityConfig {
//
//    @Bean
//    fun newsFilterChain(http: HttpSecurity): SecurityFilterChain =
//        http.csrf().disable()
//            .httpBasic()
//            .and()
//            .authorizeHttpRequests {
//                it.requestMatchers(HttpMethod.GET, "/api/news/**").hasRole("USER")
//            }
//            .build()
//}
