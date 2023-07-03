import {View,Text, FlatList, Image} from 'react-native'
import {OPENWEATHER_ICON} from '../../config.json'
import { DateTime } from "luxon";

export const WeatherForcast = ({forcast}) => {
    return (
        <View>
            <Text>{forcast.city.name}</Text>
            <FlatList
                data={forcast.list}
                renderItem={({item})=> (
                    <View>
                        <Text style={{fontWeight: 'bold'}}>{item.weather.main}</Text>
                        <Image source={{uri: `${OPENWEATHER_ICON}/img/wn/${item.weather[0].icon}@2x.png`}} style={{width: 200, height: 150}}/>
                        <Text>{item.temp.min-273.15} - {item.temp.max-273.15}</Text>
                        <Text>{item.weather.description}</Text>
                        <Text>{DateTime.fromSeconds(item.dt).toFormat('dd.MM.yyyy HH:mm:ss')}</Text>
                    </View>
                )}
                keyExtractor={item => `${forcast.city.id}-${item.dt}`}
            ></FlatList>
        </View>
    )
}