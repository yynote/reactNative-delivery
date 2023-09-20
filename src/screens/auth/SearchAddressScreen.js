import React, { Component } from "react";
import { Keyboard, KeyboardAvoidingView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import Colors from "../../constants/Colors";
import { MyStatusBar } from "../../components/controls/MyStatusBar";
import { MyStyles, Strings } from "../../constants";
import { Button, ResizedImage, TopBar } from "../../components/controls";
import C, { IS_UI_MODE } from "../../constants/AppConstants";
import GlobalState from "../../mobx/GlobalState";
import EventBus from "react-native-event-bus";

export default class SearchAddressScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onConfirm() {
    if (IS_UI_MODE) {
      GlobalState.me.search_address = "Dandong City";
      GlobalState.me.search_longitude = "20.5";
      GlobalState.me.search_latitude = "30.5";
      EventBus.getInstance().fireEvent(C.EVENT_PARAMS.ADDRESS_SELECT, {});
      this.props.navigation.replace("SetAddress");
    } else {

    }
  }


  render() {
    return (
      <KeyboardAvoidingView style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}>
        <MyStatusBar theme="white" />
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <View style={MyStyles.full}>
            <TopBar
              theme={"white"}
              title={Strings.search_address}
              onBackPress={() => {
                this.onBack();
              }} />

            <View style={[{ flex: 1 }, MyStyles.center]}>
              <ResizedImage
                source={require("src/assets/images/ic_pin.png")}
              />
            </View>
            <Button
              style={[styles.bottom_btn]}
              onPress={() => {
                this.onConfirm();
              }}
            >
              <Text style={{
                fontSize: 16,
                color: Colors.white,
              }}>{Strings.confirm}</Text>
            </Button>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  bottom_btn: {
    marginBottom: 25,
    height: 50,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
