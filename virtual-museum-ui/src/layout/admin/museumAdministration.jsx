import {Platform, Button, View, TextInput, Text} from "react-native";
import React, {useEffect, useState} from "react";
import museumClient from "../../api_clients/museumClient";
import {useSessionStorageJwt} from "../../util/jwtHook";
import RNPickerSelect from "react-native-picker-select";
import battutaClient from "../../api_clients/battutaClient";
import {Picker} from "react-native-web";

export const MuseumAdministration = () => {
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
        (async function() {
            await fetchCountries();
        })()
    }, []);

    const selectedCountry = formData.country

    useEffect(() => {
        (async function () {
            console.log(formData.country)
            if(formData.country) {
                try {
                    setCities(await battutaClient.getAllCities(formData.country))
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

            <View>
                {
                    ['ios', 'android'].includes(Platform.OS) ? (
                        <RNPickerSelect
                            value={formData.country}
                            placeholder={{
                                label: 'Select country...',
                                value: "",
                            }}
                            onValueChange={(value) => {
                                setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    country: value,
                                }));
                            }}
                            items={countries.map((country) => (
                                {
                                    label: `${country.name.common} (${country.cca2})`,
                                    value: country.cca2
                                }
                            ))}
                        />
                    ) : (
                        <Picker
                            selectedValue={formData.country}
                            onValueChange={(value) => {
                                setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    country: value,
                                }));
                            }}
                        >
                            <Picker.Item label="Select country..." value=""/>
                            {countries.map((country) => (
                                <Picker.Item
                                    key={country.cca2}
                                    label={`${country.name.common} (${country.cca2})`}
                                    value={country.cca2}
                                />
                            ))}
                        </Picker>
                    )
                }
            </View>


            <View>
                {
                    ['ios', 'android'].includes(Platform.OS) ? (
                        <RNPickerSelect
                            value={formData.city}
                            placeholder={{
                                label: 'Select city...',
                                value: "",
                            }}
                            onValueChange={(value, index) => {
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
                            items={cities.map((city) => (
                                {
                                    label: city.city,
                                    value: city.city
                                }
                            ))}
                        />
                    ) : (
                        <Picker
                            selectedValue={formData.city}
                            onValueChange={(value, index) => {
                                const city = cities.find(e => e.city === value);
                                setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    city: value,
                                    latitude: city?.latitude ?? '',
                                    longitude: city?.longitude ?? '',
                                }));
                            }}
                        >
                            <Picker.Item label="Select city..." value={null}/>
                            {cities.map((city) => (
                                <Picker.Item key={city.city} label={city.city} value={city.city}/>
                            ))}
                        </Picker>
                    )
                }
            </View>

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
            <Button title="Add museum" onPress={handleSubmit}/>
        </View>
    );

}