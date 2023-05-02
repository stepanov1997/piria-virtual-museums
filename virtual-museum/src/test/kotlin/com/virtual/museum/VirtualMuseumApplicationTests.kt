package com.virtual.museum

import com.virtual.museum.repository.MuseumRepository
import com.virtual.museum.repository.UserRepository
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean

@SpringBootTest
class VirtualMuseumApplicationTests {

    @MockBean
    lateinit var museumRepository: MuseumRepository;

    @MockBean
    lateinit var userRepository: UserRepository;

    @Test
    fun contextLoads() {}
}
