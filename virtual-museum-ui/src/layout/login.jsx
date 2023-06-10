import {useState} from "react";
import {View, Text, TextInput, Button} from 'react-native'
import userClient from "../api_clients/userClient";
import {useSessionStorageJwt} from "../util/jwtHook";

const LoginComponent = ({navigation, route}) => {
    const u = route.params?.username;

    const [username, setUsername] = useState(u ?? "");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [, setJwt] = useSessionStorageJwt()

    async function login() {
        if (!username || !password) {
            setErrorMessage("Username or password must have value.")
            return;
        }
        let token = undefined
        try {
            const token_wrapper = await userClient.authenticate(username, password);
            token = token_wrapper.token
        } catch (e) {
            setErrorMessage(e)
        }
        if(token) {
            setErrorMessage("")
            setJwt(token)
            navigation.push('Museums feed')
        }
    }

    return (
        <View>
            <Text>Welcome!</Text>
            <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true} />
            <Button title="Log in" onPress={login}/>
            <Button title="Register" onPress={() => navigation.push('Registration')}/>
            { errorMessage && (<Text style={{color: 'red'}}>{errorMessage}</Text>) }
        </View>
    )
}

export default LoginComponent