import React, {useState} from 'react';
import {ScrollView, TextInput, Label, View, Button, Text} from 'react-native';
import {DatePickerInput} from 'react-native-paper-dates'
import RNPickerSelect from 'react-native-picker-select';
import {prepareJobToBuyTicket} from '../../api_clients/ticketClient';
import {VIRTUAL_MUSEUM_ACCOUNT_NUMBER} from '../../../config.json'
import {useSessionStorageJwt} from "../../util/jwtHook";

export const TicketPaymentForm = ({selectedVirtualVisit, amount, setBuyingTicketFormHide}) => {
    const [cardHolderFirstName, setCardHolderFirstName] = useState('');
    const [cardHolderSurname, setCardHolderSurname] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardType, setCardType] = useState('');
    const [pin, setPin] = useState('');
    const [monthExpiration, setMonthExpiration] = useState(1);
    const [yearExpiration, setYearExpiration] = useState(24);
    const [redMessage, setRedMessage] = useState("")
    const [greenMessage, setGreenMessage] = useState("")
    const [getJwt,] = useSessionStorageJwt()

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
        const jwt = await getJwt()
        try {
            await prepareJobToBuyTicket(
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
            <RNPickerSelect
                placeholder={{
                    label: 'Select Card Type...',
                    value: null,
                }}
                onValueChange={setCardType}
                items={[
                    {label: 'Visa', value: 'VISA'},
                    {label: 'Mastercard', value: 'MASTERCARD'},
                    {label: 'American Express', value: 'AMERICAN_EXPRESS'}
                ]}
            />
            <TextInput
                placeholder="MM"
                value={monthExpiration}
                onChangeText={setMonthExpiration}
                keyboardType="numeric"
            />
            <Text>/</Text>
            <TextInput
                placeholder="YY"
                value={yearExpiration}
                onChangeText={setYearExpiration}
                keyboardType="numeric"
            />
            <TextInput
                placeholder="PIN"
                value={pin}
                onChangeText={setPin}
                secureTextEntry
                keyboardType="numeric"
            />
            <Button title="Submit" onPress={handleSubmit}/>
            {greenMessage && <Text style={{color: 'green'}}>{greenMessage}</Text>}
            {redMessage && <Text style={{color: 'red'}}>{redMessage}</Text>}
        </ScrollView>

    );
};