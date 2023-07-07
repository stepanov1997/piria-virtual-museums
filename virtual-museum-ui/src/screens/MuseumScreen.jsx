import {ScrollView, Text, View, Image} from "react-native";
import {StyleSheet} from "react-native";
import {Dimensions} from "react-native";
import {BLUE, DARKBLUE, GRAY} from '../../config.json'
import {Link} from "@react-navigation/native";
import {MuseumsFeedComponent} from "../layout/user/museumsFeed";
import {MuseumComponent} from "../components/museum";

const {width, height} = Dimensions.get("window");

const styles = StyleSheet.create({
        container: {
            backgroundColor: "#fff",
            alignItems: "center",
            paddingTop: width * 0.02,
            flex: 1
        },
        content: {
            backgroundColor: "#fff",
            width: width > height ? width * 0.3 : width * 0.9,
            height: width > height ? height * 0.5 : height * 0.5,
            borderRadius: 10,
            flex: true,
            alignItems: "center",
            gap: width > height ? width * 0.04 : height * 0.09,
            paddingVertical: height * 0.01
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
            gap: width > height ? width * 0.01 : height * 0.01
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
export const MuseumScreen = ({route}) => {
    console.log(route)
    return (
        <View style={styles.container}>
            <MuseumComponent museum={route.params.museum}/>
        </View>
    );
}