import React, { useState } from 'react';
import { TextInput, View } from 'react-native';

import CustomButton from '@components/CustomButton';
import { PopUp } from '@components/PopUp';

import styles from './styles';
import i18n from '@i18n/index';
import { COLORS } from '@constants/colors';

type Props = {
  modalVisible: boolean;
  hideModal: () => void;
  buttonAddHandler: (note: string) => void;
}

const NotePopUp = ({modalVisible, hideModal, buttonAddHandler}: Props) => {
    const [note, setNote] = useState('');
    
    const addComment = (text: string) => {
      setNote(text)
    }

    const addNote = () =>{
      buttonAddHandler(note)
    }

    return (
      <PopUp modalVisible={modalVisible} hideModal={hideModal}>
        <View style={styles.popUp}>
          <TextInput 
            underlineColorAndroid={COLORS.transparent}
            onChangeText={addComment} 
            style={styles.input}
          />
          <CustomButton
            styles={styles.button}
            titleStyle={styles.textStyle}
            title={i18n.t('buttons.add')}
            onPress={addNote}
          />
        </View>
      </PopUp>
    )
  }

export default NotePopUp;
