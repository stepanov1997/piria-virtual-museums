package com.piria.virtual.museum.service

import com.piria.virtual.museum.model.UserActivity
import com.piria.virtual.museum.repository.UserActivityRepository
import org.springframework.stereotype.Service

@Service
class UserActivityService(private val userActivityRepository: UserActivityRepository) {
    fun save(userActivity: UserActivity): UserActivity = userActivityRepository.saveAndFlush(userActivity)
    fun getActiveUsersByHour(): List<*> = userActivityRepository.getActiveUsersByHour()
    fun getCurrentlyActiveUsers(): Int = userActivityRepository.getCurrentlyActiveUsers()
}