import {CHAT_GPT_API, CHAT_GPT_API_COMPLETIONS_ENDPOINT, CHAT_GPT_API_KEY} from '../../config.json'

export async function generateMuseumDetails(museumName, museumCountry, language) {
    const apiKey = `${CHAT_GPT_API_KEY}`;
    const apiUrl = `${CHAT_GPT_API}/${CHAT_GPT_API_COMPLETIONS_ENDPOINT}`;

    const body = JSON.stringify({
        model: 'gpt-3.5-turbo',
        "messages": [{
            "role": "user",
            "content": `Give me details about museum ${museumName} from ${museumCountry} on ${language} language.`
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

export async function getThreeRandomCities(country) {
    const apiKey = `${CHAT_GPT_API_KEY}`;
    const apiUrl = `${CHAT_GPT_API}/${CHAT_GPT_API_COMPLETIONS_ENDPOINT}`;

    const body = JSON.stringify({
        model: 'gpt-3.5-turbo',
        "messages": [{
            "role": "user",
            "content": `Give me three random cities from ${country} in JSON array format where is each element in this format { "city": "XXX", "lat": "XXX", "lon": "XXX" }.`
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
        const text = data.choices[0].message.content
        try {
            const parsed = JSON.parse(text)
            if(!parsed) {
                throw Error()
            }
            return parsed
        } catch (e) {
            try {
                const parsed = extractJSONFromText(text)
                if(!parsed) {
                    throw Error()
                }
                return parsed
            } catch (e) {
                return [
                    { city: "New York City", lat: "40.7128", lon: "-74.0060" },
                    { city: "Los Angeles", lat: "34.0522", lon: "-118.2437" },
                    { city: "Chicago", lat: "41.8781", lon: "-87.6298" }
                ]
            }
        }
    } catch (error) {
        console.log('An error occurred while calling the Chat GPT API:', error);
        return [];
    }
}

function extractJSONFromText(text) {
    const start = text.search(/[{\[]/);  // Find the index of the first occurrence of { or [
    const end = text.lastIndexOf(/[}\]]/);  // Find the index of the last occurrence of } or ]

    if (start === -1 || end === -1) {
        console.log("JSON data not found.");
        return null;
    }

    const jsonString = text.substring(start, end + 1);  // Extract the JSON string

    try {
        // Parse the JSON string into a JavaScript object
        return JSON.parse(jsonString);
    } catch (error) {
        console.log("Invalid JSON format.");
        return null;
    }
}