import { StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  itemContainer: {
    flex: 1,
    padding: 8,
  },
  connectButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    margin: 4,
    backgroundColor: COLORS.transparent,
  },
  wrapper: {
    flex: 1, 
    justifyContent: "center"
  },
  text: {
    fontSize: 32,
    alignSelf: "center",
    textAlign: "center"
  }
});

export default styles;
