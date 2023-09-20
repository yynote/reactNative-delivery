import React, { Component } from "react";
import { Keyboard, KeyboardAvoidingView, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { Button, HorizontalLayout, TopBar } from "../components/controls";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { MyStyles, Strings, TextStyles } from "../constants";
import Colors from "../constants/Colors";
import Toast from "react-native-root-toast";
import { Net, requestPost } from "../utils/APIUtils";
import C, { API_RES_CODE } from "../constants/AppConstants";
import GlobalState from "../mobx/GlobalState";
import EventBus from "react-native-event-bus";

export default class SetAddressScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailAddress: this.props.navigation.getParam("item").detailAddress,
      item: this.props.navigation.getParam("item"),
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onConfirm() {
    if (this.state.detailAddress !== "") {
      requestPost(Net.home.address_add, {
        access_token: GlobalState.access_token,
        address: this.state.item.address,
        detail_address: this.state.detailAddress,
        latitude: this.state.item.latitude,
        longitude: this.state.item.longitude,
        zip_code: this.state.item.zipCode,
      }).then(response => {
        if (response.result === API_RES_CODE.SUCCESS) {
          Toast.show(Strings.address_add_success);
          EventBus.getInstance().fireEvent(C.EVENT_PARAMS.ADDRESS_ADD, {});
        } else {
          Toast.show(response.msg);
        }
      });
      this.props.navigation.goBack();
    } else {
      Toast.show(Strings.enter_detail_address);
    }


  }

  render() {
    return (
      <KeyboardAvoidingView style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}
                            behavior={Platform.OS === "ios" ? "padding" : ""}>
        <MyStatusBar theme="white" />
        <TopBar
          theme={"white"}
          title={Strings.set_address}
          onBackPress={() => {
            this.props.navigation.goBack();
          }} />
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => {
          Keyboard.dismiss();
        }}>
          <View style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: 20, flex: 1 }}>
              <Text style={{ marginTop: 20, fontSize: 14, color: Colors.black }}>AAA BBB CCC 228</Text>
              <Text style={{ marginTop: 10, fontSize: 14, color: Colors.LIGHT_GREY }}>[{Strings.new_address}] XXX YYY
                40</Text>
              <TextInput
                value={this.state.detailAddress}
                style={[TextStyles.TEXT_STYLE_14, {
                  paddingRight: 20,
                  paddingVertical: 10,
                  borderBottomColor: Colors.primary,
                  borderBottomWidth: 2,
                }]}
                onChangeText={text => {
                  this.setState({ detailAddress: text });
                }}
                placeholder={Strings.enter_detail_address}
                placeholderTextColor={Colors.grey6}
                returnKeyType="done"
                onSubmitEditing={() => {
                  this.onConfirm();
                }}
              />
              <HorizontalLayout style={{ marginTop: 20 }}>
                <View style={{ flex: 1 }} />
                <Button
                  style={[{
                    width: 100,
                    height: 40,
                    backgroundColor: Colors.primary,
                    borderRadius: 5,
                  }, MyStyles.center]}
                  onPress={() => this.setState({ detailAddress: "" })}>
                  <Text style={{ fontSize: 14, color: Colors.white }}>{Strings.re_enter}</Text>
                </Button>
              </HorizontalLayout>
            </View>
            <Button
              style={{
                height: 50,
                backgroundColor: Colors.primary,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
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
