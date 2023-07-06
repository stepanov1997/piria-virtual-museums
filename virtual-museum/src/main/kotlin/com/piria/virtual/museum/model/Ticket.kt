package com.piria.virtual.museum.model

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*

@Entity
@Table(name = "ticket")
data class Ticket(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String? = null,

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @JsonIgnore
    @Column(name = "notificationSentBeforeStart")
    var notificationSentBeforeStart: Boolean = false,
    
    @JsonIgnore
    @Column(name = "notificationSentBeforeEnd")
    var notificationSentBeforeEnd: Boolean = false,

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="virtualVisitId", nullable=false)
    val virtualVisit: VirtualVisit
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null) return false
        if (other !is Ticket) {
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
