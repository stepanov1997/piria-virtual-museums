package com.virtual.museum.security

import com.virtual.museum.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter


@Configuration
@EnableMethodSecurity(prePostEnabled = true)
class SecurityConfig(val userService: UserService) {
    @Autowired
    private lateinit var jwtAuthenticationEntryPoint: JwtAuthenticationEntryPoint

    @Autowired
    private lateinit var jwtRequestFilter: JwtRequestFilter

    @Bean
    fun configure(http: HttpSecurity, authProvider: AuthenticationProvider): SecurityFilterChain =
        http.cors().and()
            .csrf().disable()
            .exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint).and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
            .authorizeHttpRequests {
                it.requestMatchers( HttpMethod.POST, "/api/users/authenticate").permitAll()
                  .requestMatchers( HttpMethod.POST, "/api/users").permitAll()
                  .anyRequest().authenticated();
            }
            .authenticationProvider(authProvider)
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter::class.java)
            .build()

    @Bean
    fun passwordEncoder() = BCryptPasswordEncoder()

    @Bean
    fun authProvider(passwordEncoder: PasswordEncoder): AuthenticationProvider? {
        val authProvider = DaoAuthenticationProvider()
        authProvider.setUserDetailsService(userService)
        authProvider.setPasswordEncoder(passwordEncoder)
        return authProvider
    }

    @Bean
    @Throws(Exception::class)
    fun authenticationManager(authenticationConfiguration: AuthenticationConfiguration?,
                              authenticationProvider: AuthenticationProvider): AuthenticationManager? {
        return authenticationConfiguration?.authenticationManager
    }
}
