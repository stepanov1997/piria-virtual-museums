package com.virtual.museum.repository

import com.virtual.museum.model.Museum
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MuseumRepository : JpaRepository<Museum, Long> {
    fun findAllByCity(city: String): List<Museum>
    fun findByType(type: String): List<Museum>
}
