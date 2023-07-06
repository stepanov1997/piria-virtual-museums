package com.piria.virtual.museum.model

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*

@Entity
@Table(name = "museum")
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
    val type: String,

    @JsonIgnore
    @OneToMany(mappedBy="museum", cascade = [CascadeType.ALL])
    val items: Set<VirtualVisit> = mutableSetOf()
)

