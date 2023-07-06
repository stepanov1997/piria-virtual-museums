@file:Suppress("com.haulmont.jpb.DataClassEqualsAndHashCodeInspection")

package com.piria.virtual.museum.model

import jakarta.persistence.*

@Entity
@Table(name = "virtualpresentation")
data class VirtualPresentation(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    var id: Long? = null,

    @OneToMany(mappedBy="virtualPresentation", cascade = [CascadeType.ALL])
    val medias: Set<Media>,

    @OneToOne(optional = false, mappedBy = "virtualPresentation")
    val virtualVisit: VirtualVisit? = null
)
