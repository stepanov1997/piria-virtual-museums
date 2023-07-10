import {Platform, Button, View, TextInput, Text} from "react-native";
import React, {useEffect, useState} from "react";
import museumClient from "../../api_clients/museumClient";
import {useSessionStorageJwt} from "../../util/jwtHook";
import battutaClient from "../../api_clients/battutaClient";
import {CustomPicker} from "../../components/CustomPicker";

export const MuseumAdministration = () => {
    const {t} = useTranslation('museumAdministration')

    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [getSession,] = useSessionStorageJwt();

    useEffect(() => {
        (async function () {
            await fetchCountries();
        })()
    }, []);

    const selectedCountry = formData.country

    useEffect(() => {
        (async function () {
            const jwt = (await getSession()).jwt
            if (formData.country) {
                try {
                    const response = await battutaClient.getAllCities(jwt, formData.country)
                    if (response.status !== "200") {
                        alert(response.message)
                        return
                    }
                    setCities(response.content)
                } catch (e) {
                    alert(e)
                }
            }
        })()
    }, [selectedCountry]);

    const fetchCountries = async () => {

        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            const data = await response.json();
            data.sort(function (a, b) {
                var nameA = a.name.common.toUpperCase();
                var nameB = b.name.common.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            })
            setCountries(data);
        } catch (error) {
            console.log('An error occurred while retrieving states:', error);
        }
    };
    const handleSubmit = async () => {

        const session = await getSession()
        try {
            await museumClient.addMuseum(
                session.jwt,
                formData.name, formData.address, formData.phone_number, formData.city,
                formData.country, formData.latitude, formData.longitude, formData.type
            )
        } catch (e) {
            console.log(`Error while adding museum. Error: ${e}`)
        }
    };
    const handleChange = (field, value) => {

        setFormData((prevFormData) => ({
            ...prevFormData,
            [field]: value,
        }));
    };
    return (
        <View style={styles.form}>
            <TextInput
                placeholderTextColor="#fff"
                style={styles.input}
                placeholder={t('museumNamePlaceholder')}
                value={formData.name}
                onChangeText={(text) => handleChange('name', text)}
            />
            <TextInput
                placeholderTextColor="#fff"
                style={styles.input}
                placeholder={t('museumAddressPlaceholder')}
                value={formData.address}
                onChangeText={(text) => handleChange('address', text)}
            />

            <CustomPicker
                style={styles.input}
                value={formData.country}
                onValueChange={(value) => {
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        country: value,
                    }));
                }}
                placeholder={t('museumCountryPickerPlaceholder')}
                items={countries}
                labelMapper={country => `${country.name.common} (${country.cca2})`}
                valueMapper={country => country.cca2}
            />

            <CustomPicker
                style={styles.input}
                value={formData.city}
                onValueChange={(value) => {
                    const city = cities.find(e => e.city === value)
                    console.log(JSON.stringify(city))
                    console.log(JSON.stringify(formData))
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        city: value,
                        latitude: city?.latitude ?? '',
                        longitude: city?.longitude ?? '',
                    }));
                }}
                placeholder={t('museumCityPickerPlaceholder')}
                items={cities}
                labelMapper={city => city.city}
                valueMapper={city => city.city}
            />

            <TextInput
                placeholderTextColor="#fff"
                style={styles.input}
                placeholder={t('museumLatitudePlaceholder')}
                value={formData.latitude.toString()}
                onChangeText={(text) => handleChange('latitude', text)}
            />
            <TextInput
                placeholderTextColor="#fff"
                style={styles.input}
                placeholder={t('museumLongitudePlaceholder')}
                value={formData.longitude.toString()}
                onChangeText={(text) => handleChange('longitude', text)}
            />
            <TextInput
                placeholderTextColor="#fff"
                style={styles.input}
                inputMode={"tel"}
                placeholder={t('museumPhoneNumberPlaceholder')}
                value={formData.phone_number}
                onChangeText={(text) => handleChange('phone_number', text)}
            />
            <TextInput
                placeholderTextColor="#fff"
                style={styles.input}
                placeholder={t('museumTypePlaceholder')}
                value={formData.type}
                onChangeText={(text) => handleChange('type', text)}
            />
            <Button title={t('addMuseumButtonTitle')} onPress={handleSubmit}/>
        </View>
    );
}

const styles = StyleSheet.create({
        input: {
            backgroundColor: DARKBLUE,
            width: width > height ? width * 0.15 : height * 0.3,
            //height: width > height ? height * 0.05 : width * 0.1,
            paddingLeft: height * 0.01,
            color: "#fff",
            placeHolderTextColor: "#fff",
            fontSize: width > height ? height * 0.02 : width * 0.04,
            borderColor: "transparent"
        },
        form: {
            gap: width > height ? height * 0.02 : width * 0.02,
            width: width > height ? width * 0.15 : height * 0.3,
            height: width > height ? height * 0.04 : width * 0.1,
            alignItems: "center"
        }
    }
);
