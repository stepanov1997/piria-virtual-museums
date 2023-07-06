package com.piria.virtual.museum.service

import com.piria.virtual.museum.model.VirtualPresentation
import com.piria.virtual.museum.repository.VirtualPresentationRepository
import org.springframework.stereotype.Service

@Service
class VirtualPresentationService(val virtualPresentationRepository: VirtualPresentationRepository) {
    fun save(virtualPresentation: VirtualPresentation): VirtualPresentation = virtualPresentationRepository.save(virtualPresentation)
}