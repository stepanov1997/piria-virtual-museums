@file:Suppress("com.haulmont.jpb.DataClassEqualsAndHashCodeInspection")

package com.piria.virtual.museum.model

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*

@Entity
@Table(name = "virtualvisit")
data class VirtualVisit(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column
    val datetime: String?,

    @Column
    val duration: String?,

    @Column
    val price: Double,

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "museum_id", nullable = false)
    val museum: Museum,

    @JsonIgnore
    @OneToMany(mappedBy = "virtualVisit", cascade = [CascadeType.ALL])
    val tickets: Set<Ticket> = mutableSetOf()
)
