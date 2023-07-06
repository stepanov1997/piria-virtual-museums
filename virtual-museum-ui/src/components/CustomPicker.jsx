import {Platform, View} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import {Picker} from "react-native-web";


export const CustomPicker = ({placeholder, value, onValueChange, items, labelMapper, valueMapper}) => {
    return (
        <View>
            {
                ['ios', 'android'].includes(Platform.OS) ? (
                    <RNPickerSelect
                        value={value}
                        placeholder={{
                            label: placeholder,
                            value: "",
                        }}
                        onValueChange={onValueChange}
                        items={items.map((item) => (
                            {
                                label: labelMapper(item),
                                value: valueMapper(item)
                            }
                        ))}
                    />
                ) : (
                    <Picker
                        selectedValue={value}
                        onValueChange={onValueChange}
                    >
                        <Picker.Item label={placeholder} value=""/>
                        {items.map((item) => (
                            <Picker.Item
                                key={valueMapper(item)}
                                label={labelMapper(item)}
                                value={valueMapper(item)}
                            />
                        ))}
                    </Picker>
                )
            }
        </View>
    )
}