package com.piria.virtual.museum.model

import jakarta.persistence.*

@Entity
@Table(name = "user_activity")
data class UserActivity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name="timestamp")
    val timestamp: Long,

    @Column(name="requestUrl")
    val requestUrl: String,

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,
)
