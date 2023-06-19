package com.piria.virtual.museum

import com.piria.virtual.museum.repository.MuseumRepository
import com.piria.virtual.museum.repository.UserRepository
import org.junit.jupiter.api.Test
import org.springframework.boot.test.mock.mockito.MockBean

class VirtualMuseumApplicationTests {

    @MockBean
    lateinit var museumRepository: MuseumRepository;

    @MockBean
    lateinit var userRepository: UserRepository;

    @Test
    fun contextLoads() {}
}
