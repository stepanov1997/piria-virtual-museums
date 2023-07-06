import {watchVirtualPresentation} from "../api_clients/virtualVisitsClient";
import React, {useState} from "react";
import {useSessionStorageJwt} from "../util/jwtHook";
import {Button, Text, TextInput, View, Image} from "react-native";
import {YtPlayer} from "./yt-player";

export const WatchPresentationForm = () => {
    const [ticketId, setTicketId] = useState("")
    const [data, setData] = useState(undefined)
    const [getSession,] = useSessionStorageJwt()

    async function watchPresentation() {
        const jwtToken = (await getSession()).jwt;
        const result = await watchVirtualPresentation(jwtToken, ticketId);
        if (result.status !== 200) {
            console.log("Presentation is not ready, or ticket id is not ok.")
            return
        }
        setData(result.data)
    }

    return (
        <View>
            {
                (data) ? (
                    <View>
                        <Text>{data.museumCountry}</Text>
                        <Text>{data.museumCity}</Text>
                        <Text>{data.museumType}</Text>
                        <Text>{data.datetime}</Text>
                        <Text>{data.duration}</Text>
                        <View>
                            {
                                data.images.map((image, index) => (
                                    <Image key={index} source={{uri: image}} style={{width: 200, height: 200}}/>
                                ))
                            }
                        </View>
                        <YtPlayer link={data.video}/>
                    </View>
                ) : (
                    <View>
                        <Text>Watch video presentation:</Text>
                        <TextInput
                            placeholder={"Enter virtual visit ticket id"}
                            value={ticketId}
                            onChangeText={setTicketId}
                        />
                        <Button title={"WATCH PRESENTATION"} onPress={watchPresentation}></Button>
                    </View>
                )
            }
        </View>
    )
}