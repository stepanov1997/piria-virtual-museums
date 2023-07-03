import {useEffect, useState} from "react";
import {Button, Text, TextInput, View, ScrollView} from 'react-native'
import museumClient from '../api_clients/museumClient'
import {useSessionStorageJwt} from "../util/jwtHook";
import {Link} from '@react-navigation/native';
import NewsPostsList from "../components/news-posts";

export const MuseumsFeedComponent = () => {
    const [museums, setMuseums] = useState([])
    const [searchKeyByName, setSearchKeyByName] = useState("")
    const [searchKeyByCity, setSearchKeyByCity] = useState("")
    const [getJwt,] = useSessionStorageJwt()

    async function getAllMuseumsByName() {
        if (!searchKeyByName) {
            return;
        }
        const retrievedMuseums = await museumClient.getAllMuseumsByName(await getJwt(), searchKeyByName);
        setMuseums(retrievedMuseums)
    }

    async function getAllMuseumsByCity() {
        if (!searchKeyByCity) {
            return;
        }
        const retrievedMuseums = await museumClient.getAllMuseumsByCity(await getJwt(), searchKeyByCity);
        setMuseums(retrievedMuseums)
    }

    useEffect(() => {
        (async function () {
            if (searchKeyByName || searchKeyByCity) {
                return;
            }
            const retrievedMuseums = await museumClient.getAllMuseums(await getJwt());
            setMuseums(retrievedMuseums)
        })()
    }, [searchKeyByName, searchKeyByCity])

    return (
        <ScrollView>

            <Text>News feed</Text>
            <NewsPostsList/>
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
                    // <Text>{museums[0]?.name}</Text>
                    <View>
                        {
                            museums.map((item, index) => (
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