import {View, Text, Button, ScrollView, FlatList} from 'react-native'
import {useEffect, useState} from "react";
import { RadioButton } from 'react-native-paper';
import {generateMuseumDetails, getThreeRandomCities} from '../api_clients/chatGptClient'
import {getForcastForThreeCities} from '../api_clients/openWeatherClient'
import {getAllByMuseumId} from '../api_clients/virtualVisitsClient'
import {TicketPaymentForm} from './forms/ticket-payment-form'
import {useSessionStorageJwt} from "../util/jwtHook";
import {VirtualVisitComponent} from "./virtual-visit";
import {WeatherForcast} from "./weather-forcast";

export const MuseumComponent = ({route}) => {
    const [selectedVirtualVisit, selectVirtualVisit] = useState(0);
    const [virtualVisits, setVirtualVisits] = useState([])
    const [details, setDetails] = useState("")
    const [buyingTicketFormHide, setBuyingTicketFormHide] = useState(true)
    const [showVirtualVisits, setShowVirtualVisits] = useState(false)
    const [getJwt,] = useSessionStorageJwt()
    const [forcastForThreeCities, setForcastForThreeCities] = useState([])
    const {museum} = route.params


    useEffect(() => {
        (async function() {
            const threeRandomCities = await getThreeRandomCities(museum.country)
            const forcastForThreeCities = await getForcastForThreeCities(threeRandomCities)
            setForcastForThreeCities(forcastForThreeCities)
        })()
    }, [museum])

    useEffect(() => {
        (async function() {
            const gptDetails = await generateMuseumDetails(museum.name, museum.country)
            setDetails(gptDetails)
        })()
    }, [])

    const showVirtualVisitsFunction = async () => {
        if(virtualVisits.length===0) {
            const jwt = await getJwt();
            const virtualVisits = await getAllByMuseumId(jwt, museum.id)
            setVirtualVisits(virtualVisits)
        }
        setShowVirtualVisits(prevState => !prevState)
    }

    function getTicketAmount() {
        return virtualVisits.find(e=> e.id===selectedVirtualVisit).price
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
            <Button title={`${showVirtualVisits?"Hide":"Show"} virtual visits`} onPress={showVirtualVisitsFunction}/>
            { showVirtualVisits && <View>
                <RadioButton.Group onValueChange={selectVirtualVisit} value={selectedVirtualVisit}>
                    <FlatList
                        data={virtualVisits}
                        renderItem={({item}) =>
                            (
                                <RadioButton.Item
                                    label={<VirtualVisitComponent id={item.id} datetime={item.datetime} duration={item.duration} price={item.price}/>}
                                    value={item.id}>
                                </RadioButton.Item>
                            )}
                        keyExtractor={museum => museum.id.toString()}
                    />
                </RadioButton.Group>
                <Text>{"\n"}</Text>
                <Button title={"Buy ticket"} onPress={() => setBuyingTicketFormHide(prevState => !prevState)}/>
                { (!buyingTicketFormHide) && <TicketPaymentForm selectedVirtualVisit={selectedVirtualVisit} amount={getTicketAmount()} setBuyingTicketFormHide={setBuyingTicketFormHide}/> }
            </View>}

            <Text>{"\n"}</Text>
            <View>
                <Text>Weather</Text>
                <FlatList
                    data={forcastForThreeCities}
                    renderItem={({item}) => <WeatherForcast forcast={item}/>}
                    keyExtractor={item => item.city.id}
                />
            </View>
        </ScrollView>
    );
}