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
import {Dimensions} from "react-native";
import {useTranslation} from "react-i18next";

const {width, height} = Dimensions.get("window")

import {BLUE, DARKBLUE, GRAY} from '../../config.json'
import {Alert} from "./alert";

const styles = StyleSheet.create({
        input: {
            backgroundColor: "#fff",
            width: width > height ? width * 0.15 : height * 0.3,
            //height: width > height ? height * 0.05 : width * 0.1,
            paddingLeft: height * 0.01,
            color: DARKBLUE,
            placeHolderTextColor: "#fff",
            fontSize: width > height ? height * 0.02 : width * 0.04,
            borderColor: "transparent"
        },
        form: {
            //gap: width>height? height * 0.02:width*0.02,
            //width: width > height ? width: height,
            paddingVertical: width > height ? width * 0.01 : height * 0.01,
            alignItems: "center",

        },
        generalInfos: {
            backgroundColor: BLUE,
            alignItems: "center",
            gap: 20,
            flexDirection: "column",
            padding: 20,
            width: width > height ? width * 0.48 : height * 0.35,


        },
        presentatonDetails: {
            backgroundColor: BLUE,
            alignItems: "center",
            gap: 20,
            //height:height*1.2,
            flexDirection: "column",
            padding: 20,
            width: width > height ? width * 0.48 : height * 0.35,
            marginBottom: width > height ? width * 0.02 : height * 0.02
        },
        title: {
            textAlign: "center",
            color: BLUE,
            fontSize: width > height ? width * 0.02 : height * 0.03,
            marginBottom: width > height ? width * 0.02 : height * 0.02

        },
        error: {
            fontSize: width > height ? height * 0.02 : width * 0.04,
            color: "red"
        }
        ,
        success: {
            fontSize: width > height ? height * 0.02 : width * 0.04,
            color: "green"
        }
    }
);

export const VirtualVisitForm = () => {
    const {t} = useTranslation('virtualVisitForm')

    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        museumId: '', date: ['', '', ''], time: ['', ''], duration: '', price: '0.0', yt_link: ''
    });
    const [museums, setMuseums] = useState([]);
    const [getSession,] = useSessionStorageJwt();

    const [alertStyle, setAlertStyle] = useState({});
    const [message, setMessage] = useState("");

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
                setAlertStyle(styles.error)
                setMessage(response.message)
                return
            }
            const retrievedMuseums = response.content
            setMuseums(retrievedMuseums)
        } catch (error) {
            setAlertStyle(styles.error)
            setMessage(error)
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
            const response = await addVirtualVisit(session.jwt, formData.museumId, datetime, formData.duration, formData.price, images, formData.yt_link);
            if (response.status !== "200") {
                setAlertStyle(styles.error)
                setMessage(response.message)
                return
            }
            const retrievedMuseums = response.content
            setMuseums(retrievedMuseums)
        } catch (error) {
            setAlertStyle(styles.error)
            setMessage(t('errorWhileAddingVisit'))
            console.log('An error occurred while retrieving museums:', error);
        }
    };

    const handleChange = (field, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData, [field]: value,
        }));
    };
    return (<ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.title}>Let's create a virtual visit!</Text>
        <CustomDatePicker style={styles.input} value={formData.date}
                          onChange={setDate => handleChange("date", setDate(formData.date))}/>
        <CustomTimePicker style={styles.input} value={formData.time}
                          onChange={setTime => handleChange("time", setTime(formData.time))}/>
        <View style={styles.generalInfos}>
            <Text style={{color: "#fff", fontSize: width > height ? width * 0.01 : height * 0.01}}>Set a general
                infos</Text>
            <View style={{alignItems: "center", flexDirection: "column", gap: 10}}>
                <CustomPicker
                    style={styles.input}
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
                    style={styles.input}
                    placeholder={t('pricePlaceholder')}
                    inputMode={"decimal"}
                    value={formData.price.toString()}
                    onChangeText={(price) => handleChange('price', price)}
                />
                <TextInput
                    style={styles.input}
                    placeholder={t('durationPlaceholder')}
                    inputMode={"numeric"}
                    value={formData.duration.toString()}
                    onChangeText={(duration) => handleChange('duration', duration)}
                />
            </View>
        </View>
        <View style={styles.presentatonDetails}>
            <TextInput
                style={styles.input}
                placeholder={t('youtubeLinkPlaceholder')}
                value={formData.yt_link}
                onChangeText={(yt_link) => handleChange('yt_link', yt_link)}
            />
            {formData.yt_link !== "" && <YtPlayer link={formData.yt_link} width={250} height={250}/>}
            <View style={{alignItems: 'center', gap: 10}}>
                <Button title={t('imagePickerPlaceholder')} onPress={pickImage}/>
                {images.map((image, index) => (
                    <Image key={index} source={{uri: image}} style={{width: 200, height: 200}}/>))}
            </View>


        </View>
        <Button title={t('addVirtualVisitButtonTitle')} onPress={handleSubmit}/>
    </View>);
}
