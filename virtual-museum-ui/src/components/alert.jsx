import {Text} from "react-native"

export const Alert=({message,style})=>{
    return(
        <Text style={style}>{message}</Text>
    );
}