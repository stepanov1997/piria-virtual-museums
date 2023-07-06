@file:Suppress("com.haulmont.jpb.DataClassEqualsAndHashCodeInspection")

package com.piria.virtual.museum.model

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*

@Entity
@Table(name = "virtualpresentation")
data class VirtualPresentation(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    var id: Long? = null,

    @JsonIgnore
    @OneToMany(mappedBy="virtualPresentation", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    val medias: Set<Media>,

    @JsonIgnore
    @OneToOne(optional = false, mappedBy = "virtualPresentation", fetch = FetchType.EAGER)
    val virtualVisit: VirtualVisit? = null
)
