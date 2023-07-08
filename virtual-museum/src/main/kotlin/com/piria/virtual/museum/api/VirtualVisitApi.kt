package com.piria.virtual.museum.api

import com.piria.virtual.museum.model.*
import com.piria.virtual.museum.service.*
import mu.KotlinLogging
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/vvs")
@CrossOrigin(originPatterns = ["*"])
class VirtualVisitApi(
    private val virtualVisitService: VirtualVisitService,
    private val museumService: MuseumService,
    private val mediaService: MediaService,
    private val virtualPresentationService: VirtualPresentationService,
    private val ticketService: TicketService
) {
    @GetMapping("/{virtualVisitId}")
    fun getById(@PathVariable virtualVisitId: Long): ResponseEntity<*> =
        try {
            val content = virtualVisitService.getById(virtualVisitId)
            log.info { "Retrieving virtual visits is successful." }
            Response.generateValidResponse(content)
        } catch (e: Exception) {
            log.error("Error while retrieving virtual visits by id.", e)
            Response.generateErrorResponse(
                HttpStatus.NO_CONTENT,
                "Error while retrieving virtual visits by id."
            )
        }

    @GetMapping("/museum/{museumId}")
    fun getByMuseumId(@PathVariable museumId: Long): ResponseEntity<*> =
        try {
            val content = virtualVisitService.getAllByMuseumId(museumId)
            log.info { "Retrieving virtual visits by museum id is successful." }
            Response.generateValidResponse(content)
        } catch (e: Exception) {
            log.error("Error while retrieving virtual visits by museum id.", e)
            Response.generateErrorResponse(
                HttpStatus.NO_CONTENT,
                "Error while retrieving virtual visits by museum id."
            )
        }


    @GetMapping
    fun getAll(): ResponseEntity<*> =
        try {
            val content = virtualVisitService.getAll()
            log.info { "Successful retrieving all virtual visits" }
            Response.generateValidResponse(content)
        } catch (e: Exception) {
            log.error("Error while retrieving all virtual visits.", e)
            Response.generateErrorResponse(
                HttpStatus.NO_CONTENT,
                "Error while retrieving all virtual visits. Error: ${e.message}"
            )
        }

    @PostMapping
    fun save(@RequestBody virtualVisitRequest: VirtualVisitRequest): VirtualVisit {
        val (datetime, duration, price, museumId, presentation) = virtualVisitRequest
        val (images, video) = presentation

        val imagesMedia = images.map { Media(mediaType = MediaType.IMAGE, content = it) }
        val videoMedia = Media(mediaType = MediaType.YT_VIDEO_LINK, content = video)

        val savedMedias = mediaService.save(imagesMedia + videoMedia)
        val savedVirtualPresentation =
            virtualPresentationService.save(VirtualPresentation(medias = savedMedias.toSet()))

        val museum = museumService.getMuseumsById(museumId)

        return virtualVisitService.save(
            VirtualVisit(
                datetime = datetime,
                duration = duration,
                price = price,
                museum = museum,
                virtualPresentation = savedVirtualPresentation
            )
        )
    }

    @GetMapping("/ticketId/{ticketId}")
    fun watchVirtualPresentation(@PathVariable ticketId: String): ResponseEntity<*> =
        try {
            val ticket = ticketService.getById(ticketId)
            val (_, datetime, duration, _, _, _, virtualPresentation) = ticket.virtualVisit
            val (_, medias, virtualVisit) = virtualPresentation
            val mediaGroupBy = medias.groupBy({ it.mediaType }, { it.content })
            val (_, name, _, _, city, country, _, _, type, _) = virtualVisit?.museum
                ?: throw RuntimeException("Museum doesn't exist.")
            val virtualPresentationResponse = VirtualPresentationResponse(
                museumName = name,
                museumCountry = country,
                museumCity = city,
                museumType = type,
                datetime = datetime,
                duration = duration,
                images = mediaGroupBy[MediaType.IMAGE] ?: listOf(),
                video = mediaGroupBy[MediaType.YT_VIDEO_LINK]?.first()
                    ?: throw RuntimeException("Youtube video doesn't exist.")
            )
            Response.generateValidResponse(virtualPresentationResponse)
        } catch (e: Exception) {
            log.error("Error while retreiving resources for watching virtual presentation.", e)
            Response.generateErrorResponse(
                HttpStatus.NO_CONTENT,
                "Error while retreiving resources for watching virtual presentation."
            )
        }

    companion object {
        private val log = KotlinLogging.logger {}
    }
}


data class VirtualVisitRequest(
    val datetime: String,
    val duration: Double,
    val price: Double,
    val museumId: Long,
    val presentation: VirtualPresentationRequest
)

data class VirtualPresentationRequest(
    val images: List<String>,
    val video: String
)

data class VirtualPresentationResponse(
    val museumName: String,
    val museumCountry: String,
    val museumCity: String,
    val museumType: String,
    val datetime: String,
    val duration: Double,
    val images: List<String>,
    val video: String
)