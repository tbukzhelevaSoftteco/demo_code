import React, { 
  useEffect, 
  useState, 
  ReactNode, 
  FC, 
  useCallback 
} from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { Characteristic } from 'react-native-ble-plx';

import i18n from '@i18n/index';
import Progress from '@components/Progress';
import useBluetooth from '@hooks/useBluetooth';
import useBluetoothConnected from '@hooks/useBluetoothConnected';
import { CharacteristicContext } from '@hooks/useCharacteristic';
import { COLORS } from "@constants/colors";
import { 
  BLUETOOTH_CHARACTERISTIC_UUID_VALUE, 
  BLUETOOTH_SERVICE_UUID_VALUE 
} from '@constants/bluetooth';
import { bleManager } from '@services/ble';
import { scan, stopScan } from '@actions/bluetoothActions';
import { getDeviceCharacteristics } from '@utils/bleCharacteristics';
import { reset } from '@actions/ble';

import styles from './styles';

type Props = { 
    children: ReactNode,
}

const LogScreen: FC<Props> = ({children}) => {
  const { isDeviceConnected } = useBluetoothConnected();
  const { device } = useBluetooth();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);

  useFocusEffect(
    useCallback(() => {
      if(!isDeviceConnected) {
        dispatch(reset());
        dispatch(scan());
        return () => dispatch(stopScan());
      }
    }, [isDeviceConnected])
  );

  useEffect(() => {
    bleManager.setLogLevel('Verbose');
  }, []);

  useFocusEffect(
    useCallback(() => {
      const getCharacteristics = async () => {
        if (isDeviceConnected) {
          const char = await getDeviceCharacteristics(device.id)
          setCharacteristics(char.filter((i)=>{
            if (i.serviceUUID === BLUETOOTH_SERVICE_UUID_VALUE && i.uuid === BLUETOOTH_CHARACTERISTIC_UUID_VALUE){
              return i
            }
          }));
        }
        setLoading(false);
      };
      getCharacteristics();
    }, [isDeviceConnected]),
  );

  const content = () => {
    return (
      <>
        {loading ? (
          <Progress color={COLORS.primaryDark} />
        ) : (
          <>
            <CharacteristicContext.Provider value={characteristics}>
              {children}
            </CharacteristicContext.Provider>
          </>
        )}
      </>
    );
  };

  return (
    <View style={styles.mainContainerStyle}>
      <View style={styles.listContainer}>
        {isDeviceConnected ? (
          content()
        ) : (
          <View style={styles.buttonBox}>
            <Text style={[styles.text, {color: colors.text}]}>
              {i18n.t('bluetooth.device_disconnected')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default LogScreen;
