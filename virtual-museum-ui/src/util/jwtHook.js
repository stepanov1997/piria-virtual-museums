import AsyncStorage from "@react-native-async-storage/async-storage";

export const useSessionStorageJwt = (key='JWT_TOKEN') => {
    const getSession = async () => JSON.parse(await AsyncStorage.getItem(key))
    const setSession = async (session) => await AsyncStorage.setItem(key, JSON.stringify(session))
    const removeSession = async () => await AsyncStorage.removeItem(key)

    return [getSession, setSession, removeSession];
};