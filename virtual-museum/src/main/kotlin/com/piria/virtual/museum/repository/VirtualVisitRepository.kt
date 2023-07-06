package com.piria.virtual.museum.repository

import com.piria.virtual.museum.model.VirtualVisit
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface VirtualVisitRepository: JpaRepository<VirtualVisit, Long> {
    fun getAllByMuseumId(museumId: Long): List<VirtualVisit>
}