import {View, Text, Button, ScrollView} from 'react-native'
import {useEffect, useState} from "react";
import {RadioButton} from 'react-native-paper';
import {generateMuseumDetails, getThreeRandomCities} from '../api_clients/chatGptClient'
import {getForcastForThreeCities} from '../api_clients/openWeatherClient'
import {getAllByMuseumId} from '../api_clients/virtualVisitsClient'
import {TicketPaymentForm} from './forms/ticket-payment-form'
import {useSessionStorageJwt} from "../util/jwtHook";
import {WeatherForcast} from "./weather-forcast";

        museumCard: {
            backgroundColor: "#fff",
            borderRadius: 20,
            flexDirection: "column",
            gap: width > height ? height * 0.015 : height * 0.01,
            width: width > height ? width * 0.8 : height * 0.4,
            //height: width > height ? width * 0.7 : height * 0.35,
            padding: height * 0.05,
            alignItems: "center",
        },
        details: {
            justifyContent: "center",
            gap: height * 0.01,
            alignItems: "center"

        },
        weatherTitle: {
            textAlign: "center",
            color: GRAY,
            fontSize: width > height ? width * 0.02 : height * 0.03,
            marginBottom: height * 0.03
        },
        button: {
            width:width>height? height * 0.25:height*0.1
        },
        image: {
            width: width > height ? width * 0.2 : height * 0.34,
            height: width > height ? width * 0.15 : height * 0.35,
            borderRadius: 20
        },
    museumDetails:{
            fontSize:width>height ? width*0.01:height*0.015
    },

    }
)

export const MuseumComponent = ({museum}) => {
    const {t} = useTranslation('museumComponent')

    const [selectedVirtualVisit, selectVirtualVisit] = useState(0);
    const [virtualVisits, setVirtualVisits] = useState([])
    const [details, setDetails] = useState("")
    const [buyingTicketFormHide, setBuyingTicketFormHide] = useState(true)
    const [showVirtualVisits, setShowVirtualVisits] = useState(false)
    const [getSession,] = useSessionStorageJwt()
    const [forcastForThreeCities, setForcastForThreeCities] = useState([])


    useEffect(() => {
        (async function () {
            const threeRandomCities = await getThreeRandomCities(museum.country)
            const forcastForThreeCities = await getForcastForThreeCities(threeRandomCities)
            setForcastForThreeCities(forcastForThreeCities)
        })()
    }, [museum])

    useEffect(() => {
        (async function () {
            if(!museum) {
                const gptDetails = await generateMuseumDetails(museum.name, museum.country)
                setDetails(gptDetails)
            }
        })()
    }, [])

    const showVirtualVisitsFunction = async () => {
        if (virtualVisits.length === 0) {
            const {jwt} = await getSession();
            const response = await getAllByMuseumId(jwt, museum.id)
            if (response.status !== '200') {
                alert(response.message)
                return
            }
            setVirtualVisits(response.content)
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