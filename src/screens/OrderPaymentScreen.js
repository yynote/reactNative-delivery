import React, { Component } from "react";
import { KeyboardAvoidingView, ScrollView, Text, TextInput, View } from "react-native";
import Colors from "../constants/Colors";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { MyStyles, Strings, TextStyles } from "../constants";
import { Button, CheckBox, HorizontalLayout, ResizedImage, TopBar } from "../components/controls";
import { TextInputMask } from "react-native-masked-text";
import AskPopup from "../components/popups/AskPopup";
import ConfirmPopup from "../components/popups/ConfirmPopup";
import GlobalState from "../mobx/GlobalState";
import { Net, requestPost } from "../utils/APIUtils";
import C, { API_RES_CODE } from "../constants/AppConstants";
import Toast from "react-native-root-toast";
import EventBus from "react-native-event-bus";
import PrefUtils from "../utils/PrefUtils";
import PayChangePopup from "../components/popups/PayChangePopup";

export default class OrderPaymentScreen extends Component {
  constructor(props) {
    super(props);
    this.deliveryType = this.props.navigation.getParam("deliveryType");
    this.point = this.props.navigation.getParam("point") === "" ? 0 : parseInt(this.props.navigation.getParam("point"));
    this.cardStatus = this.props.navigation.getParam("cardRegister") !== 1;
    this.state = {
      address: "",
      detailAddress: "",
      phone: "",
      autoSave: GlobalState.me.request_auto,
      requests: GlobalState.me.request,
      precautionShow: true,
      thirdPartyShow: false,
      backPopup: false,
      addressPopup: false,
      phonePopup: false,
      payMethodPopup: false,
      payMethod: this.props.navigation.getParam("payMethod"),
      agree: false,
      agreePopup: false
    };
  }

  componentWillUnmount() {
  }

  componentDidMount() {
    this.setState({ phone: GlobalState.me.phone });
    if (this.deliveryType === 2) {
      this.setState({ address: GlobalState.me.apart.name });
    } else {
      this.setState({
        address: GlobalState.me.delivery_address.address,
        detailAddress: GlobalState.me.delivery_address.detail_address,
      });
    }
  }

  onBack() {
    this.setState({ backPopup: true });
  }

  onPay() {
    if (this.state.detailAddress === "") {
      this.setState({ addressPopup: true });
      return;
    }

    if (this.state.phone === "") {
      this.setState({ phonePopup: true });
      return;
    }

    if (this.state.autoSave) {
      PrefUtils.setBool(C.ASYNC_PARAM.REQUEST_AUTO, this.state.autoSave);
      PrefUtils.setString(C.ASYNC_PARAM.REQUEST, this.state.requests);
    }

    if (!this.state.agree) {
      this.setState({agreePopup:true});
      return;
    }

    requestPost(Net.home.order,
      {
        access_token: GlobalState.access_token,
        shop_uid: parseInt(GlobalState.shop_detail.shop_uid),
        request: this.state.requests,
        type: this.deliveryType,
        product_price: GlobalState.total_price,
        fee: this.deliveryType === 1 ? parseInt(GlobalState.shop_detail.fee) : 0,
        pay_method: this.state.payMethod,
        apart_uid: this.deliveryType === 1 ? "" : parseInt(GlobalState.me.apart.uid),
        delivery_address: this.deliveryType === 1 ? GlobalState.me.delivery_address.address : "",
        detail_address: this.state.detailAddress,
        product: JSON.stringify(GlobalState.order),
        receive_phone: this.state.phone,
        point: this.point,
      }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        Toast.show(Strings.order_success);
        GlobalState.order = [];
        GlobalState.total_price = 0;
        GlobalState.product_cnt = 0;
        GlobalState.me.point = (parseInt(GlobalState.me.point) - this.point + parseInt(response.data.point)).toString();
        GlobalState.me.request = this.state.requests;
        GlobalState.me.request_auto = this.state.autoSave;
        EventBus.getInstance().fireEvent(C.EVENT_PARAMS.GLOBAL_CHANGE, { point: GlobalState.me.point });
        this.props.navigation.navigate("Main");
        GlobalState.tabIndex = "history";
      } else {
        Toast.show(response.msg);
      }
    });

  }

  payMethodChange() {
    if (this.cardStatus) {
      this.setState({ payMethodPopup: true });
    } else {
      Toast.show(Strings.register_your_card);
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ width: "100%", height: "100%" }}
                            behavior={Platform.OS === "ios" ? "padding" : ""}>
        <View style={[MyStyles.full, { backgroundColor: Colors.white_two }]}>
          <MyStatusBar theme="white" />
          <TopBar
            theme={"white"}
            title={Strings.order_payment}
            onBackPress={() => {
              this.onBack();
            }} />
          <View style={[MyStyles.horizontal_divider]} />
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} disableScrollViewPanResponder={true}>
            <View style={{ padding: 20, backgroundColor: Colors.white }}>
              <Text style={{ fontSize: 12, color: Colors.primary }}>{Strings.delivery_info}</Text>
              <Text style={{ fontSize: 14, color: Colors.black, marginTop: 20 }}>{this.state.address}</Text>
              <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY, marginTop: 10 }}>[{Strings.new_address}] XXX YYY
                40</Text>
              <TextInput
                value={this.state.detailAddress}
                style={[TextStyles.TEXT_STYLE_14, {
                  height: 50,
                  paddingHorizontal: 20,
                  alignItems: "center",
                  backgroundColor: Colors.white_two,
                  marginTop: 10,
                  borderRadius: 5,
                }]}
                onChangeText={text => {
                  this.setState({ detailAddress: text });
                }}
                placeholder={Strings.detail_address}
                placeholderTextColor={Colors.LIGHT_GREY}
                returnKeyType="next"
                onSubmitEditing={() => {
                  this.phoneField.focus();
                }}
              />
              <TextInputMask
                type={"cel-phone"}
                style={{
                  borderColor: Colors.LIGHT_GREY,
                  borderWidth: 1,
                  borderRadius: 5,
                  marginTop: 10,
                  paddingHorizontal: 20,
                  fontSize: 14,
                }}
                options={{
                  maskType: "BRL",
                  withDDD: true,
                  dddMask: "999-",
                }}
                value={this.state.phone}
                placeholder={"000-0000-0000"}
                maxLength={13}
                placeholderTextColor={Colors.LIGHT_GREY}
                onChangeText={text => {
                  this.setState({
                    phone: text,
                  });
                }}
                refInput={ref => {
                  this.phoneField = ref;
                }}
                returnKeyType="done"
              />
            </View>
            <View style={{ padding: 20, backgroundColor: Colors.white, marginTop: 20 }}>
              <HorizontalLayout>
                <Text style={{ fontSize: 12, color: Colors.primary, flex: 1 }}>{Strings.requests}</Text>
                <CheckBox
                  style={{ alignItems: "center" }}
                  checked={this.state.autoSave}
                  textStyle={{
                    color: this.state.autoSave ? Colors.black : Colors.LIGHT_GREY,
                    fontSize: 12,
                    marginLeft: 5,
                  }}
                  label={Strings.auto_save}
                  onPress={() => {
                    this.setState({ autoSave: !this.state.autoSave });
                  }}
                />
              </HorizontalLayout>
              <TextInput
                value={this.state.requests}
                style={[TextStyles.TEXT_STYLE_14, {
                  height: 50,
                  paddingHorizontal: 20,
                  alignItems: "center",
                  backgroundColor: Colors.white_two,
                  marginTop: 10,
                  borderRadius: 5,
                }]}
                onChangeText={text => {
                  this.setState({ requests: text });
                }}
                placeholder={Strings.you_can_write_up}
                maxLength={40}
                placeholderTextColor={Colors.LIGHT_GREY}
                returnKeyType="done"
              />
            </View>
            <View style={{ padding: 20, backgroundColor: Colors.white, marginTop: 20 }}>
              <Text style={{ fontSize: 12, color: Colors.primary }}>{Strings.payment_amount}</Text>
              <Text style={{
                fontSize: 24,
                color: Colors.black,
                marginTop: 30,
              }}>{GlobalState.total_price + Strings.$}</Text>
              <Text style={{
                fontSize: 12,
                color: Colors.LIGHT_GREY,
                marginTop: 10,
                marginBottom: 20,
              }}>{Strings.order_amount + "   " + GlobalState.total_price + Strings.$}</Text>
              <HorizontalLayout style={{
                height: 50,
                borderWidth: 1,
                borderColor: Colors.white_two,
                backgroundColor: Colors.white_three,
                borderRadius: 5,
                alignItems: "center",
              }}>
                <View style={{ flex: 1 }} />
                <Text style={{ fontSize: 16, color: Colors.black }}>{this.state.payMethod === 1?Strings.card_pay:Strings.account_transfer_pay}</Text>
                <Button style={[{ width: 100, height: 50 }, MyStyles.center]} onPress={() => {
                  this.payMethodChange();
                }}>
                  <Text style={{ fontSize: 14, color: Colors.primary }}>{Strings.change}</Text>
                </Button>
              </HorizontalLayout>
            </View>
            <View style={{ marginTop: 20 }}>
              <Button
                style={{
                  padding: 20,
                  justifyContent: "center",
                  height: 50,
                  backgroundColor: Colors.white,
                  borderBottomColor: Colors.white_two,
                  borderBottomWidth: 1,
                }}
                onPress={() => {
                  this.setState({ precautionShow: !this.state.precautionShow });
                }}>
                <HorizontalLayout style={{ alignItems: "center" }}>
                  <Text style={{ fontSize: 12, color: Colors.black, flex: 1 }}>{Strings.precautions_for}</Text>
                  <ResizedImage
                    source={this.state.precautionShow ? require("src/assets/images/ic_top_up.png") : require("src/assets/images/ic_down_colored.png")} />
                </HorizontalLayout>
              </Button>
              {
                this.state.precautionShow &&
                <Text style={{
                  padding: 20,
                  color: Colors.LIGHT_GREY,
                  backgroundColor: Colors.white_three,
                  fontSize: 12,
                  lineHeight: 30,
                }}>{Strings.precaution_noti}</Text>
              }
            </View>
            <View style={{ marginTop: 20 }}>
              <Button
                style={{
                  padding: 20,
                  justifyContent: "center",
                  height: 50,
                  backgroundColor: Colors.white,
                  borderBottomColor: Colors.white_two,
                  borderBottomWidth: 1,
                }}
                onPress={() => {
                  this.setState({ thirdPartyShow: !this.state.thirdPartyShow });
                }}>
                <HorizontalLayout style={{ alignItems: "center" }}>
                  <Text style={{ fontSize: 12, color: Colors.black, flex: 1 }}>{Strings.provide_third_party}</Text>
                  <ResizedImage
                    source={this.state.thirdPartyShow ? require("src/assets/images/ic_top_up.png") : require("src/assets/images/ic_down_colored.png")} />
                </HorizontalLayout>
              </Button>
              {/*{*/}
              {/*  this.state.thirdPartyShow &&*/}
              {/*  <Text style={{padding:20, color: Colors.LIGHT_GREY, backgroundColor: Colors.white_three, fontSize:12, lineHeight:30}}>{Strings.precaution_noti}</Text>*/}
              {/*}*/}
            </View>
            <View style={[{ height: 70 }, MyStyles.center]}>
              <CheckBox
                style={{ marginLeft: 30, alignItems: "center", marginVertical: 30 }}
                checked={this.state.agree}
                textStyle={{ color: Colors.LIGHT_GREY, fontSize: 14 }}
                label={Strings.i_have_confirmed}
                onPress={() => {
                  this.setState({
                    agree: !this.state.agree,
                  });
                }}
              />
              {/*<Text style={{ fontSize: 14, color: Colors.LIGHT_GREY }}>{Strings.i_have_confirmed}</Text>*/}
            </View>
            <Button
              style={{
                height: 50,
                backgroundColor: Colors.primary,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                this.onPay();
              }}
            >
              <Text style={{
                fontSize: 16,
                color: Colors.white,
              }}>{GlobalState.total_price + Strings.$ + Strings.payment}</Text>
            </Button>
          </ScrollView>
          <AskPopup
            visible={this.state.backPopup}
            title={Strings.would_order_again}
            yes_no={false}
            onCancel={() => this.setState({ backPopup: false })}
            onConfirm={() => {
              this.setState({
                backPopup: false,
              });
              this.props.navigation.goBack();
            }}
          />
          <ConfirmPopup
            visible={this.state.addressPopup}
            title={Strings.enter_detail_address}
            onConfirm={() => {
              this.setState({
                addressPopup: false,
              });
            }}
          />
          <ConfirmPopup
            visible={this.state.phonePopup}
            title={Strings.enter_phone}
            onConfirm={() => {
              this.setState({
                phonePopup: false,
              });
            }}
          />
          <ConfirmPopup
            visible={this.state.agreePopup}
            title={Strings.agree_popup}
            onConfirm={() => {
              this.setState({
                agreePopup: false,
              });
            }}
          />
          <PayChangePopup
            visible={this.state.payMethodPopup}
            onOk={() => {
              this.setState({ payMethodPopup: false });
            }}
            onCard={() => {
              this.setState({ payMethod: 1 });
            }}
            onAccount={() => {
              this.setState({ payMethod: 2 });
            }}
            onCancel={() => {
              this.setState({ payMethodPopup: false });
            }}
            payMethod={this.state.payMethod}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}
