import {View, Text} from 'react-native'

export const VirtualVisitComponent = ({id, datetime, duration, price}) => {
    return (
       <Text key={`vv-${id}`}>Datetime: {datetime}, duration: {duration}, price: {price}€</Text>
    )
}
