export const useSessionStorageJwt = (key='JWT_TOKEN') => {
    const getJwt = () => sessionStorage.getItem(key)
    const setJwt = (token) => sessionStorage.setItem(key, token)

    return [getJwt, setJwt];
};