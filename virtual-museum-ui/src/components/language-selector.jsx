import React, {useEffect} from "react";
import {View, Text, Pressable, Platform, Dimensions, StyleSheet} from "react-native";
import {useTranslation} from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userClient from "../api_clients/userClient";
import {useSessionStorageJwt} from "../util/jwtHook";
import {changeLanguage} from "i18next";
import {useRoute} from "@react-navigation/native";
const { width, height } = Dimensions.get("window");

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
                        style={styles.buttonContainer}
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
        marginTop: width * 0.03,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        color: "#000000",
        fontSize: width * 0.02,
        fontWeight: "600",
    },
    buttonContainer: {
        marginTop: width * 0.01,
    },
    text: {
        fontSize: width * 0.02,
        color: "#000",
        paddingVertical: width * 0.005,
    },
    selectedText: {
        fontSize: width * 0.02,
        fontWeight: "600",
        color: "#4b8eff",
        paddingVertical: width * 0.005,
    },
});



export default LanguageSelector;