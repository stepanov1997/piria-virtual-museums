import {ScrollView, View, StyleSheet, Dimensions} from "react-native";

import {MuseumAdministration} from "../layout/admin/museumAdministration";
import React from "react";

const {width, height} = Dimensions.get("window");

export const CreateMuseumScreen = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.contentBlue}>
                <MuseumAdministration/>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        backgroundColor: "#f2f2f2",
        alignItems: "center",
        flexDirection: "column",
        gap: width > height ? width * 0.10 : height * 0.01,
        marginVertical: width > height ? width * 0.06 : height * 0.08,
    },
    contentBlue: {
        width: width > height ? width * 0.3 : height * 0.4,
        height: width > height ? width * 0.3 : height * 0.4,
        alignItems: "center",
        paddingVertical: height * 0.05,
        backgroundColor: "#fff",
        flexDirection: "column",
        borderRadius: 10,
    },
    label: {
        textAlign: "center",
        color: "#fff",
        fontSize: width > height ? height * 0.03 : width * 0.05

    }
});
