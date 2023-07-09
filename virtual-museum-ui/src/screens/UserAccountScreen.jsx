import {ScrollView, StyleSheet, Text, View} from "react-native";
import {Chart} from "../components/chart";
import {UserAdministration} from "../layout/admin/userAdministration";
import {MuseumAdministration} from "../layout/admin/museumAdministration";
import {VirtualVisitForm} from "../components/virtual-visit-form";
import React, {useEffect, useState} from "react";
import { Dimensions } from "react-native";
import {BLUE,DARKBLUE,GRAY} from '../../config.json'
import {useTranslation} from "react-i18next";
import userClient from "../api_clients/userClient";
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        width:width,
        backgroundColor:"#f2f2f2",
        alignItems:"center",
        flexDirection:"column",
        gap:width>height? width*0.10:height*0.01,
        marginVertical:width>height? width*0.06:height*0.2,
        // flex:1
        // paddingVertical:width>height? width*0.03:height*0.03,
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

});
export const UserAccountScreen = () => {
    const [registeredUsers, setRegisteredUsers] = useState([])

    useEffect(() => {
        (async function() {
            setRegisteredUsers(await userClient.getRegisteredUsers())
        })()
    }, [])

    return(
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.contentBlue}>
                <UserAdministration registeredUsers={registeredUsers}/>
            </View>
        </ScrollView>
    )
}