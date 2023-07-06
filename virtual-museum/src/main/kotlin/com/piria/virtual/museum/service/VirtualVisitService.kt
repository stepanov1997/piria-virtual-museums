package com.piria.virtual.museum.service

import com.piria.virtual.museum.model.VirtualVisit
import com.piria.virtual.museum.repository.VirtualVisitRepository
import org.springframework.stereotype.Service

@Service
class VirtualVisitService(private val virtualVisitRepository: VirtualVisitRepository) {
    fun getById(virtualVisitId: Long) = virtualVisitRepository.getReferenceById(virtualVisitId)
    fun getAllByMuseumId(museumId: Long): List<VirtualVisit> = virtualVisitRepository.getAllByMuseumId(museumId)
    fun getAll(): List<VirtualVisit> = virtualVisitRepository.findAll()
    fun save(virtualVisit: VirtualVisit): VirtualVisit = virtualVisitRepository.saveAndFlush(virtualVisit)
}