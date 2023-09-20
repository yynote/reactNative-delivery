import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, HorizontalLayout, ResizedImage, TopBar } from "../components/controls";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { MyStyles, Strings } from "../constants";
import Colors from "../constants/Colors";
import { API_RES_CODE } from "../constants/AppConstants";
import { Net, requestPost } from "../utils/APIUtils";
import Toast from "react-native-root-toast";
import GlobalState from "../mobx/GlobalState";

export default class NotificationScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pushNoti: GlobalState.me.alarm_push === "y",
      sms: GlobalState.me.alarm_sms === "y",
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onBack = () => {
    this.props.navigation.goBack();
  };

  onPushNoti() {

    requestPost(Net.home.set_alarm, {
      access_token: GlobalState.access_token,
      type: "push",
      value: this.state.pushNoti ? "n" : "y",
    }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        GlobalState.me.alarm_push = this.state.pushNoti ? "n" : "y"
        this.setState({ pushNoti: !this.state.pushNoti });

      } else {
        Toast.show(response.msg);
      }
    });
  }

  onSMS() {
    requestPost(Net.home.set_alarm, {
      access_token: GlobalState.access_token,
      type: "sms",
      value: this.state.sms ? "n" : "y",
    }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        GlobalState.me.alarm_sms = this.state.sms ? "n" : "y"
        this.setState({ sms: !this.state.sms });
      } else {
        Toast.show(response.msg);
      }
    });
  }


  render() {
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white_two }}>
        <MyStatusBar theme="white" />
        <TopBar
          theme={"white"}
          title={Strings.notification_set}
          onBackPress={() => {
            this.onBack();
          }} />
        <View style={MyStyles.horizontal_divider} />
        <View style={{ height: 40, paddingHorizontal: 20, justifyContent: "center" }}>
          <Text style={{ fontSize: 14, color: Colors.black }}>{Strings.agree_notification}</Text>
        </View>
        <HorizontalLayout style={styles.tab}>
          <Text style={styles.tab_text}>{Strings.agree_receive_push_noti}</Text>
          <Button onPress={() => {
            this.onPushNoti();
          }}>
            <ResizedImage
              source={
                this.state.pushNoti ?
                  require("src/assets/images/ic_toggle_on.png") :
                  require("src/assets/images/ic_toggle_off.png")
              } />
          </Button>
        </HorizontalLayout>
        <View style={styles.horizontal_divider} />
        <HorizontalLayout style={styles.tab}>
          <Text style={styles.tab_text}>{Strings.agree_receive_sms}</Text>
          <Button onPress={() => {
            this.onSMS();
          }}>
            <ResizedImage
              source={
                this.state.sms ?
                  require("src/assets/images/ic_toggle_on.png") :
                  require("src/assets/images/ic_toggle_off.png")
              } />
          </Button>
        </HorizontalLayout>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  tab: {
    height: 50,
    backgroundColor: Colors.white,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  tab_text: {
    fontSize: 14,
    color: Colors.black,
    flex: 1,
  },
  horizontal_divider: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.white_two,
  },

});
