import React, {useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginComponent from "./src/layout/login";
import {MuseumComponent} from "./src/components/museum";
import {AdminHomeFeed} from "./src/layout/admin/adminHomeFeed";

import { enableScreens } from 'react-native-screens';
const Stack = createNativeStackNavigator();

const App = () => {
    const {t} = useTranslation('app')

    enableScreens()
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={"Login"}>
                <Stack.Screen name={"Login"} options={{title: t("Login")}} component={LoginComponent}/>
                <Stack.Screen name={"Registration"} options={{title: t("Registration")}} component={RegistrationComponent}/>
                <Stack.Screen name={"MuseumsFeed"} options={{title: t("MuseumsFeed")}}
                              component={MuseumsFeedComponent}/>
                <Stack.Screen name={"AdminScreen"} options={{title: t("AdminScreen")}} component={AdminScreen}/>
                <Stack.Screen name={"Create Museum"} options={{title: t("CreateMuseumScreen")}}
                              component={CreateMuseumScreen}/>
                <Stack.Screen name={"Statistics"} options={{title: t("StatisticsScreen")}}
                              component={StatisticsScreen}/>
                <Stack.Screen name={"User Account"} options={{title: t("UserAccountScreen")}}
                              component={UserAccountScreen}/>
                <Stack.Screen name={"Home"} options={{title: t("Home")}} component={HomeScreen}/>
                <Stack.Screen name={"Presentation"} options={{title: t("Presentation")}}
                              component={PresentationScreen}/>
                <Stack.Screen name={"Create Presentation"} options={{title: t("CreatePresentation")}}
                              component={CreatePresentationScreen}/>
                <Stack.Screen name={"Museums"} options={{title: t("Museums")}} component={MuseumsScreen}/>
                <Stack.Screen name={"Museum"} options={{title: t("Museum")}} component={MuseumScreen}/>
                <Stack.Screen name={"News"} options={{title: t("News")}} component={NewsFeedScreen}/>
                <Stack.Screen name={"LanguageSelector"} options={{title: t("LanguageSelector")}}
                              component={LanguageSelector}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
