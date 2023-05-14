package com.virtual.museum.security

import com.virtual.museum.service.UserService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.ProviderManager
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.crypto.password.PasswordEncoder


@Configuration
@EnableWebSecurity
class UserSecurityConfig(val userService: UserService) {
//    @Autowired
//    private lateinit var jwtAuthenticationEntryPoint: JwtAuthenticationEntryPoint
//
//    @Autowired
//    private lateinit var jwtRequestFilter: JwtRequestFilter

//    @Bean
//    fun configure(http: HttpSecurity): SecurityFilterChain =
//        http.csrf().disable()
//            .authorizeHttpRequests {
//                it.requestMatchers(HttpMethod.POST, "/api/users/authenticate").permitAll()
//                    .anyRequest().authenticated()
//                    .and()
//                    .exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint)
//                    .and()
//                    .sessionManagement()
//                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
//            }.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter::class.java)
//            .build();
////            .authorizeHttpRequests {
////                it.requestMatchers(HttpMethod.POST, "/api/user").hasRole("ADMIN")
////                  .anyRequest().authenticated()
////            }
////            .httpBasic()
////            .and()
////            .authorizeHttpRequests{
////                it.requestMatchers(HttpMethod.GET, "/api/museums/").permitAll()
////                    .requestMatchers(HttpMethod.POST, "/api/museums/").hasRole("ADMIN")
////                    .requestMatchers(HttpMethod.DELETE, "/api/museums/").hasRole("ADMIN")
////                    .requestMatchers("/api/users/").hasRole("ADMIN")
////            }


    @Bean
    fun authProvider(passwordEncoder: PasswordEncoder): DaoAuthenticationProvider? {
        val authProvider = DaoAuthenticationProvider()
        authProvider.setUserDetailsService(userService)
        authProvider.setPasswordEncoder(passwordEncoder)
        return authProvider
    }

    @Bean
    @Throws(Exception::class)
    fun authenticationManager(authenticationConfiguration: AuthenticationConfiguration?,
                              authenticationProvider: AuthenticationProvider): AuthenticationManager? {
        return ProviderManager(authenticationProvider)
    }
}
