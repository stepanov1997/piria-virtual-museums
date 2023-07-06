package com.piria.virtual.museum.service

import com.piria.virtual.museum.model.battuta.BattutaCityResponse
import com.piria.virtual.museum.model.battuta.BattutaRegionResponse
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.service.annotation.GetExchange
import org.springframework.web.service.annotation.HttpExchange

@HttpExchange("http://battuta.medunes.net/api")
interface BattutaService {
    @GetExchange("/region/{countryCode}/all/?key={battutaApiKey}")
    fun getRegions(@PathVariable countryCode: String, @PathVariable battutaApiKey: String) : List<BattutaRegionResponse>
    @GetExchange("/city/{countryCode}/search/?region={region}&key={battutaApiKey}")
    fun getCities(@PathVariable countryCode: String, @PathVariable region: String, @PathVariable battutaApiKey: String) : List<BattutaCityResponse>
}

