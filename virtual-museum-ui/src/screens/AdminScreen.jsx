import {ScrollView, Text, View, Image, SafeAreaView, Pressable, Linking} from "react-native";
import {StyleSheet} from "react-native";
import {Dimensions} from "react-native";
import {BLUE, DARKBLUE, GRAY, SERVER_URL, LOGS_API_ENDPOINT} from '../../config.json'
import {Link} from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import {useSessionStorageJwt} from "../util/jwtHook";

const {width, height} = Dimensions.get("window");

const styles = StyleSheet.create({
        container: {
            backgroundColor: "#f2f2f2",
            alignItems: "center",
            paddingTop: width * 0.02,
            width: width,
            height: height,
            marginBottom: height * 0.04,
        },
        content: {
            borderRadius: 10,
            flex: true,
            alignItems: "center",
            gap: width > height ? width * 0.04 : height * 0.09,
            paddingVertical: height * 0.04,
        },
        welcome: {
            textAlign: "center",
            color: BLUE,
            fontSize: width > height ? width * 0.02 : height * 0.03

        },
        intro: {
            backgroundColor: GRAY,
            width: width > height ? width * 0.4 : height * 0.4,
            padding: width > height ? width * 0.01 : height * 0.01,
            borderRadius: 10,
            flex: true,
            justifyContent: "center",
            alignItems: "center",
            gap: width > height ? width * 0.01 : height * 0.01,

        },
        introText: {
            fontSize: width > height ? width * 0.01 : height * 0.02,
            color: BLUE,
        },
        image: {
            width: width > height ? width * 0.5 : height * 0.5,
            height: width > height ? width * 0.5 : height * 0.5
        },
        navigation: {
            flexDirection: "row",
            flexWrap: 'wrap',
            width: "100%",
            justifyContent: "space-between",
            paddingBottom: width > height ? width * 0.01 : height * 0.01,

        },
        navigationItem: {
            color: "#fff",
            textDecorationLine: "underline",
            fontWeight: "bold",
            fontSize: width > height ? width * 0.01 : height * 0.02,
        }
    }
)
export const AdminScreen = () => {
    const {t} = useTranslation(['homeScreen'])
    const [getSession,,] = useSessionStorageJwt()

    const saveFile = async () => {
        try {
            const jwtToken = (await getSession()).jwt
            const fileUri = `${SERVER_URL}/${LOGS_API_ENDPOINT}?token=${jwtToken}`;
            await Linking.openURL(fileUri)
        } catch (error) {
            console.error('Error saving file:', error);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.content}>
                <Text style={styles.welcome}>{t('welcome')}</Text>
                <Image source={require('../../assets/museum.jpg')}
                       style={styles.image}></Image>
                <View style={styles.intro}>
                    <Text style={styles.introText}>{t('introText')}</Text>
                    <Text style={styles.introText}>{t('introTextShorter')}</Text>
                    <SafeAreaView style={styles.navigation}>
                        <Link to={{screen: 'Statistics'}} style={styles.navigationItem}>
                            {t("statistics")}
                        </Link>
                        <Link to={{screen: 'Create Museum'}} style={styles.navigationItem}>
                            {t('createMuseum')}
                        </Link>
                        <Link to={{screen: 'User Account'}} style={styles.navigationItem}>
                            {t('userAccount')}
                        </Link>
                        <Link to={{screen: 'Create Presentation'}} style={styles.navigationItem}>
                            {t('createPresentation')}
                        </Link>
                        <Link to={{screen: 'LanguageSelector', arguments: {global: true}}}
                              style={styles.navigationItem}>
                            {t('languageSelector')}
                        </Link>
                        <Pressable onPress={saveFile}>
                            <Text style={styles.navigationItem}>
                                {t('downloadLogsText')}
                            </Text>
                        </Pressable>
                    </SafeAreaView>
                </View>
            </View>
        </ScrollView>
    );
}