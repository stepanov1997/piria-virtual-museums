import React, {useState} from 'react';
import {View, TextInput, Button} from 'react-native';
import {DatePickerInput} from 'react-native-paper-dates'
import RNPickerSelect from 'react-native-picker-select';
import {VIRTUAL_MUSEUM_ACCOUNT_NUMBER} from '../../../config.json'

export const TicketPaymentForm = ({amount}) => {
    const [cardHolderFirstName, setCardHolderFirstName] = useState('');
    const [cardHolderSurname, setCardHolderSurname] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardType, setCardType] = useState('');
    const [cardExpiration, setCardExpiration] = useState('');
    const [pin, setPin] = useState('');
    const [date, setDate] = useState(new Date())

    const handleSubmit = () => {
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
    };

    return (
        <View>
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
            <DatePickerInput value={date}
                             onChange={setDate}
                             locale='en'
                             inputMode="start"
            />
            <TextInput
                placeholder="PIN"
                value={pin}
                onChangeText={setPin}
                secureTextEntry
                keyboardType="numeric"
            />
            <Button title="Submit" onPress={handleSubmit}/>
        </View>
    );
};