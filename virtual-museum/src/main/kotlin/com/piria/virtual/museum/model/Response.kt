package com.piria.virtual.museum.model

import com.fasterxml.jackson.annotation.JsonInclude
import org.springframework.http.HttpStatus.CREATED
import org.springframework.http.HttpStatus.OK
import org.springframework.http.HttpStatusCode
import org.springframework.http.ResponseEntity
import java.net.URI

class Response {
    companion object {
        fun generateErrorResponse(status: HttpStatusCode, error: String, content: Any? = null): ResponseEntity<Any> =
            ResponseEntity.ok(
                ErrorResponse(status.value().toString(), error, content)
            )

        fun generateValidResponse(content: Any): ResponseEntity<ValidResponse> =
            ResponseEntity.ok(
                ValidResponse(OK.value().toString(), content)
            )

        fun generateCreatedResponse(resourceUrl: String, content: Any): ResponseEntity<ValidResponse> =
            ResponseEntity.created(URI.create(resourceUrl)).body(
                ValidResponse(CREATED.value().toString(), content)
            )
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    data class ValidResponse(val status: String, val content: Any)

    @JsonInclude(JsonInclude.Include.NON_NULL)
    data class ErrorResponse(val status: String, val error: String, val content: Any? = null)
}