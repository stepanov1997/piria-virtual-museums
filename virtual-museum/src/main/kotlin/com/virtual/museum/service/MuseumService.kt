package com.virtual.museum.service

import com.virtual.museum.model.Museum
import com.virtual.museum.repository.MuseumRepository
import org.springframework.stereotype.Service

@Service
class MuseumService(private val museumRepository: MuseumRepository) {
    fun getAllMuseums(): List<Museum> = museumRepository.findAll()
    fun getMuseumsByName(name: String): List<Museum> = museumRepository.findAllByNameContainsIgnoreCase(name)
    fun getMuseumsByCity(city: String): List<Museum> = museumRepository.findAllByCityContainsIgnoreCase(city)
    fun getMuseumsByType(type: String): List<Museum> = museumRepository.findByType(type)
    fun saveMuseum(museum: Museum): Museum = museumRepository.save(museum)
    fun deleteMuseumById(id: Long) = museumRepository.deleteById(id)
}
