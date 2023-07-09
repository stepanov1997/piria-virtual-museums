import React, {useEffect} from "react";
import {View, Text, Pressable, Platform, Dimensions, StyleSheet} from "react-native";
import {useTranslation} from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userClient from "../api_clients/userClient";
import {useSessionStorageJwt} from "../util/jwtHook";
import {changeLanguage} from "i18next";
import {useRoute} from "@react-navigation/native";
const { width, height } = Dimensions.get("window");
import {BLUE} from "../../config.json"
const LANGUAGES = [
    {
        code: "en",
    },
    {
        code: "sr",
    },
];

const LanguageSelector = ({onlyLocal}) => {
    const {t, i18n} = useTranslation('languageSelector');
    const [getSession,,] = useSessionStorageJwt()

    const selectedLanguageCode = i18n.language;

    const setLanguage = async (code) => {
        const session = await getSession();
        if(!onlyLocal && "jwt" in session) {
            await userClient.setUserLanguage(session.jwt, code)
        }
        i18n.changeLanguage(code);
    };

    return (
        <View
            style={styles.container}
        >
            <Text style={styles.title}>
                {t("languageSelectorTitle")}
            </Text>

            {LANGUAGES.map(({code}) => {
                const selectedLanguage = code === selectedLanguageCode;

                return (
                    <Pressable
                        key={code}
                        disabled={selectedLanguage}
                        onPress={async () => await setLanguage(code)}
                    >
                        <Text
                            style={[
                                selectedLanguage
                                    ? styles.selectedText
                                    : styles.text
                            ]}
                        >
                            {t(`${code}`)}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
};

const styles =StyleSheet.create( {
    container: {
        marginTop: width * 0.02,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        gap:width>height? width*0.005:height*0.005
    },
    title: {
        fontSize:width>height? width * 0.015:height*0.015,
        fontWeight: "600",
        color:BLUE
    },
    text: {
        fontSize:width>height? width * 0.01:height*0.01,
        color: "#000",

    },
    selectedText: {
        fontSize:width>height? width * 0.01:height*0.01,
        fontWeight: "600",
        color: "#4b8eff",

    },
});



export default LanguageSelector;