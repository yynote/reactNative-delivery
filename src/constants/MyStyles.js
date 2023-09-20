import { StyleSheet } from "react-native";
import Colors from "./Colors";

export default StyleSheet.create({
  container: {
    padding: 25,
  },
  popup_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 0,
    margin: 0,
  },
  container1: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  padding_h_main: {
    paddingHorizontal: 25,
  },
  padding_h_20: {
    paddingHorizontal: 20,
  },
  padding_v_main: {
    paddingVertical: 30,
  },
  padding_v_25: {
    paddingVertical: 25,
  },
  padding_v_15: {
    paddingVertical: 15,
  },
  padding_v_20: {
    paddingVertical: 20,
  },
  padding_v_5: {
    paddingVertical: 5,
  },
  padding_h_5: {
    paddingHorizontal: 5,
  },
  padding_l_5: {
    paddingLeft: 5,
  },
  margin_h_20: {
    marginHorizontal: 20,
  },
  margin_h_main: {
    marginHorizontal: 25,
  },
  margin_l_10: {
    marginLeft: 10,
  },
  margin_t_10: {
    marginTop: 10,
  },
  margin_t_20: {
    marginTop: 20,
  },
  margin_t_30: {
    marginTop: 30,
  },
  margin_b_20: {
    marginBottom: 20,
  },
  bg_main_color: {
    backgroundColor: Colors.white_three,
  },
  bg_primary_blue: {
    backgroundColor: Colors.primary_blue,
  },
  bg_white: {
    backgroundColor: Colors.white,
  },

  modal_bg: {
    backgroundColor: "rgba(0,0,0,0.6)",
    width: "100%",
    justifyContent: "center",
    height: "100%",
  },
  modal_wrapper: {
    width: "100%",
    justifyContent: "flex-end",
    height: "100%",
  },

  modal_container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: Colors.white,
  },

  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: Colors.white,
  },

  shadow:{
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: {
      width: 10,
      height: 15,
    },
    shadowRadius: 12,
    elevation: 10,
  },

  shadow2: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 2,
  },

  shadow_3: {
    shadowColor: "#3d3d3d",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.46,
    elevation: 8,
  },

  shadow_strong: {
    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 4,
  },

  shadow4: {
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 4,
  },

  outline_btn: {
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 0,
    alignItems: "center",
    width: "100%",
    height: 50,
    marginBottom: 10,
  },
  full: {
    width: "100%",
    height: "100%",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  input_back: {
    marginTop: 15,
    height: 50,
    backgroundColor: Colors.white_two,
    borderRadius: 5,
  },
  bottom_btn: {
    marginBottom: 25,
    height: 50,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  require_error: {
    marginTop: 10,
    fontSize: 12,
    color: Colors.primary,
  },
  primary_btn: {
    height: 50,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  horizontal_divider: {
    height: 1,
    backgroundColor: Colors.white_two,
    width: "100%",

  },
});
