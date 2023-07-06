package com.piria.virtual.museum.api

import com.piria.virtual.museum.model.battuta.BattutaCityResponse
import com.piria.virtual.museum.model.battuta.BattutaRegionResponse
import com.piria.virtual.museum.service.BattutaService
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/battuta")
@CrossOrigin(originPatterns = ["*"])
class BattutaApi(
    @Value("\${battuta.api.key}") var battutaApiKey: String,
    val battutaService: BattutaService) {

    @GetMapping("/regions/{countryCode}")
    fun getAllRegionsByCountryCode(@PathVariable countryCode: String): List<BattutaRegionResponse> = battutaService.getRegions(countryCode, battutaApiKey)

    @GetMapping("/cities/{countryCode}")
    fun getAllCitiesByCountryCode(@PathVariable countryCode: String): List<BattutaCityResponse> {
        return battutaService.getRegions(countryCode, battutaApiKey)
            .flatMap {
                battutaService.getCities(it.country, it.region, battutaApiKey)
            }
    }

}