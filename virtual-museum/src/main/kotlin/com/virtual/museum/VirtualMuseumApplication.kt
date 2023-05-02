package com.virtual.museum

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class VirtualMuseumApplication

fun main(args: Array<String>) {
    runApplication<VirtualMuseumApplication>(*args)
}
