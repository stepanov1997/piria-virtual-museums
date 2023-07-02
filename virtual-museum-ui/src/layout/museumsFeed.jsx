import {useEffect, useState} from "react";
import {Button, FlatList, Text, TextInput, View, ScrollView} from 'react-native'
import museumClient from '../api_clients/museumClient'
import {useSessionStorageJwt} from "../util/jwtHook";
import {Link} from '@react-navigation/native';

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
                        <FlatList
                            data={museums}
                            renderItem={({item}) =>
                                (
                                    <View>
                                        <Link to={{screen: 'Museum', params: {museum: item}}}>
                                            {item.name}
                                        </Link>
                                    </View>
                                )}
                            keyExtractor={museum => museum.id.toString()}
                        />
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