import {Platform} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import {extractIdFromUrl} from "../util/youtube";
import React from "react";

export const YtPlayer = ({link}) => {
    return ["ios", "android"].includes(Platform.OS) ? (
        <YoutubePlayer
            height={300}
            videoId={extractIdFromUrl(link)}
        />
    ) : (
        <iframe width="560" height="315" src={`https://www.youtube.com/embed/${extractIdFromUrl(link)}`}
                title="YouTube video player" frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen></iframe>
    )
}