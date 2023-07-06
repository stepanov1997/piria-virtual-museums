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
) {
    final override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null) return false
        if (other !is UserActivity) {
            return false
        }

        return id != null && id == other.id
    }

    final override fun hashCode(): Int = javaClass.hashCode()

    @Override
    override fun toString(): String {
        return this::class.simpleName + "(id = $id )"
    }
}
