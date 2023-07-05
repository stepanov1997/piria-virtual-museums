import {Text, View} from "react-native";
import {Chart} from "../components/chart";
import {useEffect, useState} from "react";
import userClient from '../api_clients/userClient'

export const AdminHomeFeed = () => {
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Number of registered users: {registeredUsers.length}</Text>
            <Text>Currently active users: {currentlyActiveUsers}</Text>
            {activeUsersByHour.length>0 && (<Chart data={activeUsersByHour} />)}
        </View>
    );
}