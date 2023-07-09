package com.piria.virtual.museum.util

import org.junit.jupiter.api.Test
import java.io.File
import java.nio.file.Files

class PDFGeneratorComponentTest {

    @Test
    fun testGeneratePdfFromLogs() {
        val logFiles = File("C:\\Users\\stepa\\IdeaProjects\\piria\\virtual-museum\\logs")
            .listFiles { file -> file.isFile && file.name.endsWith(".log") }?.toList()

        val pdfBytes = logFiles?.let { PDFGeneratorComponent().generatePdfFromLogs(it) }
        if (pdfBytes != null) {
            Files.write(File("./logs.pdf").toPath(), pdfBytes)
        }
    }
}