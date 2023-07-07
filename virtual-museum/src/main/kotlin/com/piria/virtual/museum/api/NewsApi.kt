package com.piria.virtual.museum.api

import com.piria.virtual.museum.model.Response
import com.piria.virtual.museum.service.RssService
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/news")
@CrossOrigin(originPatterns = ["*"])
class NewsApi(private val rssService: RssService) {

    @Value("\${news.rssFeedUrl}")
    lateinit var newsRssFeedUrl: String

    @GetMapping
    fun getNews(): ResponseEntity<*> =
        try {
            val content = rssService.parseRss(newsRssFeedUrl)
            log.info { "Successful retrieved the news." }
            Response.generateValidResponse(content)
        } catch (e: Exception) {
            log.error("Error while retrieving the news.", e)
            Response.generateErrorResponse(HttpStatus.NO_CONTENT, "Error while retrieving the news. Error: ${e.message}")
        }

    companion object {
        private val log = KotlinLogging.logger {}
    }
}