package com.piria.virtual.museum.security

import com.piria.virtual.museum.service.UserActivityService
import com.piria.virtual.museum.service.UserService
import com.piria.virtual.museum.util.JwtTokenUtil
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
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer


@Configuration
@EnableMethodSecurity(prePostEnabled = true)
class SecurityConfig(val userService: UserService,
                     val jwtTokenUtil: JwtTokenUtil,
                     val userActivityService: UserActivityService) : WebMvcConfigurer {
    @Autowired
    private lateinit var jwtAuthenticationEntryPoint: JwtAuthenticationEntryPoint

    @Autowired
    private lateinit var jwtRequestFilter: JwtRequestFilter

    @Bean
    fun configure(http: HttpSecurity, authProvider: AuthenticationProvider): SecurityFilterChain =
        http.cors {}
            .csrf {
                it.disable()
            }
            .exceptionHandling {
                it.authenticationEntryPoint(jwtAuthenticationEntryPoint)
            }
            .sessionManagement {
                it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            .authorizeHttpRequests {
                it.requestMatchers( HttpMethod.POST, "/api/users/authenticate").permitAll()
                  .requestMatchers( HttpMethod.GET, "/api/battuta/**").permitAll()
                  .requestMatchers( HttpMethod.POST, "/api/users/register").permitAll()
                  .requestMatchers( HttpMethod.GET, "/api/news").permitAll()
                  .requestMatchers( HttpMethod.GET, "/api/users/**").permitAll()
                  .requestMatchers( HttpMethod.GET, "/api").permitAll()
                  .requestMatchers( HttpMethod.GET, "/api/ticket/job/**").permitAll()
                  .anyRequest().authenticated()
            }
            .authenticationProvider(authProvider)
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter::class.java)
            .build()

    override fun addInterceptors(registry: InterceptorRegistry) {
        registry.addInterceptor(ActivityInterceptor(jwtTokenUtil, userService, userActivityService))
    }

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
