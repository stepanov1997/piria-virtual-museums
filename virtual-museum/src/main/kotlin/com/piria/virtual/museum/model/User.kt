@file:Suppress("com.haulmont.jpb.DataClassEqualsAndHashCodeInspection")

package com.piria.virtual.museum.model

import com.fasterxml.jackson.annotation.JsonGetter
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonProperty.Access.*
import com.fasterxml.jackson.annotation.JsonSetter
import jakarta.persistence.*
import jakarta.persistence.EnumType.STRING
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

@Entity
@Table(name = "user")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name="firstName")
    val firstName: String,

    @Column(name="lastName")
    val lastName: String,

    @Column(name="email")
//    @Email(message = "Email should be valid")
    val email: String,

    @JsonProperty("username")
    @get:JsonGetter("username")
    @Column(name="username", unique = true)
//    @Min(value = 12, message = "Username character count should be greater than 12.")
//    @Pattern(regexp = "^[^@#/]+\$")
    val name: String,

    @JsonProperty("password", access = WRITE_ONLY)
    @Column(name="password")
//    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+\$", message = "The password must contain at least one lowercase letter, one uppercase letter, and one digit.")
//    @Min(value = 15, message = "Password character count should be greater than 15.")
    var secret: String,

    @Column(name="isRegistrationEnabled")
    var isRegistrationEnabled: Boolean = false,

    @Column(name="isBlocked")
    var isBlocked: Boolean = false,

    @JsonIgnore
    @OneToMany(mappedBy="user", cascade = [CascadeType.ALL])
    val activities: Set<UserActivity> = mutableSetOf(),

    @JsonIgnore
    @OneToMany(mappedBy="user", cascade = [CascadeType.ALL])
    val tickets: Set<Ticket> = mutableSetOf(),

    @Column(name="role")
    @Enumerated(STRING)
    val role: UserType = UserType.USER,

    @Column(name="lang")
    @Enumerated(STRING)
    var lang: Language = Language.en

) : UserDetails {
    @JsonIgnore(true)
    override fun getAuthorities(): Collection<GrantedAuthority> =
        listOf(SimpleGrantedAuthority(role.name))

    @JsonIgnore(true)
    @JsonGetter("password")
    override fun getPassword(): String = secret

    @JsonSetter("password")
    fun setPassword(password: String) {
        secret = password
    }

    override fun getUsername(): String = name

    override fun isAccountNonExpired(): Boolean = true

    override fun isAccountNonLocked(): Boolean = role==UserType.ADMIN || isRegistrationEnabled && !isBlocked

    override fun isCredentialsNonExpired(): Boolean = true

    override fun isEnabled(): Boolean = role==UserType.ADMIN || isRegistrationEnabled && !isBlocked
}

enum class Language {
    sr,
    en
}