import {
    OPENWEATHER_API,
    OPENWEATHER_API_KEY,
    OPENWEATHER_API_FORCAST_ENDPOINT
} from '../../config.json'

export const getForcastForCity= async (lat, lon, cnt) => {
    const response = await fetch(`${OPENWEATHER_API}/${OPENWEATHER_API_FORCAST_ENDPOINT}?lat=${lat}&lon=${lon}&cnt=${cnt}&appid=${OPENWEATHER_API_KEY}`)
    return await response.json();
}

export const getForcastForThreeCities = async (cities) => {
    return Promise.all(cities.map(
        async cityData => await getForcastForCity(cityData.lat, cityData.lon, 3)
    ))
}