package com.piria.virtual.museum.service

import com.piria.virtual.museum.repository.VirtualVisitRepository
import org.springframework.stereotype.Service

@Service
class VirtualVisitService(private val virtualVisitRepository: VirtualVisitRepository) {
    fun getById(virtualVisitId: Long) = virtualVisitRepository.getReferenceById(virtualVisitId)
    fun getAllByMuseumId(museumId: Long) = virtualVisitRepository.getAllByMuseumId(museumId)
}