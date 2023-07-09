import {Platform, Button, View, TextInput, Text} from "react-native";
import React, {useEffect, useState} from "react";
import museumClient from "../../api_clients/museumClient";
import {useSessionStorageJwt} from "../../util/jwtHook";
import battutaClient from "../../api_clients/battutaClient";
import {CustomPicker} from "../../components/CustomPicker";

export const MuseumAdministration = () => {
    const {t} = useTranslation('museumAdministration')

    const [formData, setFormData] = useState({
        id: '',
        address: '',
        city: '',
        country: '',
        latitude: '',
        longitude: '',
        name: '',
        phone_number: '',
        type: '',
    });
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
            console.log(formData.country)
            if (formData.country) {
                try {
                    const response = await battutaClient.getAllCities(formData.country)
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
        <View>
            <TextInput
                placeholder="Name"
                value={formData.name}
                onChangeText={(text) => handleChange('name', text)}
            />
            <TextInput
                placeholder="Address"
                value={formData.address}
                onChangeText={(text) => handleChange('address', text)}
            />

            <CustomPicker
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
                placeholder="Latitude"
                value={formData.latitude.toString()}
                onChangeText={(text) => handleChange('latitude', text)}
            />
            <TextInput
                placeholder="Longitude"
                value={formData.longitude.toString()}
                onChangeText={(text) => handleChange('longitude', text)}
            />
            <TextInput
                placeholder="Phone Number"
                value={formData.phone_number}
                onChangeText={(text) => handleChange('phone_number', text)}
            />
            <TextInput
                placeholder="Type"
                value={formData.type}
                onChangeText={(text) => handleChange('type', text)}
            />
            <Button title={t('addMuseumButtonTitle')} onPress={handleSubmit}/>
        </View>
    );

}