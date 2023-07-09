import {ScrollView, Text, View} from "react-native";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import {BLUE,DARKBLUE,GRAY} from '../../config.json'
import {useTranslation} from "react-i18next";
import React from "react";
import {VirtualVisitForm} from "../components/virtual-visit-form";
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        width:width,
        backgroundColor:"#f2f2f2",
        alignItems:"center",
        flexDirection:"column",
        gap:width>height? width*0.10:height*0.01,
        //marginVertical:width>height? width*0.06:height*0.08,
        // flex:1
        // paddingVertical:width>height? width*0.03:height*0.03,
    },
    contentGray:{
        width:width>height ? width*0.5: width*0.9,
        alignItems:"center",
        gap:width>height ? width*0.01 : height*0.01,
        paddingVertical:height*0.03,
        backgroundColor:GRAY,
        flexDirection:"column",
        borderRadius:10,
    },

    label:{
        textAlign:"center",
        color:"#fff",
        fontSize:width>height ? height*0.03:width*0.05

    }

});
export const CreatePresentationScreen = () => {
    return(
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentGray}>
                <VirtualVisitForm/>
            </ScrollView>
        </View>
    )
}