import {View, Text, Button, ScrollView} from 'react-native'
import {useEffect, useState} from "react";
import {generateMuseumDetails} from '../api_clients/chatGptClient'
import {TicketPaymentForm} from './forms/ticket-payment-form'

export const MuseumComponent = ({route}) => {
    const [details, setDetails] = useState("")
    const [buyingTicketFormHide, setBuyingTicketFormHide] = useState(true)
    const {museum} = route.params

    useEffect(() => {
        (async function() {
            const gptDetails = await generateMuseumDetails(museum.name, museum.country)
            setDetails(gptDetails)
        })()
    }, [museum])


    return (
        <ScrollView>
            <Text>{museum.name}</Text>
            <Text>{museum.address}</Text>
            <Text>{museum.phoneNumber}</Text>
            <Text>{museum.city}, {museum.country}</Text>
            <Text>({museum.latitude}, {museum.longitude})</Text>
            <Text>{museum.type}</Text>
            <Text>{details}</Text>
            <Button title={"Buy ticket"} onPress={() => setBuyingTicketFormHide(prevState => !prevState)}/>
            { (!buyingTicketFormHide) && <TicketPaymentForm amount={300}/> }
            <Button title={"Show virtual visits"}/>
            <Text>{"\n"}</Text>
            <View>
                <Text>TODO: Weather</Text>
            </View>
        </ScrollView>
    );
}