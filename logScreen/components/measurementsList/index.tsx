import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Characteristic } from 'react-native-ble-plx';
import { useMedplum, useMedplumProfile } from '@medplum/react-hooks';
import { useNetInfo } from "@react-native-community/netinfo";
import uuid from 'react-native-uuid';

import { readCharacteristic } from '@utils/bleCharacteristics';
import {
  fromB64toByteArray,
  fromByteArrayToNumber,
  fromByteToNumber,
} from '@utils/crypto';
import { trackLog } from "@utils/trackLog";

import getNoteRequestBody from '@utils/noteRequestBody';
import useCharacteristic from '@hooks/useCharacteristic';
import useBluetooth from '@hooks/useBluetooth';

import { 
  NOTE,
  TEMPERATURE,
  BODY_TEMPERATURE,
  HUMIDITY
} from '@constants/measurements'
import { Observation } from '@src/types/observation';
import { StoreState } from '@src/types/ble';
import { setMeasurement, setLoading } from '@actions/ble';
import { saveLocalObservation } from 'src/localDB/utils/saveLocalObservation';
import { getRequestBody } from '@utils/requestBody';
import i18n from '@i18n/index';

import NotePopUp from '../notePopup';
import Dropdown from '../dropdown';

import { COMMUNICATION_URL, OBSERVATION_URL } from '@constants/api';
import { OBSERVATIONS } from '@constants/query';

import styles from './styles';

type Props = { 
  isOpen: boolean;
  handleDropdown: () => void;
}

const initObservation = {id: uuid.v4(), title: "", subtitle: "", type: "", date: new Date().toISOString() }

const MeasurementsListComponent = ({ isOpen, handleDropdown }: Props)  => {
  const medplum = useMedplum();
  const dispatch = useDispatch();
  const { isConnected } = useNetInfo();
  const { meta: { author }, name } = useMedplumProfile();
  const characteristics = useCharacteristic();
  const { device } = useBluetooth();

  const [temperetureData, setTemperetureData] = useState<Array<Observation>>([initObservation]);
  const [humidityData, setHumidityData] = useState<Array<Observation>>([initObservation]);
  const [modalVisible, setModalVisible] = useState(false);
  const { measurements } = useSelector((state: StoreState) => {
    return state.ble
  });

  useEffect(() => {
    init(characteristics[0]);
  }, [characteristics]);

  const init = async (characteristic: Characteristic) => {
    if (characteristic?.isReadable) {
      const char = await readCharacteristic(characteristic);
      update(char);
    }
  };

  const addNoteHandler = async (note: string) => {
    hideModal()
    try {
      const data = getNoteRequestBody(note, author, name)
      if(isConnected) {
        await medplum.post(COMMUNICATION_URL, {...data});
      } else {
        saveLocalObservation(OBSERVATIONS, data)
      }
      dispatch(setMeasurement([{
          id: uuid.v4(),
          subtitle: note, 
          type: NOTE,
          title: NOTE,
          date: new Date().toISOString()
      }, ...measurements]));
    } catch (e) {
      trackLog<Error>(
        "Error in addNoteHandler medplum.post('fhir/R4/Observation'):",
        e,
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  const update = (characteristic: Characteristic) => {
    const byteArray = fromB64toByteArray(characteristic.value ? characteristic.value : '');
    const temperature = fromByteArrayToNumber(byteArray, 0, 2);
    const humidity = fromByteToNumber(String(byteArray[2]));

    setTemperetureData([...temperetureData, {
      id: uuid.v4(),
      title: BODY_TEMPERATURE,
      subtitle: String(temperature / 100),
      type: BODY_TEMPERATURE,
      date: new Date().toISOString()
    }]);

    setHumidityData([...humidityData, {
      id: uuid.v4(),
      title: HUMIDITY,
      subtitle: String(humidity),
      type: HUMIDITY,
      date: new Date().toISOString()
    }]);
  };

  const hideModal = () => {
    setModalVisible(false)
  }

  const postMeasument = async (lastMeasure: Observation, measureType: string) => {
    try {
        dispatch(setLoading(true));
        handleDropdown()
        const data = getRequestBody(device, author, lastMeasure, measureType)
        if(isConnected) {
          await medplum.post(OBSERVATION_URL, {...data});
        } else {
          data && saveLocalObservation(OBSERVATIONS, data)
        }
        dispatch(setMeasurement([lastMeasure, ...measurements ]));
    } catch (e) {
        trackLog<Error>(
          "Error in postMeasument medplum.post('fhir/R4/Observation'):",
          e,
        );
    } finally {
        dispatch(setLoading(false));
    }
}

  const addHandler = (item: string) => {
    switch (item) {
      case NOTE:
        setModalVisible(true);
        dispatch(setLoading(true));
        handleDropdown()
        break;
      case TEMPERATURE:
        let lastTemperetureData = temperetureData[temperetureData.length -1];
        postMeasument(lastTemperetureData, BODY_TEMPERATURE);
        break;
      case HUMIDITY:
        let lastHumidityData = humidityData[humidityData.length -1];
        postMeasument(lastHumidityData, HUMIDITY);
        break;
    }
  }

  return (
    <View style={styles.itemContainer}>
      <View style={styles.wrapper}>
        <Text style={styles.text}>{`${i18n.t('bluetooth.device')} ${device.name} ${i18n.t('bluetooth.isConnected')}`}</Text>
        {isOpen && <Dropdown handleAdd={addHandler} />}
      </View>
      <NotePopUp
        modalVisible={modalVisible}
        hideModal={hideModal}
        buttonAddHandler={addNoteHandler}
      />
    </View>
  );
};

export default MeasurementsListComponent;
