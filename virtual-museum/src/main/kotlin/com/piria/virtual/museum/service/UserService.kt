package com.piria.virtual.museum.service

import com.piria.virtual.museum.model.User
import com.piria.virtual.museum.repository.UserRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class UserService(private val userRepository: UserRepository) : UserDetailsService {
    override fun loadUserByUsername(username: String): UserDetails =
        userRepository.findByName(username)
            ?: throw UsernameNotFoundException("User '$username' not found")

    fun userExists(username: String): Boolean = userRepository.existsUserByName(username)
    fun createUser(user: User): User = userRepository.save(user)
    fun getAllUsers(): List<User> = userRepository.findAll()
    fun saveUser(user: User): User = userRepository.save(user)
    fun deleteUserById(id: Long) = userRepository.deleteById(id)
    fun getUserById(id: Long) = userRepository.getReferenceById(id)
}

