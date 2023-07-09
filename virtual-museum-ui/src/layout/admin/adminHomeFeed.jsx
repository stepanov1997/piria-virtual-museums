import {ScrollView, Text, View} from "react-native";
import {Chart} from "../../components/chart";
import React, {useEffect, useState} from "react";
import userClient from '../../api_clients/userClient'
import {UserAdministration} from "./userAdministration";
import {MuseumAdministration} from './museumAdministration'
import {VirtualVisitForm} from "../../components/virtual-visit-form";

export const AdminHomeFeed = () => {
    const {t} = useTranslation('adminHomeFeed')

    const [activeUsersByHour, setActiveUsersByHour] = useState([])
    const [currentlyActiveUsers, setCurrentlyActiveUsers] = useState([])
    const [registeredUsers, setRegisteredUsers] = useState([])

    useEffect(() => {
        (async function() {
            setActiveUsersByHour(await userClient.getActiveUsersByHour())
            setCurrentlyActiveUsers(await userClient.getCurrentlyActiveUsers())
            setRegisteredUsers(await userClient.getRegisteredUsers())
        })()
    }, [])

    return (
        <ScrollView>
            <Text>Number of registered users: {registeredUsers.length}</Text>
            <Text>Currently active users: {currentlyActiveUsers}</Text>
            {activeUsersByHour.length>0 ? <Chart data={activeUsersByHour} /> : <Text/>}
            <View>
                <UserAdministration registeredUsers={registeredUsers}/>
                <MuseumAdministration/>
                <VirtualVisitForm/>
            </View>
        </ScrollView>
    );
}