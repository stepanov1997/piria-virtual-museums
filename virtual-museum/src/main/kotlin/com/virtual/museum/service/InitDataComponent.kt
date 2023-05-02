package com.virtual.museum.service

import com.github.javafaker.Faker
import com.virtual.museum.model.Museum
import com.virtual.museum.model.User
import com.virtual.museum.repository.MuseumRepository
import com.virtual.museum.repository.UserRepository
import jakarta.annotation.PostConstruct
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Component

@Component
class InitDataComponent(
    private val museumRepository: MuseumRepository,
    private val userRepository: UserRepository,
    private val hashService: HashService
) {
    @PostConstruct
    fun init() {
        val faker = Faker()
        populateMuseums(faker, 50)
        populateUsers(faker, 10)
    }

    private fun populateMuseums(faker: Faker, numberOfRecords: Int) {
        (0 until numberOfRecords)
            .map {
                Museum(
                    name = faker.company().name(),
                    address = faker.address().streetAddress(),
                    city = faker.harryPotter().location(),
                    country = faker.lordOfTheRings().location(),
                    latitude = faker.address().latitude().toDouble(),
                    longitude = faker.address().longitude().toDouble(),
                    phoneNumber = faker.phoneNumber().cellPhone(),
                    type = faker.book().genre()
                )
            }.forEach { museumRepository.save(it) }
    }

    private fun populateUsers(faker: Faker, numberOfRecords: Int) {
        val names = generateSequence(0) { it + 1 }
            .map { faker.lordOfTheRings().character() }
            .distinct()
            .filter { userRepository.findByName(it) == null }
            .take(numberOfRecords)
            .toList()

        userRepository
        (0 until numberOfRecords)
            .map {
                val password = faker.chuckNorris().fact()
                println("${names[it]} ---> $password")
                User(
                    name = names[it],
                    secret = hashService.encode(password)
                )
            }.forEach { userRepository.save(it) }
    }
}
