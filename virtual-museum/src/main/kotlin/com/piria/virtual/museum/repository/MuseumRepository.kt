package com.piria.virtual.museum.repository

import com.piria.virtual.museum.model.Museum
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MuseumRepository : JpaRepository<Museum, Long> {
    fun findAllByNameContainsIgnoreCase(name: String): List<Museum>
    fun findAllByCityContainsIgnoreCase(city: String): List<Museum>
    fun findByType(type: String): List<Museum>
}
