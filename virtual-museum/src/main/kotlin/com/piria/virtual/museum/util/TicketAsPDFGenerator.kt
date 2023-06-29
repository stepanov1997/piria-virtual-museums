package com.piria.virtual.museum.util

import com.google.zxing.BarcodeFormat
import com.google.zxing.EncodeHintType
import com.google.zxing.qrcode.QRCodeWriter
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel
import com.piria.virtual.museum.model.Museum
import org.apache.pdfbox.pdmodel.PDDocument
import org.apache.pdfbox.pdmodel.PDPage
import org.apache.pdfbox.pdmodel.PDPageContentStream
import org.apache.pdfbox.pdmodel.common.PDRectangle
import org.apache.pdfbox.pdmodel.font.PDType1Font
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject
import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import java.io.IOException
import java.text.SimpleDateFormat
import java.time.Instant
import java.util.*
import javax.imageio.ImageIO

fun main() {
    generate(Museum(
        id=1,
        name="Philadelphia Museum of Art",
        address="1 Avenue of the Arts",
        phoneNumber="215-763-8100",
        city="Philadelphia",
        country="USA",
        latitude=39.95308,
        longitude=-75.164871,
        type="Art Museum"
    ))
}

fun generate(museum: Museum) {
    try {
        // Kreiranje praznog dokumenta
        val document = PDDocument()

        // Dodavanje nove stranice
        val page = PDPage(PDRectangle.A4)
        document.addPage(page)

        // Inicijalizacija sadržajnog toka za crtanje
        val contentStream = PDPageContentStream(document, page)

        // Postavljanje fonta
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12F)

        // Postavljanje naslova
        contentStream.beginText()
        contentStream.newLineAtOffset(50F, 700F)
        contentStream.showText("Museum ticket")
        contentStream.endText()

        // Postavljanje informacija o muzeju
        contentStream.beginText()
        contentStream.setFont(PDType1Font.HELVETICA, 10F)
        contentStream.newLineAtOffset(50F, 680F)
        contentStream.showText("Museum: ${museum.name}")
        contentStream.newLineAtOffset(0F, -20F) // Pomeranje na novu liniju
        contentStream.showText("Location: ${museum.address}, ${museum.city}, ${museum.country}".take(48))
        contentStream.newLineAtOffset(0F, -20F) // Pomeranje na novu liniju
        contentStream.showText("Date: ${SimpleDateFormat("dd.MM.yyyy.").format(Date.from(Instant.now()))}")
        contentStream.endText()

        // Generisanje QR koda sa UUID
        val uuid = generateUUID()
        val qrCodeImage = generateQRCodeImage(uuid)

        // Učitavanje QR koda kao PDImageXObject
        val qrCodeImageXObject = PDImageXObject.createFromByteArray(document, qrCodeImage, "QR Code")

        // Postavljanje pozicije i veličine QR koda
        val qrCodeWidth = 100F
        val qrCodeHeight = 100F
        val qrCodeX = page.mediaBox.width - qrCodeWidth - 125F
        val qrCodeY = 637F
        contentStream.drawImage(qrCodeImageXObject, qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight)

        // Dodavanje okvira oko opisa muzeja
        val descriptionRectX = 40F
        val descriptionRectY = 615F
        val descriptionRectWidth = 230F
        val descriptionRectHeight = 125F
        contentStream.addRect(descriptionRectX, descriptionRectY, descriptionRectWidth, descriptionRectHeight)
        contentStream.stroke()

        // Dodavanje okvira oko QR koda s UUID-om
        val qrCodeRectX = 270F
        val qrCodeRectY = 615F
        val qrCodeRectWidth = 290F
        val qrCodeRectHeight = 125F
        contentStream.addRect(qrCodeRectX, qrCodeRectY, qrCodeRectWidth, qrCodeRectHeight)
        contentStream.stroke()

        // Dodavanje UUID-om u okviru QR koda
        contentStream.beginText()
        contentStream.newLineAtOffset(286F, 630F) // Pomeranje na novu liniju
        contentStream.showText("Ticket number: $uuid")
        contentStream.endText()

        // Završetak sadržajnog toka
        contentStream.close()

        // Snimanje dokumenta kao PDF fajla
        document.save("karta_muzeja.pdf")

        // Zatvaranje dokumenta
        document.close()

        println("Karta muzeja je uspešno generisana.")
    } catch (e: IOException) {
        System.err.println("Greška prilikom generisanja karte muzeja: " + e.message)
    }
}

fun generateUUID(): String {
    return UUID.randomUUID().toString()
}

fun generateQRCodeImage(data: String): ByteArray {
    val hintMap = HashMap<EncodeHintType, ErrorCorrectionLevel>()
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
