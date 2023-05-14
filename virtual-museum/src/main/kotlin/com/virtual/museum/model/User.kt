package com.virtual.museum.model

import com.fasterxml.jackson.annotation.JsonGetter
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonProperty.Access.*
import com.fasterxml.jackson.annotation.JsonSetter
import jakarta.persistence.*
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name="firstName")
    val firstName: String,

    @Column(name="lastName")
    val lastName: String,

    @Column(name="email")
    val email: String,

    @JsonProperty("username")
    @get:JsonGetter("username")
    @Column(name="username", unique = true)
    val name: String,

    @JsonProperty("password", access = WRITE_ONLY)
    @Column(name="password")
    var secret: String,

    @JsonIgnore(true)
    @ElementCollection(fetch = FetchType.EAGER)
    val roles: Set<String> = setOf("USER")

) : UserDetails {
    @JsonIgnore(true)
    override fun getAuthorities(): Collection<GrantedAuthority> =
        roles.map { SimpleGrantedAuthority(it) }

    @JsonIgnore(true)
    @JsonGetter("password")
    override fun getPassword(): String = secret

    @JsonSetter("password")
    fun setPassword(password: String) {
        secret = password
    }

    override fun getUsername(): String = name

    override fun isAccountNonExpired(): Boolean = true

    override fun isAccountNonLocked(): Boolean = true

    override fun isCredentialsNonExpired(): Boolean = true

    override fun isEnabled(): Boolean = true
}
