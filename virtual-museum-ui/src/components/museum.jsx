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

export const MuseumComponent = ({museum}) => {
    const {t} = useTranslation('museumComponent')
    const [selectedVirtualVisit, selectVirtualVisit] = useState(0);
    const [loading, setLoading] = useState(true);

    const [virtualVisits, setVirtualVisits] = useState([])
    const [details, setDetails] = useState("")
    const [buyingTicketFormHide, setBuyingTicketFormHide] = useState(true)
    const [showVirtualVisits, setShowVirtualVisits] = useState(false)
    const [getSession,] = useSessionStorageJwt()
    const [forcastForThreeCities, setForcastForThreeCities] = useState([])
    const [showButtonPayment, setShowButtonPayment] = useState(true)

    useEffect(() => {
        (async function () {
            const threeRandomCities = await getThreeRandomCities(museum.country)
            const forcastForThreeCities = await getForcastForThreeCities(threeRandomCities)
            setForcastForThreeCities(forcastForThreeCities)
            setLoading(false)
        })()
    }, [museum])

    useEffect(() => {
        console.log(museum);
        (async function () {
            if (museum) {
                const gptDetails = await generateMuseumDetails(museum.name, museum.country, t('detailsLanguage'));
                setDetails(gptDetails);
                console.log(details);
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
            {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={BLUE}/>
                    </View>
                ) :
                ((forcastForThreeCities && details) && <View style={styles.container}>
                    <View style={styles.leftContainer}>
                        <View style={styles.museumCard}>
                            <Image source={require('../../assets/museum_card.jpg')}
                                   style={styles.image}></Image>
                            <View style={styles.details}>
                                <Text style={styles.museumName}>{museum.name}</Text>
                                <Text style={styles.museumDetails}>{t('addressLabel')}: {museum.address}</Text>
                                <Text style={styles.museumDetails}>{t('phoneNumberLabel')}: {museum.phoneNumber}</Text>
                                <Text
                                    style={styles.museumDetails}>{t('cityLabel')}: {museum.city}, {museum.country}</Text>
                                <Text style={styles.museumDetails}>{t('coordinatesLabel')}:
                                    ({museum.latitude}, {museum.longitude})</Text>
                                <Text style={styles.museumDetails}>{t('typeLabel')}: {museum.type}</Text>
                                <Text style={styles.museumDetails}>{t('detailsLabel')}{"\n\n"}{details}</Text>
                                <View style={styles.button}>
                                    <Button
                                        title={`${showVirtualVisits ? t('hideText') : t('showText')} ${t('virtualVisitsText')}`}
                                        onPress={showVirtualVisitsFunction}/>
                                </View>
                            </View>
                        </View>
                        {showVirtualVisits && <View style={styles.visits}>
                            <RadioButton.Group onValueChange={selectVirtualVisit} value={selectedVirtualVisit}>
                                {virtualVisits.map((item, index) =>
                                    (
                                        <RadioButton.Item
                                            key={index}
                                            label={`${t('datetimeLabel')}: ${item.datetime}, ${t('durationLabel')}: ${item.duration}, ${t('priceLabel')}: ${item.price}€`}
                                            value={item.id}>
                                        </RadioButton.Item>
                                    )
                                )}
                            </RadioButton.Group>
                            <Text>{"\n"}</Text>
                            {showButtonPayment && <View style={styles.button}>
                                <Button title={t('buyTicketButtonTitle')} onPress={() => {
                                    setBuyingTicketFormHide(prevState => !prevState);
                                    setShowButtonPayment(!showButtonPayment);
                                }}/>
                            </View>}
                            {(!buyingTicketFormHide) &&
                                <TicketPaymentForm selectedVirtualVisit={selectedVirtualVisit}
                                                   amount={getTicketAmount()}
                                                   setBuyingTicketFormHide={setBuyingTicketFormHide}
                                                   setHideVirtualVisits={setShowVirtualVisits}/>}
                        </View>}

                        <Text>{"\n"}</Text>
                    </View>
                    <View style={styles.rightContainer}>

                        <Text style={styles.weatherTitle}>{t('weatherTitle')}</Text>
                        <View style={{
                            flexDirection: width > height ? "row" : "column",
                            paddingHorizontal: width > height ? height * 0.02 : width * 0.02
                        }}>
                            {
                                forcastForThreeCities.map((item, index) => (
                                    <WeatherForcast key={index} forcast={item}/>
                                ))
                            }
                        </View>
                    </View>
                </View>)
            }</ScrollView>
    );
}

const styles = StyleSheet.create({
        container: {
            paddingTop: width * 0.02,
            width: width,
            alignItems: "center",
            flexDirection: "column",
            gap: width > height ? height * 0.02 : height * 0.04,
            backgroundColor: GRAY

        },
        leftContainer: {
            gap: width > height ? height * 0.04 : height * 0.04,
            alignItems: "center"
        },
        rightContainer: {
            gap: width > height ? height * 0.005 : height * 0.005,
            backgroundColor: "#fff",
            borderRadius: 20,
            flexDirection: "column",
            alignItems: "center",
            marginHorizontal: width > height ? height * 0.8 : width * 0.8,
            marginBottom: width > height ? height * 0.05 : width * 0.5,
            paddingBottom: width > height ? height * 0.02 : width * 0.02

        },
        visits: {
            backgroundColor: "#fff",
            borderRadius: 20,
            gap: width > height ? height * 0.015 : width * 0.015,
            width: width > height ? width * 0.36 : height * 0.4,
            //height: width > height ? width * 0.15 : height * 0.35,
            paddingBottom: height * 0.01,
            paddingHorizontal: height * 0.05,
            alignItems: "center",
            justifyContent: "center",

        },
        museumName: {
            textAlign: "center",
            fontWeight: "bold",
            color: DARKBLUE,
            fontSize: width > height ? width * 0.01 : height * 0.02,
            marginBottom: height * 0.03

        },

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
            width: width > height ? height * 0.25 : height * 0.1
        },
        image: {
            width: width > height ? width * 0.2 : height * 0.34,
            height: width > height ? width * 0.15 : height * 0.35,
            borderRadius: 20
        },
        museumDetails: {
            fontSize: width > height ? width * 0.01 : height * 0.015
        },

    }
)
