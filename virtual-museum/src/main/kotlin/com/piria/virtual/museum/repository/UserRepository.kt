package com.piria.virtual.museum.repository

import com.piria.virtual.museum.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByName(name : String) : User?
    fun existsUserByName(name: String) : Boolean
}