import {View, Text} from "react-native";
import {WatchPresentationForm} from "../components/watch-presentation-form";

export const PresentationScreen = () => {
    return (
        <View style={styles.container}>
            <WatchPresentationForm/>
        </View>
    )
}