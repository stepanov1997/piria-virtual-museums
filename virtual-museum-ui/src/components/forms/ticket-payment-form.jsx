import React, {useState} from 'react';
import {ScrollView, TextInput, Label, View, Button, Text, Platform} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {buyTicket} from '../../api_clients/ticketClient';
import {VIRTUAL_MUSEUM_ACCOUNT_NUMBER} from '../../../config.json'
import {useSessionStorageJwt} from "../../util/jwtHook";
import {Picker} from "react-native-web";

export const TicketPaymentForm = ({selectedVirtualVisit, amount, setBuyingTicketFormHide}) => {
    const [cardHolderFirstName, setCardHolderFirstName] = useState('');
    const [cardHolderSurname, setCardHolderSurname] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardType, setCardType] = useState('');
    const [pin, setPin] = useState('');
    const [monthExpiration, setMonthExpiration] = useState("1");
    const [yearExpiration, setYearExpiration] = useState("24");
    const [redMessage, setRedMessage] = useState("")
    const [greenMessage, setGreenMessage] = useState("")
    const [getSession,] = useSessionStorageJwt()

    const handleSubmit = async () => {
        const cardExpiration = `${monthExpiration.toString().padStart(2, '0')}/${yearExpiration.toString().padStart(2, '0')}`
        console.log({
            cardHolderFirstName,
            cardHolderSurname,
            cardNumber,
            cardType,
            cardExpiration,
            pin,
            receiverCardNumber: VIRTUAL_MUSEUM_ACCOUNT_NUMBER,
            amount
        });
        const {jwt} = await getSession()
        try {
            const response = await buyTicket(
                jwt, selectedVirtualVisit, cardHolderFirstName, cardHolderSurname, cardNumber,
                cardType, cardExpiration, pin, VIRTUAL_MUSEUM_ACCOUNT_NUMBER, amount
            );
            setGreenMessage("Successful payment.")
            setTimeout(() => {
                setBuyingTicketFormHide(true)
            }, 2000)
        } catch (e) {
            console.error(`Error - ${e}`)
            setRedMessage(`Error while paying. Error: ${e}`)
        }
    };

    return (
        <ScrollView>
            <TextInput
                placeholder="Card Holder First Name"
                value={cardHolderFirstName}
                onChangeText={setCardHolderFirstName}
            />
            <TextInput
                placeholder="Card Holder Surname"
                value={cardHolderSurname}
                onChangeText={setCardHolderSurname}
            />
            <TextInput
                placeholder="Card Number"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
            />
            <CustomPicker
                style={styles.input}
                items={[{label: 'Visa', value: 'VISA'},
                    {label: 'Mastercard', value: 'MASTERCARD'},
                    {label: 'American Express', value: 'AMERICAN_EXPRESS'}]}
                value={cardType}
                placeholder={t('cardTypePlaceholder')}
                onValueChange={setCardType}
                labelMapper={item => item.label}
                valueMapper={item => item.value}
            />
            <View style={styles.validUntil}>
                <TextInput
                    style={styles.num}
                    placeholder={t('expirationMonthPlaceholder')}
                    value={monthExpiration}
                    onChangeText={setMonthExpiration}
                    keyboardType="numeric"
                />
                <Text style={{  height: width > height ? height * 0.04 : width * 0.04,fontSize: width > height ? height * 0.02 : width * 0.04}}>/</Text>
                <TextInput
                    style={styles.num}
                    placeholder={t('expirationYearPlaceholder')}
                    value={yearExpiration}
                    onChangeText={setYearExpiration}
                    keyboardType="numeric"
                />
            </View>
            <TextInput
                placeholder="PIN"
                value={pin}
                onChangeText={setPin}
                secureTextEntry
                keyboardType="numeric"
            />
            <Button title={t('submitButtonTitle')} onPress={handleSubmit}/>
            {greenMessage && <Text style={{color: 'green'}}>{greenMessage}</Text>}
            {redMessage && <Text style={{color: 'red'}}>{redMessage}</Text>}
        </ScrollView>
    );
};