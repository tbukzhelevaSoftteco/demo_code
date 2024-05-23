import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Device } from '@src/types/ble'

import styles from './styles';

type Props = {
  device: Device
}

const DeviceHeader = ({device}: Props) => {
  const {colors} = useTheme();
  const textStyle = [styles.textStyle, {color: colors.text}];

  return (
    <View style={styles.mainContainerStyle}>
      {device.name && <Text style={textStyle}>{device.name}</Text>}
      <Text style={textStyle}>{device.id}</Text>
    </View>
  );
};

export default DeviceHeader;
