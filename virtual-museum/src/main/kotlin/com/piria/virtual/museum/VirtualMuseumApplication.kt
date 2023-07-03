package com.piria.virtual.museum

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.devtools.restart.RestartScope
import org.springframework.boot.runApplication
import org.springframework.boot.testcontainers.service.connection.ServiceConnection
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.testcontainers.containers.MySQLContainer
import java.io.File


@SpringBootApplication
class VirtualMuseumApplication

fun main(args: Array<String>) {
    val truststorePath = VirtualMuseumApplication::class.java.classLoader.getResource("truststore.jks")?.path?.let {
        File(it).absolutePath
    }
    println(truststorePath)
    System.setProperty("javax.net.ssl.trustStore", truststorePath ?: throw RuntimeException("Truststore file doesn't exist."))
    System.setProperty("javax.net.ssl.trustStorePassword", "sigurnost")

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


