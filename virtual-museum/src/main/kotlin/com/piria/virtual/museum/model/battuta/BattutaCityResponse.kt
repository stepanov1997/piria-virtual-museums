package com.piria.virtual.museum.model.battuta

data class BattutaCityResponse(
    val city: String,
    val region: String,
    val country: String,
    val latitude: Double,
    val longitude: Double,
)