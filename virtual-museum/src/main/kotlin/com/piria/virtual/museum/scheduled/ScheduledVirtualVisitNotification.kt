package com.piria.virtual.museum.scheduled

import com.piria.virtual.museum.model.User
import com.piria.virtual.museum.service.EmailService
import com.piria.virtual.museum.service.TicketService
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.text.SimpleDateFormat
import java.time.Duration
import java.time.Instant
import java.time.ZoneId
import java.time.temporal.ChronoUnit
import java.util.concurrent.TimeUnit

@Component
class ScheduledVirtualVisitNotification(
    val ticketService: TicketService,
    val emailService: EmailService
) {
    @Scheduled(fixedDelayString = "\${scheduled.period}", timeUnit = TimeUnit.SECONDS)
    fun sendNotificationToAllTickerOwners() {
        ticketService.getAllTickets()
            .forEach { ticket ->
                val now = Instant.now()
                val startDatetime = Instant.parse(ticket.virtualVisit.datetime + ".000Z")
                val endDateTime = startDatetime.plus((ticket.virtualVisit.duration * 60).toLong(), ChronoUnit.MINUTES)

                val minutesBeforeEnd = Duration.between(now, endDateTime).toMinutes()

                if (minutesBeforeEnd < 4) {
                    ticket.notificationSentBeforeStart = true
                    ticket.notificationSentBeforeEnd = true
                    ticketService.save(ticket)
                    return@forEach
                }

                if (Duration.between(now, startDatetime).toHours() > 1) {
                    return@forEach
                }

                if (!ticket.notificationSentBeforeStart) {
                    ticket.notificationSentBeforeStart = true
                    sendNotification(ticket.user, Type.START, startDatetime, endDateTime)
                    ticketService.save(ticket)
                    return@forEach
                }

                if (!ticket.notificationSentBeforeEnd && minutesBeforeEnd <= 5) {
                    ticket.notificationSentBeforeEnd = true
                    sendNotification(ticket.user, Type.END, startDatetime, endDateTime)
                    ticketService.save(ticket)
                }
            }
    }

    fun sendNotification(user: User, type: Type, startDatetime: Instant, endDateTime: Instant) {
        val datetime = if (type.isStart()) startDatetime else endDateTime
        val formattedDatetime = SimpleDateFormat("dd.MM.yyyy. HH:mm").format(datetime.atZone(ZoneId.systemDefault()))
        val duration = if (type.isStart()) "1 hour" else "5 minutes"
        val typeStr = if (type.isStart()) "Start" else "End"
        emailService.sendEmailWithAttachment(
            to = user.email,
            subject = "Reminder: Virtual Presentation ${typeStr}s in $duration",
            body = """
                <html>
                    <body>
                        <h2>Dear ${user.name},</h2>
                        
                        <p>This is a reminder that the virtual presentation you registered for will $typeStr in ${duration}.</p>
                        
                        <p><strong>Presentation ${typeStr} Date and Time:</strong> ${formattedDatetime}</p>
                        
                        ${if (type.isStart()) "<p>Please make sure to join the presentation on time and enjoy the event.</p>" else ""}
                        
                        <p>Best regards,</p>
                        <p>Your Virtual Presentation Team</p>
                    </body>
                </html>
            """.trimIndent()
        )
    }


}

enum class Type {
    START,
    END;

    fun isStart() = this == START
}