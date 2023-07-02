import {CHAT_GPT_API,
        CHAT_GPT_API_COMPLETIONS_ENDPOINT,
        CHAT_GPT_API_KEY} from '../../config.json'

export async function generateMuseumDetails(museumName, museumCountry) {
    const apiKey = `${CHAT_GPT_API_KEY}`;
    const apiUrl = `${CHAT_GPT_API}/${CHAT_GPT_API_COMPLETIONS_ENDPOINT}`;

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