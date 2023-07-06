package com.piria.virtual.museum.service

import com.piria.virtual.museum.model.Ticket
import com.piria.virtual.museum.repository.TicketRepository
import org.springframework.stereotype.Service

@Service
class TicketService(private val ticketRepository: TicketRepository) {
    fun save(ticket: Ticket): Ticket = ticketRepository.saveAndFlush(ticket)
    fun getById(ticketId: String): Ticket = ticketRepository.getReferenceById(ticketId)
    fun getAllTickets(): List<Ticket> = ticketRepository.findAll()
}