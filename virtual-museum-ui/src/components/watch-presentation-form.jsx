import {watchVirtualPresentation} from "../api_clients/virtualVisitsClient";
import React, {useState} from "react";
import {useSessionStorageJwt} from "../util/jwtHook";
import {Button, Text, TextInput, View, Image, ActivityIndicator, StyleSheet, Dimensions} from "react-native";
import {YtPlayer} from "./yt-player";
import {BLUE, DARKBLUE, GRAY} from '../../config.json'
import {DateTime, Duration} from "luxon";
import {useTranslation} from "react-i18next";

const {width, height} = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        backgroundColor: "#fff",
        flex: true,
        justifyContent: "center",
        alignItems: "center"
    },
    content: {
        backgroundColor: GRAY,
        width: width > height ? width * 0.3 : width * 0.9,
        height: width > height ? height * 0.5 : height * 0.5,
        borderRadius: 10,
        flex: true,
        alignItems: "center",
        gap: width > height ? width * 0.04 : height * 0.09,
        paddingVertical: height * 0.01
    },
    title: {
        textAlign: "center",
        color: BLUE,
        fontSize: width > height ? width * 0.02 : height * 0.03

    },
    inputs: {
        gap: height * 0.01,
    },
    input: {
        backgroundColor: "#fff",
        width: width > height ? width * 0.15 : height * 0.3,
        height: width > height ? height * 0.04 : width * 0.1,
        paddingLeft: height * 0.01,
        color: BLUE,
        fontSize: width > height ? height * 0.02 : width * 0.04,
        borderColor: "transparent"
    },
    button: {
        backgroundColor: DARKBLUE
    },
    buttons: {
        gap: height * 0.01
    },

});

export const WatchPresentationForm = () => {
    const {t} = useTranslation('watchPresentationForm')

    const [ticketId, setTicketId] = useState("")
    const [data, setData] = useState(undefined)
    const [getSession,,removeSession] = useSessionStorageJwt()
    const [isLoading, setIsLoading] = useState(false)
    const [secondsRemaining, setSecondsRemaining] = useState(undefined)

    async function watchPresentation() {
        setIsLoading(true)
        try {
            const jwtToken = (await getSession()).jwt;
            const result = await watchVirtualPresentation(jwtToken, ticketId);
            if (result.status !== "200") {
                console.error("Presentation is not ready, or ticket id is not ok.")
                return
            }
            const data = result.content

            const now = DateTime.now()
            const startDatetime = DateTime.fromISO(data.datetime).plus(Duration.fromObject({hours: 2}))
            const endDatetime = startDatetime.plus(Duration.fromObject({hours: data.duration}))

            console.log(`now: ${now}`)
            const startDiffMillis = startDatetime.diff(now);
            const endDiffMillis = endDatetime.diff(now);

            // Ako jos nije pocela
            if (startDiffMillis.milliseconds > 0) {
                console.log("Presentation not yet started.")
                setSecondsRemaining(Math.round(startDiffMillis.milliseconds/1000))
                setTimeout(() => {
                    console.log("Presentation started.")
                    setIsLoading(false)
                }, startDiffMillis.milliseconds)
                const refreshIntervalId = setInterval(() => {
                    setSecondsRemaining(prevState => {
                        if (prevState === 0) {
                            data.stopInterval()
                            return undefined
                        }
                        return prevState - 1
                    })
                }, 1000)
                data.stopInterval = () => clearInterval(refreshIntervalId)
            } else {
                setIsLoading(false)
            }
            // Ako jos nije zavrsilo
            if (endDiffMillis.milliseconds > 0) {
                console.log("Not yet finished presentation")
                setTimeout(async () => {
                    console.log("Presentation finihed.")
                    alert("Session is over.")
                    await removeSession()
                    location.reload()
                }, endDiffMillis.milliseconds)
                setData(data)
                return
            }
            // Ako je zavrsilo
            console.log("Presentation finished.")
            alert(t("sessionIsOverAlert"))
            await removeSession()
            location.reload()
        }
        catch (e) {
            console.error(`Error: ${e}`)
            setIsLoading(false)
        }
    }

    return (
        <View>
            {
                isLoading ?
                    (
                        <View>
                            <ActivityIndicator size="large"/>
                            {secondsRemaining && <Text>\n{t('presentationStartingLabel')} {Duration.fromObject({seconds: secondsRemaining}).toFormat(`mm '${t('minutes')} and 'ss '${t('seconds')}'`)}...</Text>}
                        </View>
                    )
                    :
                    (
                        data ?
                            (
                                <View >
                                    <View style={styles.textDetailsContainer}>
                                    <Text>{t('countryLabel')}: {data.museumCountry}</Text>
                                    <Text>{t('cityLabel')}: {data.museumCity}</Text>
                                    <Text>{t('typeLabel')}: {data.museumType}</Text>
                                    <Text>{t('datetimeLabel')}: {data.datetime}</Text>
                                    <Text>{t('durationLabel')}: {data.duration}</Text>
                                    </View>
                                    <ScrollView contentContainerStyle={styles.content}>
                                        <ScrollView contentContainerStyle={{overflow:true,flexDirection:"row"}}>
                                        {
                                            data.images.map((image, index) => (
                                                <Image key={index} source={{uri: image}}
                                                       style={styles.image}/>
                                            ))
                                        }


                                    <YtPlayer link={data.video} width={width>height?width*0.4:height*0.4} height={width>height?height*0.4:width*0.4}/>
                                        </ScrollView>
                                    </ScrollView>
                                </View>
                            )
                            :
                            (
                                <View>
                                    <Text style={styles.title}>{t('watchVirtualPresentationTitle')}:</Text>
                                    <TextInput
                                        placeholder={`${t('watchVirtualPresentationPlaceholder')}:`}
                                        value={ticketId}
                                        onChangeText={setTicketId}
                                    />
                                    <Button title={t("watchPresentationButtonTitle")} onPress={watchPresentation}/>
                                </View>
                            )
                    )
            }
        </View>
    )
}