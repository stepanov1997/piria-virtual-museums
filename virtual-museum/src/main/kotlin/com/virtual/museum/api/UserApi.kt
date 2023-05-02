package com.virtual.museum.api

import com.virtual.museum.model.User
import com.virtual.museum.service.UserService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserApi(private val userService: UserService) {
    @GetMapping
    fun getAllUsers(): List<User> = userService.getAllUsers()

    @PostMapping
    fun saveUser(@RequestBody user: User): User = userService.saveUser(user)

    @DeleteMapping("/{id}")
    fun deleteUserById(@PathVariable id: Long) = userService.deleteUserById(id)
}

