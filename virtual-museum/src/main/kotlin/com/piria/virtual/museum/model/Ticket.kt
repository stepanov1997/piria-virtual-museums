package com.piria.virtual.museum.model

import jakarta.persistence.*

@Entity
@Table(name = "ticket")
data class Ticket(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String? = null,

    @ManyToOne
    @JoinColumn(name="virtualVisitId", nullable=false)
    val virtualVisit: VirtualVisit
)
