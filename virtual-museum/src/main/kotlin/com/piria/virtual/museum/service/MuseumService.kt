package com.piria.virtual.museum.service

import com.piria.virtual.museum.model.Museum
import com.piria.virtual.museum.repository.MuseumRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class MuseumService(private val museumRepository: MuseumRepository) {
    fun getAllMuseums(): List<Museum> = museumRepository.findAll()
    fun getMuseumsByName(name: String): List<Museum> = museumRepository.findAllByNameContainsIgnoreCase(name)
    fun getMuseumsById(id: Long): Museum = museumRepository.findByIdOrNull(id) ?: throw UsernameNotFoundException("Museum id=$id is invalid.")
    fun getMuseumsByCity(city: String): List<Museum> = museumRepository.findAllByCityContainsIgnoreCase(city)
    fun getMuseumsByType(type: String): List<Museum> = museumRepository.findByType(type)
    fun saveMuseum(museum: Museum): Museum = museumRepository.save(museum)
    fun deleteMuseumById(id: Long) = museumRepository.deleteById(id)
}
