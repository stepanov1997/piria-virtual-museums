import AsyncStorage from '@react-native-async-storage/async-storage';

export const useSessionStorageJwt = (key='JWT_TOKEN') => {
    const getJwt = async () => await AsyncStorage.getItem(key)
    const setJwt = async (token) => await AsyncStorage.setItem(key, token)
    const removeJwt = async () => await AsyncStorage.removeItem(key)

    return [getJwt, setJwt, removeJwt];
};