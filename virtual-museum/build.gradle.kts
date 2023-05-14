import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot") version "3.0.6"
    id("io.spring.dependency-management") version "1.1.0"
    kotlin("jvm") version "1.7.22"
    kotlin("plugin.spring") version "1.7.22"
    kotlin("plugin.jpa") version "1.7.22"
}

group = "com.virtual.museum"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_18

repositories {
    mavenCentral()
}

dependencies {
    implementation("io.jsonwebtoken:jjwt-api:0.11.5")
    implementation("com.rometools:rome:1.15.0")
    implementation("org.jdom:jdom2:2.0.6")
    implementation("org.springframework.boot:spring-boot-starter-jdbc")
    implementation("mysql:mysql-connector-java:8.0.33")
    implementation("org.springframework.boot:spring-boot-starter-security:3.0.6")
    implementation("com.mysql:mysql-connector-j:8.0.33")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-tomcat:3.0.6")
    implementation("org.springframework.boot:spring-boot-starter-web:3.0.6")
    implementation("org.springframework.boot:spring-boot-starter-webflux:3.0.6")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("io.projectreactor.kotlin:reactor-kotlin-extensions")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor")
    implementation("com.github.docker-java:docker-java:3.3.0")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("io.projectreactor:reactor-test")
    implementation(kotlin("stdlib"))
}


tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "18"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}
