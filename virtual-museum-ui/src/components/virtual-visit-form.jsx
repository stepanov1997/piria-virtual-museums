import {Button, View, TextInput, Image} from "react-native";
import React, {useEffect, useState} from "react";
import museumClient from "../api_clients/museumClient";
import {useSessionStorageJwt} from "../util/jwtHook";
import {addVirtualVisit} from "../api_clients/virtualVisitsClient";
import {DateTime} from "luxon";
import CustomDatePicker from "./CustomDatePicker";
import CustomTimePicker from "./CustomTimePicker";
import {CustomPicker} from "./CustomPicker";
import * as ImagePicker from 'expo-image-picker';
import {YtPlayer} from "./yt-player";


export const VirtualVisitForm = () => {
    const {t} = useTranslation('virtualVisitForm')

    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        museumId: '', date: ['', '', ''], time: ['', ''], duration: '', price: '0.0', yt_link: ''
    });
    const [museums, setMuseums] = useState([]);
    const [getSession,] = useSessionStorageJwt();

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
            const response = await museumClient.getAllMuseums(session.jwt)
            if (response.status !== "200") {
                alert(response.message)
                return
            }
            const retrievedMuseums = response.content
            setMuseums(retrievedMuseums)
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
            await addVirtualVisit(session.jwt, formData.museumId, datetime, formData.duration, formData.price, images, formData.yt_link)
        } catch (e) {
            console.log(`Error while adding virtual visit. Error: ${e}`)
        }
    };

    const handleChange = (field, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData, [field]: value,
        }));
    };
    return (<View style={{alignItems: "center", gap: width > height ? width * 0.01 : height * 0.01}}>
        <CustomDatePicker style={{
            backgroundColor: "#fff",
            width: width > height ? width * 0.15 : height * 0.3,
            height: width > height ? height * 0.04 : width * 0.1,
            paddingLeft: height * 0.01,
            color: "#000",
            fontSize: width > height ? height * 0.02 : width * 0.04,
            borderColor: "transparent"
        }} value={formData.date} onChange={setDate => handleChange("date", setDate(formData.date))}/>
        <CustomTimePicker value={formData.time} onChange={setTime => handleChange("time", setTime(formData.time))}/>
        <CustomPicker
            value={formData.museumId}
            onValueChange={(value) => {
                handleChange("museumId", value)
            }}
            items={museums}
            placeholder={`${t('museumPickerPlaceholder')}:`}
            labelMapper={museum => `${museum.name} (${museum.country})`}
            valueMapper={museum => museum.id}
        />
        <TextInput
            placeholder={t('pricePlaceholder')}
            style={{
                backgroundColor: "#fff",
                width: width > height ? width * 0.15 : height * 0.3,
                height: width > height ? height * 0.04 : width * 0.1,
                paddingLeft: height * 0.01,
                color: "#000",
                fontSize: width > height ? height * 0.02 : width * 0.04,
                borderColor: "transparent"
            }}
            inputMode={"decimal"}
            value={formData.price.toString()}
            onChangeText={(price) => handleChange('price', price)}
        />
        <TextInput
            placeholder={t('durationPlaceholder')}
            style={{
                backgroundColor: "#fff",
                width: width > height ? width * 0.15 : height * 0.3,
                height: width > height ? height * 0.04 : width * 0.1,
                paddingLeft: height * 0.01,
                color: "#000",
                fontSize: width > height ? height * 0.02 : width * 0.04,
                borderColor: "transparent"
            }}
            inputMode={"numeric"}
            value={formData.duration.toString()}
            onChangeText={(duration) => handleChange('duration', duration)}
        />
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Button title={t('imagePickerPlaceholder')} onPress={pickImage}/>
            {images.map((image, index) => (
                <Image key={index} source={{uri: image}} style={{width: 200, height: 200}}/>))}
        </View>
        <TextInput
            style={{
                backgroundColor: "#fff",
                width: width > height ? width * 0.15 : height * 0.3,
                height: width > height ? height * 0.04 : width * 0.1,
                paddingLeft: height * 0.01,
                color: "#000",
                fontSize: width > height ? height * 0.02 : width * 0.04,
                borderColor: "transparent"
            }}
            placeholder={t('youtubeLinkPlaceholder')}
            value={formData.yt_link}
            onChangeText={(yt_link) => handleChange('yt_link', yt_link)}
        />
        {formData.yt_link !== "" && <YtPlayer link={formData.yt_link}/>}
        <Button title={t('addVirtualVisitButtonTitle')} onPress={handleSubmit}/>
    </View>);
}
