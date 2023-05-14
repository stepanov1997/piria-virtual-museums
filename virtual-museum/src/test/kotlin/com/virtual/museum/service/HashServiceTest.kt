package com.virtual.museum.service

import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

class HashServiceTest {

    @Test
    fun test() {
        val test = "test"
        val hashService = BCryptPasswordEncoder()
        val matches = hashService.matches(test, hashService.encode(test))
        Assertions.assertTrue(matches)
    }
}