import {ScrollView, Text, View, Image, SafeAreaView} from "react-native";
import {StyleSheet} from "react-native";
import {Dimensions} from "react-native";
import {BLUE, DARKBLUE, GRAY} from '../../config.json'
const {width, height} = Dimensions.get("window");
import NewsPostsList from "../../src/components/news-posts";

export const NewsFeedScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <NewsPostsList/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
        container: {
            backgroundColor: "#f2f2f2",
            alignItems: "center",
            paddingTop: width * 0.02,
            flex: 1,
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
        }
    }
)
