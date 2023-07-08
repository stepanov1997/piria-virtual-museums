package com.piria.virtual.museum.util

import com.google.zxing.BarcodeFormat
import com.google.zxing.EncodeHintType
import com.google.zxing.qrcode.QRCodeWriter
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel
import com.piria.virtual.museum.model.VirtualVisit
import org.apache.pdfbox.pdmodel.PDDocument
import org.apache.pdfbox.pdmodel.PDPage
import org.apache.pdfbox.pdmodel.PDPageContentStream
import org.apache.pdfbox.pdmodel.common.PDRectangle
import org.apache.pdfbox.pdmodel.font.PDType1Font
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject
import org.springframework.core.io.ByteArrayResource
import org.springframework.stereotype.Component
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import java.io.IOException
import java.text.SimpleDateFormat
import java.time.Instant
import java.time.ZoneId
import javax.imageio.ImageIO

@Component
class TicketAsPDFGenerator {
    fun generate(ticketId: String, virtualVisit: VirtualVisit): ByteArrayResource {
        try {
            val document = PDDocument()

            val page = PDPage(PDRectangle.A4)
            document.addPage(page)

            PDPageContentStream(document, page).apply {

                setFont(PDType1Font.HELVETICA_BOLD, 12F)

                beginText()
                newLineAtOffset(50F, 715F)
                showText("Museum ticket")
                endText()

                beginText()
                setFont(PDType1Font.HELVETICA, 10F)
                newLineAtOffset(50F, 695F)
                showText("Museum: ${virtualVisit.museum.name}")
                newLineAtOffset(0F, -20F) // Pomeranje na novu liniju
                showText("Location: ${virtualVisit.museum.address}, ${virtualVisit.museum.city}, ${virtualVisit.museum.country}".take(48))
                newLineAtOffset(0F, -20F) // Pomeranje na novu liniju
                showText("Datetime: ${SimpleDateFormat("dd.MM.yyyy. HH:mm").format(Instant.parse(virtualVisit.datetime + ".000Z").atZone(ZoneId.systemDefault()).toLocalDate())}")
                newLineAtOffset(0F, -20F) // Pomeranje na novu liniju
                showText("Duration: ${virtualVisit.duration} hour(s)")
                endText()

                val qrCodeImage = generateQRCodeImage(ticketId)
                val qrCodeImageXObject = PDImageXObject.createFromByteArray(document, qrCodeImage, "QR Code")

                val qrCodeWidth = 100F
                val qrCodeHeight = 100F
                val qrCodeX = page.mediaBox.width - qrCodeWidth - 125F
                val qrCodeY = 637F
                drawImage(qrCodeImageXObject, qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight)

                val descriptionRectX = 40F
                val descriptionRectY = 615F
                val descriptionRectWidth = 230F
                val descriptionRectHeight = 125F
                addRect(descriptionRectX, descriptionRectY, descriptionRectWidth, descriptionRectHeight)
                stroke()

                val qrCodeRectX = 270F
                val qrCodeRectY = 615F
                val qrCodeRectWidth = 290F
                val qrCodeRectHeight = 125F
                addRect(qrCodeRectX, qrCodeRectY, qrCodeRectWidth, qrCodeRectHeight)
                stroke()

                beginText()
                newLineAtOffset(286F, 630F)
                showText("Ticket number: $ticketId")
                endText()

                close()
            }

            val byteArrayOutputStream = ByteArrayOutputStream()
            document.save(byteArrayOutputStream)

            document.close()

            return ByteArrayResource(byteArrayOutputStream.toByteArray())
        } catch (e: IOException) {
            System.err.println("Error generating museum map: " + e.message)
            throw e
        }
    }

    private fun generateQRCodeImage(data: String): ByteArray {
        val hintMap = mutableMapOf<EncodeHintType, ErrorCorrectionLevel>()
        hintMap[EncodeHintType.ERROR_CORRECTION] = ErrorCorrectionLevel.L

        val qrCodeWriter = QRCodeWriter()
        val bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, 200, 200, hintMap)
        val width = bitMatrix.width
        val height = bitMatrix.height
        val qrCodePixels = IntArray(width * height)

        for (y in 0 until height) {
            val offset = y * width
            for (x in 0 until width) {
                qrCodePixels[offset + x] = if (bitMatrix.get(x, y)) 0xFF000000.toInt() else 0xFFFFFFFF.toInt()
            }
        }

        val bufferedImage = BufferedImage(width, height, BufferedImage.TYPE_INT_RGB)
        bufferedImage.setRGB(0, 0, width, height, qrCodePixels, 0, width)

        val outputStream = ByteArrayOutputStream()
        ImageIO.write(bufferedImage, "png", outputStream)

        return outputStream.toByteArray()
    }
}


