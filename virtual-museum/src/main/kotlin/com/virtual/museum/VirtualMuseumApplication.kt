package com.virtual.museum

import com.github.dockerjava.api.DockerClient
import com.github.dockerjava.core.DefaultDockerClientConfig
import com.github.dockerjava.core.DockerClientBuilder
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class VirtualMuseumApplication

fun main(args: Array<String>) {
    Runtime.getRuntime().addShutdownHook(Thread{
        val dockerConfig = DefaultDockerClientConfig.createDefaultConfigBuilder().build()
        val dockerClient: DockerClient = DockerClientBuilder.getInstance(dockerConfig).build()
        val removeContainerCmd = dockerClient.removeContainerCmd("mysql").withForce(true)
        removeContainerCmd.exec()
        println("MySQL kontejner je uklonjen.")
    })
    runApplication<VirtualMuseumApplication>(*args)
}
