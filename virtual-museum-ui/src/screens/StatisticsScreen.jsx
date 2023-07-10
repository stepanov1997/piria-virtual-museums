import {ScrollView, Text, View,StyleSheet} from "react-native";
import {Chart} from "../components/chart";
import React, {useEffect, useState} from "react";
import { Dimensions } from "react-native";
import {BLUE,DARKBLUE,GRAY} from '../../config.json'
import {useTranslation} from "react-i18next";
import userClient from "../api_clients/userClient";
import {Alert} from "../components/alert";
import {useSessionStorageJwt} from "../util/jwtHook";
const { width, height } = Dimensions.get("window");

export const StatisticsScreen = () => {
    const {t} = useTranslation('adminHomeFeed')

    const [activeUsersByHour, setActiveUsersByHour] = useState([])
    const [currentlyActiveUsers, setCurrentlyActiveUsers] = useState([])
    const [registeredUsers, setRegisteredUsers] = useState([])

    const [getSession] = useSessionStorageJwt()
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        (async function() {
            const jwt = (await getSession()).jwt
            var errorMessage = ''
            try {
                const response = await userClient.getActiveUsersByHour(jwt);
                if(response.status !== "200") {
                    errorMessage += `${response.message}\n`
                } else {
                    setActiveUsersByHour(response.content)
                }
            } catch (e) {
                errorMessage += `${t('errorMessage')}\n`
            }
            try {
                const response = await userClient.getCurrentlyActiveUsers(jwt);
                if(response.status !== "200") {
                    errorMessage += `${response.message}\n`
                } else {
                    setCurrentlyActiveUsers(response.content)
                }
            } catch (e) {
                errorMessage += `${t('errorMessage')}\n`
            }
            try {
                const response = await userClient.getRegisteredUsers(jwt);
                if(response.status !== "200") {
                    errorMessage += `${response.message}\n`
                } else {
                    setRegisteredUsers(response.content)
                }
            } catch (e) {
                errorMessage += `${t('errorMessage')}\n`
            }
            setErrorMessage(errorMessage)
        })()
    }, [])

    return(
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.contentBlue}>
                <Text style={styles.label}>{t('numberOfRegisteredUsersLabel')}: {registeredUsers.length}</Text>
                <Text style={styles.label}>{t('numberOfActiveUsersLabel')}: {currentlyActiveUsers}</Text>
                {activeUsersByHour.length>0 ? <Chart data={activeUsersByHour} /> : <Text/>}
            </View>
            {errorMessage && <Alert message={errorMessage} style={styles.error}/>}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        width:width,
        backgroundColor:"#f2f2f2",
        alignItems:"center",
        flexDirection:"column",
        gap:width>height? width*0.10:height*0.04,
        marginVertical:width>height? width*0.06:height*0.1,
    },
    contentBlue:{
        width:width>height ? width*0.5: width*0.9,
        alignItems:"center",
        gap:width>height ? width*0.01 : height*0.01,
        paddingVertical:height*0.04,
        backgroundColor:DARKBLUE,
        flexDirection:"column",
        borderRadius:10,
    },
    label:{
        textAlign:"center",
        color:"#fff",
        fontSize:width>height ? height*0.03:width*0.05

    },
    error: {
        fontSize: width > height ? height * 0.02 : width * 0.04,
        color: "red"
    }
});
