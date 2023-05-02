package com.virtual.museum.model

import jakarta.persistence.*

@Entity
@Table(name = "museums")
data class Museum(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    val name: String,
    val address: String,
    val phoneNumber: String,
    val city: String,
    val country: String,
    val latitude: Double,
    val longitude: Double,
    val type: String
)

