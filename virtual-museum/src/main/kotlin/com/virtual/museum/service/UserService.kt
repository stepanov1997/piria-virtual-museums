package com.virtual.museum.service

import com.virtual.museum.model.User
import com.virtual.museum.repository.UserRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class UserService(private val userRepository: UserRepository) : UserDetailsService {
    override fun loadUserByUsername(username: String): UserDetails =
        userRepository.findByName(username)
            ?: throw UsernameNotFoundException("User '$username' not found")

    fun createUser(user: User): User = userRepository.save(user)
    fun getAllUsers(): List<User> = userRepository.findAll()
    fun saveUser(user: User): User = userRepository.save(user)
    fun deleteUserById(id: Long) = userRepository.deleteById(id)
}
