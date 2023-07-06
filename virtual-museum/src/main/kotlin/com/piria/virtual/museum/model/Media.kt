package com.piria.virtual.museum.model
import jakarta.persistence.*

@Entity
@Table(name = "media")
data class Media(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    val id: Long? = null,

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    val mediaType: MediaType,

    @Lob
    @Column(name = "content", nullable = false, columnDefinition = "LONGTEXT")
    val content: String,

    @ManyToOne
    @JoinColumn(name = "virtual_presentation_id", nullable = true)
    val virtualPresentation: VirtualPresentation? = null
)