package com.piria.virtual.museum.service

import com.piria.virtual.museum.model.Media
import com.piria.virtual.museum.repository.MediaRepository
import org.springframework.stereotype.Service

@Service
class MediaService(val mediaRepository: MediaRepository) {
    fun save(mediaList: List<Media>): List<Media> = mediaRepository.saveAllAndFlush(mediaList)
}