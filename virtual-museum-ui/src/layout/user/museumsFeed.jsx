import {useEffect, useState} from "react";
import {Button, Text, TextInput, View, ScrollView, StyleSheet, Dimensions} from 'react-native'
import museumClient from '../../api_clients/museumClient'
import {useSessionStorageJwt} from "../../util/jwtHook";
import {BLUE, DARKBLUE, GRAY} from '../../../config.json'
import {Link} from '@react-navigation/native';

const {width, height} = Dimensions.get("window");

export const MuseumsFeedComponent = () => {
    const [museums, setMuseums] = useState([])
    const [searchKeyByName, setSearchKeyByName] = useState("")
    const [searchKeyByCity, setSearchKeyByCity] = useState("")
    const [getSession,] = useSessionStorageJwt()

    async function getAllMuseumsByName() {
        if (!searchKeyByName) {
            return;
        }
        const response = await museumClient.getAllMuseumsByName((await getSession()).jwt, searchKeyByName);
        if(response.status !== "200") {
            alert(response.message)
            return
        }
        const retrievedMuseums = response.content
        setMuseums(retrievedMuseums)
    }

    async function getAllMuseumsByCity() {
        if (!searchKeyByCity) {
            return;
        }
        const response = await museumClient.getAllMuseumsByCity((await getSession()).jwt, searchKeyByCity);
        if(response.status !== "200") {
            alert(response.message)
            return
        }
        const retrievedMuseums = response.content
        setMuseums(retrievedMuseums)
    }

    useEffect(() => {
        (async function () {
            if (searchKeyByName || searchKeyByCity) {
                return;
            }
            const response = await museumClient.getAllMuseums((await getSession()).jwt);
            if(response.status !== "200") {
                alert(response.message)
                return
            }
            const retrievedMuseums = response.content
            setMuseums(retrievedMuseums)
        })()
    }, [searchKeyByName, searchKeyByCity])



    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text>List of Museums</Text>
            <View>
                <TextInput placeholder="Search by name" value={searchKeyByName}
                           onChangeText={setSearchKeyByName}></TextInput>
                <Button onPress={getAllMuseumsByName} title={"Search by name"}/>
            </View>
            <View>
                <TextInput placeholder="Search by city" value={searchKeyByCity}
                           onChangeText={setSearchKeyByCity}></TextInput>
                <Button onPress={getAllMuseumsByCity} title={"Search by city"}/>
            </View>

            {museums ?
                (
                    <View>
                        {
                            museums.map((item) => (
                                <View key={item.id.toString()}>
                                    <Link to={{screen: 'Museum', params: {museum: item}}}>
                                        {item.name}
                                    </Link>
                                </View>
                            ))
                        }
                    </View>
                ) : (
                    <View>
                        <Text>No data</Text>
                    </View>
                )
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent:"center",
        alignItems:"center",
        gap:width>height ? width*0.04 : height*0.01,

    },
    content:{
        backgroundColor:GRAY,
        borderRadius:10,
        width:width>height?width*0.4:height*0.4,
        height:width>height?height:height*1.1,
        alignItems:"center",
        gap:width>height ? width*0.01 : height*0.02,
        padding:width>height ? height*0.12 : width*0.12,
        marginVertical:height*0.04,
    },

    image:{
        width:width>height?width*0.2:height*0.4,
        height:width>height? width*0.2:height*0.4,
    },
    title:{
        fontSize:width>height ? width*0.008:height*0.02,
        fontWeight:"bold"
    },
    text:{
        fontSize:width>height ? width*0.008:height*0.02
    }
});