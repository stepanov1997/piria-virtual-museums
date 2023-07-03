package com.piria.virtual.museum.api

import com.piria.virtual.museum.model.VirtualVisit
import com.piria.virtual.museum.service.VirtualVisitService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/vvs")
@CrossOrigin(originPatterns = ["*"])
class VirtualVisitApi(private val virtualVisitService: VirtualVisitService) {
    @GetMapping("/{virtualVisitId}")
    fun getById(@PathVariable virtualVisitId: Long): VirtualVisit = virtualVisitService.getById(virtualVisitId)
    @GetMapping("/museum/{museumId}")
    fun getByMuseumId(@PathVariable museumId: Long): Set<VirtualVisit> = virtualVisitService.getAllByMuseumId(museumId)
    @GetMapping
    fun getAll(): List<VirtualVisit> = virtualVisitService.getAll()
}