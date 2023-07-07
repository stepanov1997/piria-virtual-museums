package com.piria.virtual.museum.api

import com.piria.virtual.museum.model.Museum
import com.piria.virtual.museum.model.Response
import com.piria.virtual.museum.service.MuseumService
import mu.KotlinLogging
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType.*
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/museums")
@CrossOrigin(originPatterns = ["*"])
data class MuseumApi(private val museumService: MuseumService) {

    @GetMapping
    fun getAllMuseums(): ResponseEntity<*> =
        try {
            val content = museumService.getAllMuseums()
            log.info { "Successful retrieved museums." }
            Response.generateValidResponse(content)
        } catch (e: Exception) {
            log.error("Error while retrieving museums.", e)
            Response.generateErrorResponse(HttpStatus.NO_CONTENT, "Error while retrieving museums. Error: ${e.message}")
        }

    @GetMapping("/name/{name}")
    fun getMuseumsByName(@PathVariable name: String): ResponseEntity<*> =
        try {
            val content = museumService.getMuseumsByName(name)
            log.info { "Successful retrieved museums by name." }
            Response.generateValidResponse(content)
        } catch (e: Exception) {
            log.error("Error while retrieving museums by name.", e)
            Response.generateErrorResponse(HttpStatus.NO_CONTENT, "Error while retrieving museums by name. Error: ${e.message}")
        }

    @GetMapping("/city/{city}")
    fun getMuseumsByCity(@PathVariable city: String): ResponseEntity<*> =
        try {
            val content =  museumService.getMuseumsByCity(city)
            log.info { "Successful retrieved museums by city." }
            Response.generateValidResponse(content)
        } catch (e: Exception) {
            log.error("Error while retrieving museums by city.", e)
            Response.generateErrorResponse(HttpStatus.NO_CONTENT, "Error while retrieving museums by city. Error: ${e.message}")
        }


    @GetMapping("/type/{type}")
    fun getMuseumsByType(@PathVariable type: String): ResponseEntity<*> =
        try {
            val content =  museumService.getMuseumsByType(type)
            log.info { "Successful retrieved museums by type." }
            Response.generateValidResponse(content)
        } catch (e: Exception) {
            log.error("Error while retrieving museums by type.", e)
            Response.generateErrorResponse(HttpStatus.NO_CONTENT, "Error while retrieving museums by type. Error: ${e.message}")
        }

    @PostMapping(consumes = [APPLICATION_JSON_VALUE])
    fun saveMuseum(@RequestBody museum: Museum): ResponseEntity<*> =
        try {
            val content =  museumService.saveMuseum(museum)
            log.info { "Successful saved museum." }
            Response.generateValidResponse(content)
        } catch (e: Exception) {
            log.error("Error while saving museum.", e)
            Response.generateErrorResponse(HttpStatus.NO_CONTENT, "Error while saving museum. Error: ${e.message}")
        }

    companion object {
        private val log = KotlinLogging.logger {}
    }
}
