package com.piria.virtual.museum.api

import com.piria.virtual.museum.service.RssService
import org.springframework.beans.factory.annotation.Value
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
    fun getNews(): RssService.RssFeed = rssService.parseRss(newsRssFeedUrl)
}