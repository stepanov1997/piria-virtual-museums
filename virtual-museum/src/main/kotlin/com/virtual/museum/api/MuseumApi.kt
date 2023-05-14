package com.virtual.museum.api

import com.virtual.museum.model.Museum
import com.virtual.museum.service.MuseumService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/museums")
@CrossOrigin("*")
data class MuseumApi(private val museumService: MuseumService) {

    @GetMapping
    fun getAllMuseums(): List<Museum> = museumService.getAllMuseums()

    @GetMapping("/name/{name}")
    fun getMuseumsByName(@PathVariable name: String): List<Museum> = museumService.getMuseumsByName(name)

    @GetMapping("/city/{city}")
    fun getMuseumsByCity(@PathVariable city: String): List<Museum> = museumService.getMuseumsByCity(city)

    @GetMapping("/type/{type}")
    fun getMuseumsByType(@PathVariable type: String): List<Museum> = museumService.getMuseumsByType(type)

    @PostMapping
    fun saveMuseum(@RequestBody museum: Museum): Museum = museumService.saveMuseum(museum)

    @DeleteMapping("/{id}")
    fun deleteMuseumById(@PathVariable id: Long) = museumService.deleteMuseumById(id)
}
