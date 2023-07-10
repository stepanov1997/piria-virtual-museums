import {ScrollView, StyleSheet, Text, View} from "react-native";
import {UserAdministration} from "../layout/admin/userAdministration";
import React, {useEffect, useState} from "react";
import { Dimensions } from "react-native";
import {DARKBLUE} from '../../config.json'
import {useTranslation} from "react-i18next";
import userClient from "../api_clients/userClient";
import {Alert} from "../components/alert";
import {useSessionStorageJwt} from "../util/jwtHook";
const { width, height } = Dimensions.get("window");
export const UserAccountScreen = () => {
    const [registeredUsers, setRegisteredUsers] = useState([])
    const [errorMessage, setErrorMessage] = useState("");
    const [getSession] = useSessionStorageJwt()

    useEffect(() => {
        (async function() {
            const jwt = (await getSession()).jwt
            try {
                const response = await userClient.getRegisteredUsers(jwt);
                if(response.status !== "200") {
                    setErrorMessage(response.message)
                } else {
                    setRegisteredUsers(response.content)
                }
            } catch (e) {
                setErrorMessage(t('errorMessage'))
            }
        })()
    }, [])

    return(
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.contentBlue}>
                <UserAdministration registeredUsers={registeredUsers}/>
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
        gap:width>height? width*0.10:height*0.01,
        marginVertical:width>height? width*0.06:height*0.2,
    },
    contentBlue:{
        width:width>height ? width*0.5: width*0.9,
        alignItems:"center",
        gap:width>height ? width*0.01 : height*0.01,
        paddingVertical:height*0.09,
        backgroundColor:DARKBLUE,
        flexDirection:"column",
        borderRadius:10,
    },
    error: {
        fontSize: width > height ? height * 0.02 : width * 0.04,
        color: "red"
    }
});
