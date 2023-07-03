import {View,Text, Image} from 'react-native'
import {OPENWEATHER_ICON} from '../../config.json'
import { DateTime } from "luxon";

export const WeatherForcast = ({forcast}) => {
    return (
        <View>
            <Text>{forcast.city.name}</Text>
            {
                forcast.list.map((item, index) => (
                    <View key={`${forcast.city.id}-${item.dt}`}>
                        <Text style={{fontWeight: 'bold'}}>{item.weather.main}</Text>
                        <Image source={{uri: `${OPENWEATHER_ICON}/img/wn/${item.weather[0].icon}@2x.png`}} style={{width: 200, height: 150}}/>
                        <Text>{item.temp.min-273.15} - {item.temp.max-273.15}</Text>
                        <Text>{item.weather.description}</Text>
                        <Text>{DateTime.fromSeconds(item.dt).toFormat('dd.MM.yyyy HH:mm:ss')}</Text>
                    </View>
                ))
            }
        </View>
    )
}