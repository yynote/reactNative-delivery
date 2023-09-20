import React, { Component } from "react";
import { FlatList, Image, ScrollView, Text, View } from "react-native";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { Strings } from "../constants";
import Colors from "../constants/Colors";
import { Button, CheckBox, HorizontalLayout, TopBar } from "../components/controls";
import ConfirmPopup from "../components/popups/ConfirmPopup";
import AskPopup from "../components/popups/AskPopup";
import GlobalState from "../mobx/GlobalState";
import { Net, requestPost } from "../utils/APIUtils";
import { API_RES_CODE } from "../constants/AppConstants";
import Toast from "react-native-root-toast";

export default class WithdrawalScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: GlobalState.me.email,
      reasonList: [],
      selectedReason: 0,
      agree: false,
      withdrawalConfirm: false,
      withdrawalAlert: false,
      finalConfirmPopup: false,
    };
  }

  componentDidMount() {
    this.loadReasonList();
  }

  componentWillUnmount() {
  }

  loadReasonList() {
    this.setState({
      reasonList: [
        Strings.reason1,
        Strings.reason2,
        Strings.reason3,
        Strings.reason4,
        Strings.reason5,
        Strings.reason6,
        Strings.reason7,
      ],
    });
  }

  onCancel() {
    this.props.navigation.goBack();
  }

  onWithdrawal() {
    if (!this.state.agree) {
      this.setState({ withdrawalAlert: true });
    } else {
      this.setState({ finalConfirmPopup: true });
    }
  }

  doWithdraw() {
    requestPost(Net.home.withdraw, {
      access_token: GlobalState.access_token,
      type: this.state.selectedReason + 1,
    }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        this.setState({ withdrawalConfirm: true });
      } else {
        Toast.show(response.msg);
      }
    });

  }

  onBack() {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white_two }}>
        <MyStatusBar theme="white" />
        <TopBar
          theme={"white"}
          title={Strings.withdrawal}
          onBackPress={() => {
            this.onBack();
          }} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 14, color: Colors.black }}>{Strings.notice_withdrawal}</Text>
          </View>
          <View style={{ backgroundColor: Colors.white, paddingHorizontal: 20, paddingVertical: 25 }}>
            <HorizontalLayout>
              <Text style={{ fontSize: 14, color: Colors.LIGHT_GREY }}>{Strings.id_withdrawn}</Text>
              <Text style={{ fontSize: 14, color: Colors.black }}>{this.state.id}</Text>
            </HorizontalLayout>
            <Text style={{
              marginTop: 20,
              lineHeight: 25,
              color: Colors.black,
              fontSize: 12,
            }}>{Strings.notice_content}</Text>
          </View>
          <View style={{ backgroundColor: Colors.white, paddingHorizontal: 20, paddingVertical: 25, marginTop: 20 }}>
            <Text style={{ fontSize: 14, color: Colors.black }}>{Strings.erasing_personal_info}</Text>
            <Text style={{
              marginTop: 20,
              lineHeight: 25,
              color: Colors.black,
              fontSize: 12,
            }}>{Strings.erasing_content}</Text>
          </View>
          <View style={{ backgroundColor: Colors.white, paddingHorizontal: 20, paddingTop: 25, marginTop: 20 }}>
            <Text style={{ fontSize: 14, color: Colors.black }}>{Strings.reason_selection}</Text>
            <FlatList
              style={{ margin: 20 }}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              data={this.state.reasonList}
              renderItem={({ item, index }) =>
                <Button
                  onPress={() => {
                    this.setState({ selectedReason: index });
                  }}
                  style={{ flex: 1, marginTop: 25 }}
                >
                  <HorizontalLayout style={{ alignItems: "center" }}>
                    <Image
                      source={
                        this.state.selectedReason === index
                          ? require("src/assets/images/ic_radio_on.png")
                          : require("src/assets/images/ic_radio_off.png")}
                      style={{ width: 20, height: 20 }}
                    />
                    <Text style={{
                      fontSize: 12,
                      color: this.state.selectedReason === index ? Colors.black : Colors.LIGHT_GREY,
                      marginLeft: 10,
                    }}>{item}</Text>
                  </HorizontalLayout>
                </Button>
              }
            />
          </View>
          <CheckBox
            style={{ marginLeft: 30, alignItems: "center", marginVertical: 30 }}
            checked={this.state.agree}
            textStyle={{ color: Colors.black, fontSize: 12 }}
            label={Strings.withdrawal_agree}
            onPress={() => {
              this.setState({
                agree: !this.state.agree,
              });
            }}
          />
          <HorizontalLayout style={{ width: "100%" }}>
            <Button style={{
              width: "50%",
              height: 50,
              backgroundColor: Colors.white,
              alignItems: "center",
              justifyContent: "center",
            }}
                    onPress={() => {
                      this.onCancel();
                    }}>
              <Text style={{ fontSize: 16, color: Colors.black }}>{Strings.cancel}</Text>
            </Button>
            <Button style={{
              width: "50%",
              height: 50,
              backgroundColor: Colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
                    onPress={() => {
                      this.onWithdrawal();
                    }}>
              <Text style={{ fontSize: 16, color: Colors.white }}>{Strings.withdrawal}</Text>
            </Button>
          </HorizontalLayout>
        </ScrollView>
        <ConfirmPopup
          visible={this.state.withdrawalConfirm}
          title={Strings.withdrawal_done}
          onConfirm={() => {
            this.setState({
              withdrawalConfirm: false,
            }, () => {
              this.props.navigation.navigate("Intro");
            });
          }}
        />
        <ConfirmPopup
          visible={this.state.withdrawalAlert}
          title={Strings.withdrawal_alert}
          onConfirm={() => {
            this.setState({
              withdrawalAlert: false,
            });
          }}
        />
        <AskPopup
          visible={this.state.finalConfirmPopup}
          title={Strings.final_withdrawal_confirm}
          yes_no={false}
          onCancel={() => this.setState({ finalConfirmPopup: false })}
          onConfirm={() => {
            this.setState({
              finalConfirmPopup: false,
            }, () => {
              this.doWithdraw();
            });
          }}
        />
      </View>
    );
  }
}
