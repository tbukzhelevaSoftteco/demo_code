import { StyleSheet } from 'react-native';
import { COLORS} from "@constants/colors";
import { fontSizeBody, height } from '@constants/sizes';

const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    height: height,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: fontSizeBody,
    color: COLORS.white
  },
  button: {
    position: 'absolute',
    elevation: 2,
    width: 104,
    height: 40,
    borderRadius: 10,
    marginTop: 4,
    bottom: 20,
    left: 24,
    backgroundColor: COLORS.primaryDark,
  },
  connectButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 40,
    margin: 4,
    alignSelf: "center",
    backgroundColor: COLORS.primaryDark,
  },
  buttonBox: {
    alignItems: "center"
  }
});

export default styles;
