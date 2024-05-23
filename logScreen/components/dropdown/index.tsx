import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View } from 'react-native';

import CustomButton from '@components/CustomButton';
import { 
  NOTE,
  TEMPERATURE,
  HUMIDITY
} from '@constants/measurements'

import i18n from '@i18n/index';
import { styles } from './styles'

type Props = {
    handleAdd: (item: string) => void,
}

const Dropdown = ({ handleAdd }: Props) => {
    const [selectedItem, setSelectedItem] = useState(TEMPERATURE);

    const pressAddButton = () =>{
        handleAdd(selectedItem)
    }
  
    return (
        <View style={styles.centeredView}>
            <Picker
                style={styles.picker}
                selectedValue={selectedItem}
                onValueChange={(itemValue) => {
                    setSelectedItem(itemValue)
                }}
            >
                <Picker.Item label={TEMPERATURE} value={TEMPERATURE} />
                <Picker.Item label={NOTE} value={NOTE} />
                <Picker.Item label={HUMIDITY }value={HUMIDITY} />
            </Picker>
            <CustomButton 
                styles={styles.button}
                onPress={pressAddButton}
                title={i18n.t('buttons.add')}
            />
        </View>
    );
};

export default Dropdown;
