
import com.bmuschko.gradle.docker.tasks.container.DockerCreateContainer
import com.bmuschko.gradle.docker.tasks.container.DockerKillContainer
import com.bmuschko.gradle.docker.tasks.container.DockerStartContainer
import com.bmuschko.gradle.docker.tasks.container.DockerStopContainer
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("com.bmuschko.docker-remote-api") version "7.0.0"
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
    implementation("org.springframework.boot:spring-boot-starter-jdbc")
    implementation("mysql:mysql-connector-java:8.0.33")
    implementation("org.springframework.boot:spring-boot-starter-security:3.0.6")
    implementation("com.mysql:mysql-connector-j:8.0.33")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-tomcat:3.0.6")
    implementation("org.springframework.boot:spring-boot-starter-web:3.0.6")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("io.projectreactor.kotlin:reactor-kotlin-extensions")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor")
    implementation("com.github.docker-java:docker-java:3.3.0")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("io.projectreactor:reactor-test")
    implementation(kotlin("stdlib"))
}

val createMyContainer by tasks.register<DockerCreateContainer>("createMySqlContainer") {
    imageId.set("mysql:8.0.33")
    containerName.set("mysql")
    hostConfig.portBindings.set(mutableListOf("3306:3306"))
    withEnvVar("MYSQL_ROOT_PASSWORD", "password")
    withEnvVar("MYSQL_DATABASE", "museum")
    exposePorts("tcp", listOf(3306))
}

val startMyContainer by tasks.register<DockerStartContainer>("startMySqlContainer") {
    dependsOn("createMySqlContainer")
    containerId.set(createMyContainer.containerId)
}

val stopMyContainer by tasks.register<DockerStopContainer>("stopMySqlContainer") {
    containerId.set(createMyContainer.containerId)
}

val killMyContainer by tasks.register<DockerKillContainer>("killMySqlContainer") {
    dependsOn("stopMySqlContainer")
    containerId.set(stopMyContainer.containerId)
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "18"
    }
}

tasks.withType<JavaExec> {
    try {
        dependsOn("startMySqlContainer")
        doFirst {
            (0..8).forEach {
                println("Waiting for database...")
                TimeUnit.SECONDS.sleep(5)
            }
            println("Database is ready!!")
        }
    } catch (e : Exception) {
        println("Container is already created!")
    }

    doLast {
        dependsOn("killMySqlContainer")
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}
