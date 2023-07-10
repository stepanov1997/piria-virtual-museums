package com.piria.virtual.museum.api

import com.piria.virtual.museum.model.Response
import com.piria.virtual.museum.service.BattutaService
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/battuta")
@CrossOrigin(originPatterns = ["*"])
class BattutaApi(
    @Value("\${battuta.api.key}") var battutaApiKey: String,
    val battutaService: BattutaService) {

    @GetMapping("/regions/{countryCode}")
    @PreAuthorize("hasAuthority('ADMIN')")
    fun getAllRegionsByCountryCode(@PathVariable countryCode: String): ResponseEntity<*> =
        try {
            val content =  battutaService.getRegions(countryCode, battutaApiKey)
            log.info { "Successfully retrieved regions from Battuta." }
            Response.generateValidResponse(content)
        } catch (e: Exception) {
            log.error("Error while retrieving regions from Battuta", e)
            Response.generateErrorResponse(
                HttpStatus.NO_CONTENT,
                "Error while retrieving regions from Battuta. Error: ${e.message}"
            )
        }


    @GetMapping("/cities/{countryCode}")
    @PreAuthorize("hasAuthority('ADMIN')")
    fun getAllCitiesByCountryCode(@PathVariable countryCode: String): ResponseEntity<*> =
        try {
            val content =  battutaService.getRegions(countryCode, battutaApiKey)
                .flatMap {
                    battutaService.getCities(it.country, it.region, battutaApiKey)
                }
            log.info { "Successfully retrieved cities from Battuta." }
            Response.generateValidResponse(content)
        } catch (e: Exception) {
            log.error("Error while retrieving cities from Battuta", e)
            Response.generateErrorResponse(
                HttpStatus.NO_CONTENT,
                "Error while retrieving cities from Battuta. Error: ${e.message}"
            )
        }

    companion object {
        private val log = KotlinLogging.logger {}
    }
}