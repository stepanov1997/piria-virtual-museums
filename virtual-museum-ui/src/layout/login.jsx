import {useEffect, useState} from "react";
import {Button, Text, TextInput, View} from 'react-native'
import userClient from "../api_clients/userClient";
import {useSessionStorageJwt} from "../util/jwtHook";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import {BLUE,DARKBLUE,GRAY} from '../../config.json'
import {he} from "react-native-paper-dates";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        width:width,
        height:height,
        backgroundColor:"#fff",
        flex:true,
        justifyContent:"center",
        alignItems:"center"
    },
    content:{
        backgroundColor:GRAY,
        width:width>height ? width*0.3: width*0.9,
        height:width>height ? height*0.5 : height*0.5,
        borderRadius:10,
        flex:true,
        alignItems:"center",
        gap:width>height ? width*0.04 : height*0.09,
        paddingVertical:height*0.01
    },
    welcome: {
        textAlign: "center",
        color: BLUE,
        fontSize: width > height ? width * 0.02 : height * 0.03

    },
    inputs: {
        gap: height * 0.01,
    },
    input: {
        backgroundColor: "#fff",
        width: width > height ? width * 0.15 : height * 0.3,
        height: width > height ? height * 0.04 : width * 0.1,
        paddingLeft: height * 0.01,
        color: BLUE,
        fontSize: width > height ? height * 0.02 : width * 0.04,
        borderColor: "transparent"
    },
    button: {
        backgroundColor: DARKBLUE
    },
    buttons: {
        gap: height * 0.01
    },

});
const LoginComponent = ({navigation, route}) => {
    const {t} = useTranslation('login')

    const u = route.params?.username;

    const [username, setUsername] = useState(u ?? "");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [getSession, setSession, removeSession] = useSessionStorageJwt()
    const [showLogin, setShowLogin] = useState(false)

    useEffect(() => {
        (async function () {
            try {
                await removeSession()
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
            setErrorMessage(t('loginErrorMessage'))
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
        <View style={styles.container}>
            {showLogin && (<View style={styles.content}>
                    <Text style={styles.welcome}>{t('welcomeMessage')}</Text>
                    <View style={styles.inputs}>
                        <TextInput style={styles.input} placeholder={t('usernameInputPlaceholder')} value={username}
                                   onChangeText={setUsername}/>
                        <TextInput style={styles.input} placeholder={t('passwordInputPlaceholder')} value={password}
                                   onChangeText={setPassword}
                                   secureTextEntry={true}/>
                    </View>
                    <View style={styles.buttons}>
                        <Button style={styles.button} title={t('loginButtonTitle')} onPress={login}/>
                        <View>
                            <Text>{t('dontHaveAccountQuestion')}</Text>
                            <Button title={t('registerButtonTitle')} onPress={() => navigation.push('Registration')}/>
                            {errorMessage && (<Text style={{color: 'red'}}>{errorMessage}</Text>)}
                        </View>
                        <LanguageSelector/>
                    </View>
                </View>
            )}
        </View>
    )
}

export default LoginComponent