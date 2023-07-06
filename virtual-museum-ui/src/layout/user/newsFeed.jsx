import {Text, View, ScrollView, StyleSheet} from 'react-native'
import NewsPostsList from "../../components/news-posts";
import {BLUE,DARKBLUE,GRAY} from '../../config.json'
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        backgroundColor: "#fff",
        flex: true,
        justifyContent: "center",
        alignItems: "center"
    },
    title:{
        textAlign:"center",
        color:BLUE,
        fontSize:width>height ? width*0.02:height*0.03,
        paddingBottom:width>height ? width*0.01:height*0.03

    },
});

export const NewsFeedComponent = () => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>News feed</Text>
            <NewsPostsList/>
        </ScrollView>
    )
}