import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginComponent from "./src/layout/login";
import {MuseumComponent} from "./src/components/museum";
import {AdminHomeFeed} from "./src/layout/admin/adminHomeFeed";

import { enableScreens } from 'react-native-screens';
const Stack = createNativeStackNavigator();
const App = () => {
    enableScreens()
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={"Login"} component={LoginComponent}/>
                <Stack.Screen name={"Registration"} component={RegistrationComponent}/>
                <Stack.Screen name={"MuseumsFeed"} component={MuseumsFeedComponent}/>
                <Stack.Screen name={"Museum"} component={MuseumComponent}/>
                <Stack.Screen name={"AdminHomePage"} component={AdminHomeFeed}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
