import {useEffect, useState} from "react";
import {Button, Text, TextInput, View} from 'react-native'
import userClient from "../api_clients/userClient";
import {useSessionStorageJwt} from "../util/jwtHook";
import { BackHandler } from 'react-native';
import {tr} from "react-native-paper-dates";

const LoginComponent = ({navigation, route}) => {
    const u = route.params?.username;

    const [username, setUsername] = useState(u ?? "");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [getSession, setSession, removeSession] = useSessionStorageJwt()
    const [showLogin, setShowLogin] = useState(false)

    useEffect(() => {
        (async function () {
            try {
                const {jwt, userType} = await getSession()
                if (jwt) {
                    navigateFromLoginPage(navigation, userType)
                } else {
                    setShowLogin(true)
                }
            } catch (e) {
                setShowLogin(true)
            }
        })()
    }, [])

    function navigateFromLoginPage(navigation, userType) {
        switch (userType) {
            case "USER":
                navigation.navigate('MuseumsFeed')
                break;
            case "ADMIN":
                navigation.navigate('AdminHomePage')
                break;
        }
    }

    async function login() {
        if (!username || !password) {
            setErrorMessage("Username or password must have value.")
            return;
        }
        try {
            const {token, userType} = await userClient.authenticate(username, password)
            if (token && userType) {
                setErrorMessage("")
                await setSession({jwt: token, userType})
                navigateFromLoginPage(navigation, userType)
            }
        } catch (e) {
            setErrorMessage(e)
        }
    }

    return (
        <View>
            {showLogin && (<View>
                    <Text>Welcome!</Text>
                    <TextInput placeholder="Username" value={username} onChangeText={setUsername}/>
                    <TextInput placeholder="Password" value={password} onChangeText={setPassword}
                               secureTextEntry={true}/>
                    <Button title="Log in" onPress={login}/>
                    <Button title="Register" onPress={() => navigation.push('Registration')}/>
                    {errorMessage && (<Text style={{color: 'red'}}>{errorMessage}</Text>)}
                </View>
            )}
        </View>
    )
}

export default LoginComponent