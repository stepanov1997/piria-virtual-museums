package com.piria.virtual.museum.api

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class TestApi {

    @GetMapping("/api")
    fun test(): String {
        return "1"
    }
}