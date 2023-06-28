package com.piria.virtual.museum

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.devtools.restart.RestartScope
import org.springframework.boot.runApplication
import org.springframework.boot.testcontainers.service.connection.ServiceConnection
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.testcontainers.containers.MySQLContainer


@SpringBootApplication
class VirtualMuseumApplication

fun main(args: Array<String>) {
    System.setProperty("javax.net.ssl.trustStore", "C:\\Users\\stepa\\IdeaProjects\\piria\\virtual-museum\\src\\main\\resources\\bank-server.jks");
    System.setProperty("javax.net.ssl.trustStorePassword", "sigurnost");

    SpringApplication
        .from { runApplication<VirtualMuseumApplication>() }
        .with(TestContainersConfiguration::class.java)
        .run(*args)
}

@Configuration(proxyBeanMethods = false)
class TestContainersConfiguration {
    @Bean("database1")
    @ServiceConnection
    @RestartScope
    fun mysqlContainer(): MySQLContainer<*> = MySQLContainer("mysql:8.0.33")
        .withDatabaseName("museum")
        .withPassword("password")
        .withExposedPorts(3306)
}


