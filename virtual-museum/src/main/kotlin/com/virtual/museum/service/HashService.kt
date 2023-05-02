package com.virtual.museum.service

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.security.SecureRandom
import java.util.*

@Service
class HashService : PasswordEncoder {
    private final val SALT_LENGTH = 32

    val passwordEncoder = BCryptPasswordEncoder()

    private fun getSaltFromHash(hashedPassword: String): String {
        return hashedPassword.substring(hashedPassword.length - SALT_LENGTH * 4 / 3)
    }

    private fun generateSalt(): ByteArray {
        val random = SecureRandom()
        val salt = ByteArray(SALT_LENGTH)
        random.nextBytes(salt)
        return salt
    }

    override fun encode(rawPassword: CharSequence?): String {
        val salt = generateSalt()
        val encoder = BCryptPasswordEncoder()
        return encoder.encode(rawPassword.toString() + Base64.getEncoder().encodeToString(salt))
    }

    override fun matches(rawPassword: CharSequence?, encodedPassword: String?): Boolean {
        return passwordEncoder.matches(rawPassword.toString() + getSaltFromHash(encodedPassword.toString()), encodedPassword)
    }
}
