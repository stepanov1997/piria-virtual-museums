import {ScrollView, Text, View, Image, SafeAreaView} from "react-native";
import {StyleSheet} from "react-native";
import {Dimensions} from "react-native";
import {BLUE, DARKBLUE, GRAY} from '../../config.json'
import {Link} from "@react-navigation/native";
import {useTranslation} from "react-i18next";

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
            width: width > height ? width * 0.4 : height * 0.4,
            height: width > height ? width * 0.4 : height * 0.4
        },
        navigation: {
            flexDirection: "row",
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
export const HomeScreen = () => {
    const {t} = useTranslation('homeScreen')
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
                        <Link to={{screen: 'News'}} style={styles.navigationItem}>
                            {t("news")}
                        </Link>
                        <Link to={{screen: 'Museums'}} style={styles.navigationItem}>
                            {t('museums')}
                        </Link>
                        <Link to={{screen: 'Presentation'}} style={styles.navigationItem}>
                            {t('presentation')}
                        </Link>
                    </SafeAreaView>
                </View>
            </View>
        </ScrollView>
    );
}