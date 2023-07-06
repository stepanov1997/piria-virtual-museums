import {Button, View, TextInput, Platform} from "react-native";
import React, {useEffect, useState} from "react";
import museumClient from "../../api_clients/museumClient";
import {useSessionStorageJwt} from "../../util/jwtHook";
import {addVirtualVisit} from "../../api_clients/virtualVisitsClient";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { DateTime } from "luxon";
import {Picker} from "react-native-web";
import CustomDatePicker from "../../components/CustomDatePicker";
import CustomTimePicker from "../../components/CustomTimePicker";

export const VirtualVisitAdministration = () => {
    const [formData, setFormData] = useState({
        museumId: '',
        date: [],
        time: [],
        duration: '',
        price: 0.0
    });
    const [museums, setMuseums] = useState([]);
    const [getSession,] = useSessionStorageJwt();
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        fetchMuseums();
    }, []);

    const fetchMuseums = async () => {
        try {
            const session = await getSession()
            setMuseums(await museumClient.getAllMuseums(session.jwt))
        } catch (error) {
            console.log('An error occurred while retrieving museums:', error);
        }
    };

    const handleSubmit = async () => {
        const session = await getSession()
        try {
            await addVirtualVisit(
                session.jwt,
                formData.museumId, formData.datetime, formData.duration, formData.price
            )
        } catch (e) {
            console.log(`Error while adding virtual visit. Error: ${e}`)
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
            {/*<CustomDatePicker value={formData.date} onChange={date => handleChange("date", date)} />*/}
            {/*<CustomTimePicker value={formData.time} onChange={time => handleChange("time", time)} />*/}
            <View>
                {
                    ['ios', 'android'].includes(Platform.OS) ? (
                        <RNPickerSelect
                            value={formData.museumId}
                            placeholder={{
                                label: 'Select museum...',
                                value: null,
                            }}
                            onValueChange={(value, index) => {
                                handleChange("museumId", value)
                            }}
                            items={museums.map((museum) => (
                                {
                                    label: `${museum.name} (${museum.country})`,
                                    value: museum.id
                                }))
                            }
                        />
                    ) : (
                        <Picker
                            selectedValue={formData.museumId}
                            onValueChange={(value, index) => {
                                handleChange("museumId", value);
                            }}
                        >
                            <Picker.Item label="Select museum..." value={null} />
                            {museums.map((museum) => (
                                <Picker.Item
                                    key={museum.id}
                                    label={`${museum.name} (${museum.country})`}
                                    value={museum.id}
                                />
                            ))}
                        </Picker>
                    )
                }
            </View>

            <TextInput
                placeholder="Price"
                inputMode={"decimal"}
                value={formData.price.toString()}
                onChangeText={(price) => handleChange('price', price)}
            />
            <Button title="Add virtual visit" onPress={handleSubmit}/>
        </View>
    );

}