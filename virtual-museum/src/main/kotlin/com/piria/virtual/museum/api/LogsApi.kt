package com.piria.virtual.museum.api

import com.piria.virtual.museum.util.PDFGeneratorComponent
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.io.*
import java.util.*


@RestController
@RequestMapping("/api/logs")
@CrossOrigin(originPatterns = ["*"])
class LogsApi(@Value("\${logs-dir}") private val logsDir: String,
    private val PDFGeneratorComponent: PDFGeneratorComponent) {

    @GetMapping("/pdf")
    @PreAuthorize("hasAuthority('ADMIN')")
    fun generateLogPdf(): ResponseEntity<ByteArray> {
        val logFiles = File(logsDir).listFiles { file -> file.isFile && file.name.endsWith(".log") }?.toList()
        val pdfBytes = PDFGeneratorComponent.generatePdfFromLogs(logFiles)

        return ResponseEntity.ok()
            .header("Content-Disposition", "attachment; filename=logs.pdf")
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdfBytes)
    }

}