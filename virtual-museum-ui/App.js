import React from 'react';
import {MuseumsFeedComponent} from "./src/layout/museumsFeed";

import RegistrationComponent from "./src/layout/registration";

import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginComponent from "./src/layout/login";
import {MuseumComponent} from "./src/components/museum";

const Stack = createNativeStackNavigator();

const App = () => {

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={"Login"} component={LoginComponent}/>
                <Stack.Screen name={"Registration"} component={RegistrationComponent}/>
                <Stack.Screen name={"Museums feed"} component={MuseumsFeedComponent}/>
                <Stack.Screen name={"Museum"} component={MuseumComponent}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
