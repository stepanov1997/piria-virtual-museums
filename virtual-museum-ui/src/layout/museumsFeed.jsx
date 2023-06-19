import {useEffect, useState} from "react";
import {FlatList, View, Text, TextInput, Button} from 'react-native'
import museumClient from '../api_clients/museumClient'
import {useSessionStorageJwt} from "../util/jwtHook";
import { Link } from '@react-navigation/native';

export const MuseumsFeedComponent = () => {
    const [museums, setMuseums] = useState([])
    const [searchKeyByName, setSearchKeyByName] = useState("")
    const [searchKeyByCity, setSearchKeyByCity] = useState("")
    const [getJwt,] = useSessionStorageJwt()

    async function getAllMuseumsByName() {
        if (!searchKeyByName) {
            return;
        }
        const retrievedMuseums = await museumClient.getAllMuseumsByName(getJwt(), searchKeyByName);
        setMuseums(retrievedMuseums)
    }

    async function getAllMuseumsByCity() {
        if (!searchKeyByCity) {
            return;
        }
        const retrievedMuseums = await museumClient.getAllMuseumsByCity(getJwt(), searchKeyByCity);
        setMuseums(retrievedMuseums)
    }
    useEffect(() => {
        (async function () {
            if(searchKeyByName || searchKeyByCity) {
                return;
            }
            const retrievedMuseums = await museumClient.getAllMuseums(getJwt());
            setMuseums(retrievedMuseums)
        })()
    }, [searchKeyByName, searchKeyByCity])

    async function openMuseumDetails(id) {
        return Promise.resolve(undefined);
    }

    return (
        <View>
            <h1>List of Museums</h1>
            <View>
                <TextInput placeholder="Search by name" value={searchKeyByName} onChangeText={setSearchKeyByName}></TextInput>
                <Button onPress={getAllMuseumsByName} title={"Search by name"}/>
            </View>
            <View>
                <TextInput placeholder="Search by city" value={searchKeyByCity} onChangeText={setSearchKeyByCity}></TextInput>
                <Button onPress={getAllMuseumsByCity} title={"Search by city"}/>
            </View>


            { museums ?
                (
                    // <Text>{museums[0]?.name}</Text>
                    <View>
                        <FlatList
                            data={museums}
                            renderItem={({item}) => (
                                <View>
                                    <Link to={{ screen: 'Museum', params: { museum: item } }}>
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

        </View>
    )
}