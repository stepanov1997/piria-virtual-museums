package com.piria.virtual.museum.service

import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test

class RssParserTest {
    private var rssService: RssService = RssService()

    @Test
    fun testParseRss() {
        val rss = rssService.parseRss("https://www.huffpost.com/section/arts/feed")
        Assertions.assertNotNull(rss)
        Assertions.assertNotNull(rss.title)
        Assertions.assertNotNull(rss.link)
        Assertions.assertNotNull(rss.description)
        Assertions.assertTrue(rss.items.isNotEmpty())
    }
}
