package com.piria.virtual.museum.model
import com.fasterxml.jackson.annotation.JsonIgnore
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

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "virtual_presentation_id", nullable = true)
    val virtualPresentation: VirtualPresentation? = null
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null) return false
        if (other !is Media) {
            return false
        }
        return id != null && id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()

    @Override
    override fun toString(): String {
        return this::class.simpleName + "(id = $id , mediaType = $mediaType , content = $content )"
    }
}