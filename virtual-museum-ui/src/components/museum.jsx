import {View, Text, Button} from 'react-native'
import {useEffect, useState} from "react";

export const MuseumComponent = ({route}) => {
    const [details, setDetails] = useState("")
    const {museum} = route.params

    useEffect(() => {
        (async function() {
            const gptDetails = await openMuseumDetails(museum.name, museum.country)
            setDetails(gptDetails)
        })()
    }, [museum])
    async function openMuseumDetails(museumName, museumCountry) {
        const apiKey = 'API_KEY';
        const apiUrl = 'https://api.openai.com/v1/chat/completions';

        const body = JSON.stringify({
            model: 'gpt-3.5-turbo',
            "messages": [{
                "role": "user",
                "content": `Give me details about museum ${museumName} from ${museumCountry}.`
            }],
        });

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: body,
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.log('An error occurred while calling the Chat GPT API:', error);
            return null;
        }
    }

    return (
        <View>
            <Text>{museum.name}</Text>
            <Text>{museum.address}</Text>
            <Text>{museum.phoneNumber}</Text>
            <Text>{museum.city}, {museum.country}</Text>
            <Text>({museum.latitude}, {museum.longitude})</Text>
            <Text>{museum.type}</Text>
            <Text>{details}</Text>
            <Button title={"Buy ticket"}/>
            <Button title={"Show virtual visits"}/>
            <br/>
            <View>
                <Text>TODO: Weather</Text>
            </View>
        </View>
    );
}