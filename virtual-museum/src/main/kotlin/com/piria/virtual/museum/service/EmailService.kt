package com.piria.virtual.museum.service

import jakarta.mail.MessagingException
import org.springframework.core.io.ByteArrayResource
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import java.util.*


@Service
class EmailService(private val javaMailSender: JavaMailSender) {
    @Throws(MessagingException::class)
    fun sendEmailWithAttachment(
        to: String,
        subject: String,
        body: String,
        attachmentData: ByteArrayResource? = null,
        attachmentName: String? = null
    ) {
        val message = javaMailSender.createMimeMessage()

        // Enable multipart mode
        MimeMessageHelper(message, attachmentData != null).apply {
            setTo(to)
            setSubject(subject)
            setText(body, true)
            if(attachmentData != null && attachmentName != null) {
                addAttachment(attachmentName, attachmentData)
            }
        }

        javaMailSender.send(message)
    }
}