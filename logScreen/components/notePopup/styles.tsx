import { StyleSheet } from 'react-native';
import { COLORS } from "@constants/colors";

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 16,
    lineHeight:  20,
    paddingVertical: 4,
  },
  button: {
    width: 150,
    backgroundColor: COLORS.primaryDark,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 20
  },
  commentButton: {
    width: "25%",
    backgroundColor: COLORS.primaryDark,
    borderRadius: 8,
    alignSelf: "center",
    height: 40
  },
  popUp: {
    width: "90%",
    height: 300,
    alignSelf: "center",
    alignItems: "center"
  },
  input: {
    height: 52,
    width: "90%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    borderColor: 'gray',
    marginTop: 20,
    paddingHorizontal: 10,
    color: COLORS.black,
    alignSelf: "center"
  }
});

export default styles;
