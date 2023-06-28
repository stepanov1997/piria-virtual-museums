package com.piria.virtual.museum.config

import com.piria.virtual.museum.service.BankClientService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.support.WebClientAdapter
import org.springframework.web.service.invoker.HttpServiceProxyFactory
import java.time.Duration


@Configuration
class BankClientConfig {

    @Bean
    fun bankClient(): BankClientService? {
        val client = WebClient.builder()
            .baseUrl("https://localhost:3443")
            .build()
        val factory = HttpServiceProxyFactory
            .builder(WebClientAdapter.forClient(client))
            .blockTimeout(Duration.ofMinutes(7))
            .build()
        return factory.createClient(BankClientService::class.java)
    }
}