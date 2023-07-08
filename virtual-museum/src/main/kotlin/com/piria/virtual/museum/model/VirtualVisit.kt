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
    val datetime: String,

    @Column
    val duration: Double,

    @Column
    val price: Double,

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "museum_id", nullable = false)
    val museum: Museum,

    @JsonIgnore
    @OneToMany(mappedBy = "virtualVisit", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    val tickets: Set<Ticket> = mutableSetOf(),

    @JsonIgnore
    @OneToOne(cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    @JoinColumn(name = "virtual_presentation_id")
    val virtualPresentation: VirtualPresentation
) {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as VirtualVisit

        return id == other.id
    }

    override fun hashCode(): Int {
        return id?.hashCode() ?: 0
    }
}
