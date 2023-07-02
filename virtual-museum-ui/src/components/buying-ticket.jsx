import React, { useEffect, useState, useRef } from 'react';
import { View, Animated } from 'react-native';
import EventSource from 'react-native-event-source';
import {SERVER_URL, TICKET_API_POST_ENDPOINT} from 'config.json'

const AnimatedBuyingTicketComponent = () => {
    const [events, setEvents] = useState([]);
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const eventSource = new EventSource(`${SERVER_URL}/${TICKET_API_POST_ENDPOINT}`);

        eventSource.addEventListener('message', event => {
            const eventData = JSON.parse(event.data);
            setEvents(prevEvents => [...prevEvents, eventData]);

            // Pokreni animaciju
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        });

        eventSource.addEventListener('error', error => {
            console.error('Error occurred:', error);
        });

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <View>
            {events.map((event, index) => (
                <Animated.Text
                    key={index}
                    style={[
                        {
                            opacity: animatedValue,
                            transform: [
                                {
                                    translateY: animatedValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [10, 0],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    {event}
                </Animated.Text>
            ))}
        </View>
    );
};
