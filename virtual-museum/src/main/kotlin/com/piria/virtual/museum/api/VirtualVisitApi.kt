package com.piria.virtual.museum.api

import com.piria.virtual.museum.model.Media
import com.piria.virtual.museum.model.MediaType
import com.piria.virtual.museum.model.VirtualPresentation
import com.piria.virtual.museum.model.VirtualVisit
import com.piria.virtual.museum.service.*
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
    fun getById(@PathVariable virtualVisitId: Long): VirtualVisit = virtualVisitService.getById(virtualVisitId)

    @GetMapping("/museum/{museumId}")
    fun getByMuseumId(@PathVariable museumId: Long): List<VirtualVisit> = virtualVisitService.getAllByMuseumId(museumId)

    @GetMapping
    fun getAll(): List<VirtualVisit> = virtualVisitService.getAll()

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
    fun watchVirtualPresentation(@PathVariable ticketId: String): VirtualPresentationResponse {
        val ticket = ticketService.getById(ticketId)
        val (_, datetime, duration, _, _, _, virtualPresentation) = ticket.virtualVisit;
        val (_, medias, virtualVisit) = virtualPresentation
        val mediaGroupBy = medias.groupBy({ it.mediaType }, { it.content })
        val (_, name, _, _, city, country, _, _, type, _) = virtualVisit?.museum
            ?: throw RuntimeException("Museum doesn't exist.")
        return VirtualPresentationResponse(
            status = 200,
            data = VirtualPresentationResponse.Data(
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
        )
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
    val status: Int,
    val data: Data
) {
    data class Data(
        val museumName: String,
        val museumCountry: String,
        val museumCity: String,
        val museumType: String,
        val datetime: String,
        val duration: Double,
        val images: List<String>,
        val video: String
    )
}