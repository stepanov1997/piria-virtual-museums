import {Button, View, TextInput, Text, Image, Platform} from "react-native";
import React, {useEffect, useState, useCallback} from "react";
import museumClient from "../api_clients/museumClient";
import {useSessionStorageJwt} from "../util/jwtHook";
import {addVirtualVisit} from "../api_clients/virtualVisitsClient";
import {DateTime} from "luxon";
import CustomDatePicker from "./CustomDatePicker";
import CustomTimePicker from "./CustomTimePicker";
import {CustomPicker} from "./CustomPicker";
import * as ImagePicker from 'expo-image-picker';
import YoutubePlayer from "react-native-youtube-iframe";
import {YOUTUBE_API, YOUTUBE_API_KEY} from '../../config.json'
import {extractIdFromUrl} from "../util/youtube";
import { WebView } from 'react-native-webview';
import {YtPlayer} from "./yt-player";


export const VirtualVisitForm = () => {
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        museumId: '',
        date: ['', '', ''],
        time: ['', ''],
        duration: '',
        price: '0.0',
        yt_link: ''
    });
    const [museums, setMuseums] = useState([]);
    const [getSession,] = useSessionStorageJwt();
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        fetchMuseums();
    }, []);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 1,
            base64: true,
            allowsMultipleSelection: true,
            selectionLimit: 10
        });

        if (!result.canceled) {
            setImages(result.assets.map(asset => asset.uri));
        }
    };

    const fetchMuseums = async () => {
        try {
            const session = await getSession()
            setMuseums(await museumClient.getAllMuseums(session.jwt))
        } catch (error) {
            console.log('An error occurred while retrieving museums:', error);
        }
    };

    const handleSubmit = async () => {
        const datetime = DateTime.fromObject({
            year: formData.date[0],
            month: formData.date[1],
            day: formData.date[2],
            hour: formData.time[0],
            minute: formData.time[1],
            second: 0,
            millisecond: 0
        }).toISO({suppressMilliseconds: true})
        const session = await getSession()
        try {
            await addVirtualVisit(
                session.jwt,
                formData.museumId, datetime, formData.duration, formData.price,
                images, formData.yt_link
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
            <CustomDatePicker value={formData.date} onChange={setDate => handleChange("date", setDate(formData.date))}/>
            <CustomTimePicker value={formData.time} onChange={setTime => handleChange("time", setTime(formData.time))}/>
            <CustomPicker
                value={formData.museumId}
                onValueChange={(value) => {
                    handleChange("museumId", value)
                }}
                items={museums}
                placeholder={'Select museum...'}
                labelMapper={museum => `${museum.name} (${museum.country})`}
                valueMapper={museum => museum.id}
            />
            <TextInput
                placeholder="Price"
                inputMode={"decimal"}
                value={formData.price.toString()}
                onChangeText={(price) => handleChange('price', price)}
            />
            <TextInput
                placeholder="Duration"
                inputMode={"numeric"}
                value={formData.duration.toString()}
                onChangeText={(duration) => handleChange('duration', duration)}
            />
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Button title="Pick an image from camera roll" onPress={pickImage}/>
                {
                    images.map((image, index) => (
                        <Image key={index} source={{uri: image}} style={{width: 200, height: 200}}/>
                    ))
                }
            </View>
            <TextInput
                placeholder="Youtube link"
                value={formData.yt_link}
                onChangeText={(yt_link) => handleChange('yt_link', yt_link)}
            />
            <YtPlayer link={formData.yt_link}/>
            <Button title="Add virtual visit" onPress={handleSubmit}/>
        </View>
    );
}
