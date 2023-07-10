import {useState} from 'react'
import {View, TextInput, Text, Button} from 'react-native'
import userClient from "../api_clients/userClient";

const RegistrationComponent = ({navigation}) => {
    const {t} = useTranslation(['registration', 'app'])

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
    const [email, setEmail] = useState("");
    const [alertStyle, setAlertStyle] = useState({});
    const [message, setMessage] = useState("");

    const handleRegistration = async () => {
        let msg = "";

        if (!firstName) {
            msg += t('firstNameErrorMessage');
        }
        if (!lastName) {
            msg += `\n${t('lastNameErrorMessage')}`;
        }
        if (!username) {
            msg += `\n${t('usernameErrorMessage')}`;
        } else if (username.length < 12 || /[@#\/]/.test(username)) {
            msg += `\n${t('usernameValidationMessage')}`;
        }

        if (!password) {
            msg += `\n${t('passwordErrorMessage')}`;
        } else if (
            password.length < 15 ||
            !/[a-z]/.test(password) ||
            !/[A-Z]/.test(password) ||
            !/\d/.test(password)
        ) {
            msg += `\n${t('passwordValidationMessage')}`;
        }

        if (!newPasswordConfirmation || password !== newPasswordConfirmation) {
            msg += `\n${t('passwordConfirmationMessage')}`;
        }

        if (!email) {
            msg += `\n${t('emailErrorMessage')}`;
        }

        if (msg) {
            setAlertStyle(styles.error);
            setMessage(msg);
            return;
        }

        let response = undefined;
        try {
            response = await userClient.register(
                firstName,
                lastName,
                username,
                password,
                email
            );
        } catch (e) {
            setAlertStyle(styles.error);
            setMessage(e);
            return;
        }

        if (response.status === "201") {
            setAlertStyle(styles.success);
            setMessage(t('successMessage'))
            setTimeout(() => location.reload(), 2000);
        } else {
            setAlertStyle(styles.error);
            setMessage(response.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.inputs}>
                    <Text style={styles.enter}>{t('registrationTitle')}!</Text>
                    <TextInput style={styles.input} placeholder={t('firstNamePlaceholder')} value={firstName}
                               onChangeText={setFirstName}/>
                    <TextInput style={styles.input} placeholder={t('lastNamePlaceholder')} value={lastName}
                               onChangeText={setLastName}/>
                    <TextInput style={styles.input} placeholder={t('usernamePlaceholder')} value={username}
                               onChangeText={setUsername}/>
                    <TextInput style={styles.input} placeholder={t('passwordPlaceholder')} value={password}
                               onChangeText={setPassword} secureTextEntry={true}/>
                    <TextInput style={styles.input} placeholder={t('passwordAgainPlaceholder')}
                               value={newPasswordConfirmation} onChangeText={setNewPasswordConfirmation}
                               secureTextEntry={true}/>
                    <TextInput style={styles.input} placeholder={t('emailPlaceholder')} value={email}
                               onChangeText={setEmail} inputMode={'email'}/>
                </View>
                <Button title={t('registerButtonTitle')} onPress={handleRegistration}/>
                <Text>{errorMessage ? errorMessage : ""}</Text>
            </View>
        </View>
    )
}


export default RegistrationComponent