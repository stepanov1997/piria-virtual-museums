import {ScrollView, Text, View, Image} from "react-native";
import {StyleSheet} from "react-native";
import {Dimensions} from "react-native";
import {BLUE, DARKBLUE, GRAY} from '../../config.json'
import {Link} from "@react-navigation/native";
import {MuseumsFeedComponent} from "../layout/user/museumsFeed";

const {width, height} = Dimensions.get("window");

export const MuseumsScreen = () => {
    return (
        <View style={styles.container}>
            <MuseumsFeedComponent/>
        </View>
    );
}

const styles = StyleSheet.create({
        container: {
            alignItems: "center",
            paddingTop: width * 0.02,
            width: width,
            backgroundColor: BLUE,

        },
    }
)
