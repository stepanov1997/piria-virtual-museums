import {View, Text, Button} from 'react-native'

export const MuseumComponent = ({route}) => {
    const {museum} = route.params
    return (
        <View>
            <Text>{museum.name}</Text>
            <Text>{museum.address}</Text>
            <Text>{museum.phoneNumber}</Text>
            <Text>{museum.city}, {museum.country}</Text>
            <Text>({museum.latitude}, {museum.longitude})</Text>
            <Text>{museum.type}</Text>
            <Button title={"Buy ticket"}/>
            <Button title={"Show virtual visits"}/>
            <br/>
            <View>
                <Text>TODO: Weather</Text>
            </View>
        </View>
    );
}