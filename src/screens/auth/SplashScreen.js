import React, { Component } from "react";
import { BackHandler, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import { ResizedImage } from "../../components/controls";
import PrefUtils from "../../utils/PrefUtils";
import C, { API_RES_CODE } from "../../constants/AppConstants";
import GlobalState from "../../mobx/GlobalState";
import { Strings } from "../../constants";
import { MyStatusBar } from "../../components/controls/MyStatusBar";
import Toast from "react-native-root-toast";
import { Net, requestPost } from "../../utils/APIUtils";
import Common from "../../utils/Common";

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);

    this.INTRO_TIME = 1;    

    this.state = {
      introTimeOver: false,
      checkLogin: false,
    };
  }

  componentDidMount() {

    setTimeout(() => {
      this.setState({ introTimeOver: true }, () => this.next());
    }, this.INTRO_TIME * 1000);

    this.checkLogin();
  }

  componentWillUnmount() {
  }

  handleBackPress() {
    if (this.confirmExit === true) {
      BackHandler.exitApp();
    } else {
      Toast.show(Strings.msg_back_again);
      this.confirmExit = true;
      this.interval = setInterval(() => {
        this.confirmExit = false;
        clearInterval(this.interval);
      }, 2000);
    }
    return true;
  }

  checkLogin = async () => {
    let version = await PrefUtils.getString(C.ASYNC_PARAM.APP_VERSION);
    requestPost(Net.home.app_info, { device_type: Common.get_device_type(), type: "user" }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        GlobalState.storeLink = response.data.store_link;
        GlobalState.app_last_version = response.data.version;
        GlobalState.main_banner = response.data.main_banner;
        GlobalState.category_banner = response.data.category_banner;
        GlobalState.term = response.data.term;
        if (version === "") {
          PrefUtils.setString(C.ASYNC_PARAM.APP_VERSION, GlobalState.app_last_version);
          GlobalState.app_current_version = GlobalState.app_last_version;
        } else {
          GlobalState.app_current_version = version;
        }
      } else {
        Toast.show(response.msg);
      }
    });


    let auto_login = await PrefUtils.getBool(C.ASYNC_PARAM.AUTO_LOGIN);
    let id = await PrefUtils.getString(C.ASYNC_PARAM.USER_ID);
    let pwd = await PrefUtils.getString(C.ASYNC_PARAM.USER_PWD);
    let login_type = await PrefUtils.getString(C.ASYNC_PARAM.LOGIN_TYPE);
    let request_auto = await PrefUtils.getBool(C.ASYNC_PARAM.REQUEST_AUTO);
    let request = await PrefUtils.getString(C.ASYNC_PARAM.REQUEST);

    if (auto_login) {
      requestPost(Net.auth.login, { email: id, password: pwd, type: "user", login_type:login_type }).then(response => {
        if (response.result === API_RES_CODE.SUCCESS) {
          GlobalState.me.uid = response.data.uid;
          GlobalState.me.name = response.data.name;
          GlobalState.me.email = response.data.email;
          GlobalState.me.phone = response.data.phone;
          GlobalState.access_token = response.data.access_token;
          GlobalState.me.apart = response.data.apart;
          GlobalState.me.pwd = pwd;
          GlobalState.tabIndex = "home";
          GlobalState.me.login_type = login_type;
          GlobalState.me.delivery_address = response.data.delivery_address;
          GlobalState.me.point = response.data.point;
          GlobalState.me.request_auto = request_auto;
          GlobalState.me.request = request;
          GlobalState.me.alarm_push = response.data.alarm_push;
          GlobalState.me.alarm_sms = response.data.alarm_sms;

          this.setState({ checkLogin: true, loginSuccess: true }, () => this.next());
        } else {
          Toast.show(response.msg);
          this.setState({ checkLogin: true, loginSuccess: false }, () => this.next());
        }
      });
    } else {
      this.setState({ checkLogin: true, loginSuccess: false }, () => this.next());
    }
  };

  next = async () => {
    if (!this.state.introTimeOver) {
      return;
    }
    if (!this.state.checkLogin) {
      return;
    }

    if (this.state.loginSuccess) {
      this.props.navigation.navigate("Main");
    } else {
      this.props.navigation.navigate("Intro");
    }
  };

  render() {
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}>
        <MyStatusBar theme="white" />
        <View style={{ marginTop: 60, height: 150, alignItems: "center", justifyContent: "center" }}>
          <ResizedImage
            source={require("src/assets/images/ic_logo_circle.png")}
            style={{ width: 150 }} />
          <Text style={{
            position: "absolute",
            fontSize: 35,
            color: Colors.black,
            textAlign: "center",
          }}>{Strings.delivery_one}</Text>
        </View>
        <Text style={{
          fontSize: 22,
          color: Colors.black,
          textAlign: "center",
          marginTop: 20,
        }}>{Strings.delivery_app_without_fee}</Text>

        <ResizedImage
          source={require("src/assets/images/ic_logo.png")}
          resizeMode={"contain"}
          style={{ width: "100%", height: "65%", position: "absolute", bottom: "-10%", right: "10%" }} />
      </View>
    );
  }
}
