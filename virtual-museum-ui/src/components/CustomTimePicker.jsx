import React from 'react';
import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {CustomPicker} from "./CustomPicker";
import {useTranslation} from "react-i18next";

const CustomTimePicker = ({ value, onChange }) => {
    const {t} = useTranslation('customTimePicker')

    const generateHourOptions = () => {
        const hourOptions = [];

        for (let i = 0; i <= 23; i++) {
            hourOptions.push({ label: i.toString(), value: i });
        }

        return hourOptions;
    };

    const generateMinuteOptions = () => {
        const minuteOptions = [];

        for (let i = 0; i <= 59; i++) {
            minuteOptions.push({ label: i.toString(), value: i });
        }

        return minuteOptions;
    };

    const valueChange = (index) => {
        return value => {
            onChange(prevValue => {
                prevValue[index] = value
                return prevValue
            })
        }
    }

    return (
        <View>
            <View>
                <Text>Hour:</Text>
                <CustomPicker
                    onValueChange={valueChange(0)}
                    items={generateHourOptions()}
                    labelMapper={item => item.label}
                    valueMapper={item => item.value}
                    placeholder={t('hourPickerPlaceholder')}
                    value={value[0]}
                />
            </View>
            <View>
                <Text>Minute:</Text>
                <CustomPicker
                    onValueChange={valueChange(1)}
                    items={generateMinuteOptions()}
                    labelMapper={item => item.label}
                    valueMapper={item => item.value}
                    placeholder={t('minutePickerPlaceholder')}
                    value={value[1]}
                />
            </View>
        </View>
    );
};

export default CustomTimePicker;
