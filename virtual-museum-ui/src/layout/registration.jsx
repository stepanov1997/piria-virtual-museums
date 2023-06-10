import {useState} from 'react'
import {View, TextInput, Text, Button} from 'react-native'
import userClient from "../api_clients/userClient";

const RegistrationComponent = ({navigation}) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
    const [email, setEmail] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const handleRegistration = async () => {
        let msg = ""
        if(!firstName) {
            msg += "First name must have value."
        }
        if(!lastName) {
            msg += "\nLast name must have value."
        }
        if(!username) {
            msg += "\nUsername must have value."
        }
        if(!password) {
            msg += "\nPassword must have value."
        }
        if(!newPasswordConfirmation && password === newPasswordConfirmation) {
            msg += "\nConfirmation of password should be valid."
        }

        if (!email) {
            msg += "\nEmail must have value."
        }

        if(msg) {
            setErrorMessage(msg)
            return;
        }

        let body = undefined;
        try {
            body = (await userClient.register(firstName, lastName, username, password, email)).body;
        } catch (e) {
            setErrorMessage(e)
            return
        }
        if(body.status==="201") {
            setErrorMessage("")
            navigation.push('Login', {username: username})
        } else {
            setErrorMessage(body.error)
        }
    }

    return (
        <View>
            <Text>Input data for registration!</Text>
            <TextInput placeholder="Name" value={firstName} onChangeText={setFirstName} />
            <TextInput placeholder="Surname" value={lastName} onChangeText={setLastName} />
            <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true} />
            <TextInput placeholder="Type password again" value={newPasswordConfirmation} onChangeText={setNewPasswordConfirmation} secureTextEntry={true} />
            <TextInput placeholder="E-mail address" value={email} onChangeText={setEmail} />
            <Button title="Register" onPress={handleRegistration} />
            {errorMessage && <Text>{errorMessage}</Text> }
        </View>
    )
}

export default RegistrationComponent