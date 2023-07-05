import {View, Text, Button, ScrollView} from 'react-native'
import {useEffect, useState} from "react";
import {RadioButton} from 'react-native-paper';
import {generateMuseumDetails, getThreeRandomCities} from '../api_clients/chatGptClient'
import {getForcastForThreeCities} from '../api_clients/openWeatherClient'
import {getAllByMuseumId} from '../api_clients/virtualVisitsClient'
import {TicketPaymentForm} from './forms/ticket-payment-form'
import {useSessionStorageJwt} from "../util/jwtHook";
import {WeatherForcast} from "./weather-forcast";

export const MuseumComponent = ({route}) => {
    const [selectedVirtualVisit, selectVirtualVisit] = useState(0);
    const [virtualVisits, setVirtualVisits] = useState([])
    const [details, setDetails] = useState("")
    const [buyingTicketFormHide, setBuyingTicketFormHide] = useState(true)
    const [showVirtualVisits, setShowVirtualVisits] = useState(false)
    const [getSession,] = useSessionStorageJwt()
    const [forcastForThreeCities, setForcastForThreeCities] = useState([])
    const {museum} = route.params


    useEffect(() => {
        (async function () {
            const threeRandomCities = await getThreeRandomCities(museum.country)
            const forcastForThreeCities = await getForcastForThreeCities(threeRandomCities)
            setForcastForThreeCities(forcastForThreeCities)
        })()
    }, [museum])

    useEffect(() => {
        (async function () {
            const gptDetails = await generateMuseumDetails(museum.name, museum.country)
            setDetails(gptDetails)
        })()
    }, [])

    const showVirtualVisitsFunction = async () => {
        if (virtualVisits.length === 0) {
            const {jwt} = await getSession();
            const virtualVisits = await getAllByMuseumId(jwt, museum.id)
            setVirtualVisits(virtualVisits)
        }
        setShowVirtualVisits(prevState => !prevState)
    }

    function getTicketAmount() {
        return virtualVisits.find(e => e.id === selectedVirtualVisit).price
    }

    return (
        <ScrollView>
            <Text>{museum.name}</Text>
            <Text>{museum.address}</Text>
            <Text>{museum.phoneNumber}</Text>
            <Text>{museum.city}, {museum.country}</Text>
            <Text>({museum.latitude}, {museum.longitude})</Text>
            <Text>{museum.type}</Text>
            <Text>{details}</Text>
            <Button title={`${showVirtualVisits ? "Hide" : "Show"} virtual visits`}
                    onPress={showVirtualVisitsFunction}/>
            {showVirtualVisits && <View>
                <RadioButton.Group onValueChange={selectVirtualVisit} value={selectedVirtualVisit}>
                    {virtualVisits.map((item, index) =>
                        (
                            <RadioButton.Item
                                key={index}
                                label={`Datetime: ${item.datetime}, duration: ${item.duration}, price: ${item.price}€`}
                                value={item.id}>
                            </RadioButton.Item>
                        )
                    )}
                </RadioButton.Group>
                <Text>{"\n"}</Text>
                <Button title={"Buy ticket"} onPress={() => setBuyingTicketFormHide(prevState => !prevState)}/>
                {(!buyingTicketFormHide) &&
                    <TicketPaymentForm selectedVirtualVisit={selectedVirtualVisit} amount={getTicketAmount()}
                                       setBuyingTicketFormHide={setBuyingTicketFormHide}/>}
            </View>}

            <Text>{"\n"}</Text>
            <View>
                <Text>Weather</Text>
                {
                    forcastForThreeCities.map((item, index) => (
                        <WeatherForcast key={item.city.id} forcast={item}/>
                    ))
                }
            </View>
        </ScrollView>
    );
}