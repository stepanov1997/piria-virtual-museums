package com.piria.virtual.museum.api

import com.piria.virtual.museum.model.Media
import com.piria.virtual.museum.model.MediaType
import com.piria.virtual.museum.model.VirtualPresentation
import com.piria.virtual.museum.model.VirtualVisit
import com.piria.virtual.museum.service.MediaService
import com.piria.virtual.museum.service.MuseumService
import com.piria.virtual.museum.service.VirtualPresentationService
import com.piria.virtual.museum.service.VirtualVisitService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/vvs")
@CrossOrigin(originPatterns = ["*"])
class VirtualVisitApi(
    private val virtualVisitService: VirtualVisitService,
    private val museumService: MuseumService,
    private val mediaService: MediaService,
    private val virtualPresentationService: VirtualPresentationService
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
        val savedVirtualPresentation = virtualPresentationService.save(VirtualPresentation(medias = savedMedias.toSet()))

        val museum = museumService.getMuseumsById(museumId)

        return virtualVisitService.save(VirtualVisit(
            datetime = datetime,
            duration = duration,
            price = price,
            museum = museum,
            virtualPresentation = savedVirtualPresentation
        ))
    }
}

data class VirtualVisitRequest (
    val datetime: String,
    val duration: Double,
    val price: Double,
    val museumId: Long,
    val presentation: VirtualPresentationRequest
)

data class VirtualPresentationRequest (
    val images: List<String>,
    val video: String
)