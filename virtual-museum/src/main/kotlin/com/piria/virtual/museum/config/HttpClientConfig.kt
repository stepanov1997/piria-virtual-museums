package com.piria.virtual.museum.config

import com.piria.virtual.museum.service.BankClientService
import com.piria.virtual.museum.service.BattutaService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.env.Environment
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.support.WebClientAdapter
import org.springframework.web.service.invoker.HttpServiceProxyFactory
import java.time.Duration


@Configuration
class HttpClientConfig {

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

    @Bean
    fun battutaClient(environment: Environment): BattutaService? {
        val client = WebClient.create()
        val factory = HttpServiceProxyFactory
            .builder(WebClientAdapter.forClient(client))
            .blockTimeout(Duration.ofMinutes(2))
            .build()
        return factory.createClient(BattutaService::class.java)
    }
}