import {Platform} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import {extractIdFromUrl} from "../util/youtube";
import React from "react";

export const YtPlayer = ({link, width, height}) => {
    return ["ios", "android"].includes(Platform.OS) ? (
        <YoutubePlayer
            width={width}
            height={height}
            videoId={extractIdFromUrl(link)}
        />
    ) : (
        <iframe width={width} height={height} src={`https://www.youtube.com/embed/${extractIdFromUrl(link)}`}
                title="YouTube video player" frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen></iframe>
    )
}