package com.piria.virtual.museum.service

import com.rometools.rome.io.SyndFeedInput
import com.rometools.rome.io.XmlReader
import org.springframework.stereotype.Service
import java.net.URL
import java.time.LocalDateTime
import java.time.ZoneId

@Service
class RssService {

    fun parseRss(url: String): RssFeed {
        val romeBuilder = RomeFeedBuilder()
        val feed = romeBuilder.build(XmlReader(URL(url)));

        return RssFeed(
            title=feed.title,
            link=feed.link,
            description = feed.description,
            items=feed.entries.map { syndEntry ->
                RssItem(
                    title=syndEntry.title.trim(),
                    link=syndEntry.link,
                    description=syndEntry.description.value.trim(),
                    pubDate=LocalDateTime.ofInstant(syndEntry.publishedDate.toInstant(), ZoneId.systemDefault()),
                    guid = syndEntry.uri,
                    comments = syndEntry.comments,
                    enclosure = syndEntry.enclosures.map { it.url },
                    content = syndEntry.contents.map { it.value.trim() }
                )
            }.toList()
        )
    }

    private class RomeFeedBuilder : SyndFeedInput() {
        init {
            this.xmlHealerOn = false
        }
    }

    data class RssFeed (
        val title: String,
        val link: String,
        val description: String,
        val items: List<RssItem>
    )

    data class RssItem(
        val title: String,
        val link: String,
        val description: String,
        val pubDate: LocalDateTime,
        val guid: String,
        val comments: String,
        val enclosure: List<String>,
        val content: List<String>
    )
}
