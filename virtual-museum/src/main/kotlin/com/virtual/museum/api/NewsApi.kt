package com.virtual.museum.api

import com.virtual.museum.service.RssService
import com.virtual.museum.service.RssService.*
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/news")
class NewsApi(private val rssService: RssService) {

    @Value("\${news.rssFeedUrl}")
    lateinit var newsRssFeedUrl: String

    @GetMapping
    fun getNews(): RssFeed = rssService.parseRss(newsRssFeedUrl)
}