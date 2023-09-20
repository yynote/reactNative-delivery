import React, { Component } from "react";
import {
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { MyStatusBar } from "../../components/controls/MyStatusBar";
import Colors from "../../constants/Colors";
import Strings from "../../constants/Strings";
import GlobalState from "../../mobx/GlobalState";
import Toast from "react-native-root-toast";
import C, { API_RES_CODE } from "../../constants/AppConstants";
import { Button, CheckBox, HorizontalLayout, ResizedImage, TopBar } from "../../components/controls";
import { Net, requestPost } from "../../utils/APIUtils";
import PrefUtils from "../../utils/PrefUtils";
import { TextStyles } from "../../constants";

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      pwd: "",
      auto_login: true,
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }


  goNext() {
    const { id, pwd, auto_login } = this.state;

    if (!id) {
      Toast.show(Strings.enter_id);
      return;
    }

    if (!pwd) {
      Toast.show(Strings.enter_pwd);
      return;
    }
    this.doLogin(Net.auth.login, { email: id, password: pwd, type: "user", login_type:"email" }, auto_login);
  }

  goSnsLogin() {
    let sns_id = "test@gmail.com";
    this.doLogin(Net.auth.login, { email: sns_id,password:"", type: "user", login_type:"sns" }, true);
  }

  doLogin(url, param, auto_login) {
    requestPost(url, param).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        let id = param.email;
        let pwd = param.login_type === "email" ? param.password : "";
        GlobalState.me.uid = response.data.uid;
        GlobalState.me.name = response.data.name;
        GlobalState.me.email = response.data.email;
        GlobalState.me.phone = response.data.phone;
        GlobalState.me.profile = response.data.image;
        GlobalState.me.pwd = pwd;
        GlobalState.me.login_type = param.login_type;
        GlobalState.access_token = response.data.access_token;
        GlobalState.me.apart = response.data.apart;
        GlobalState.me.sns_id = response.data.sns_id;
        GlobalState.me.delivery_address = response.data.delivery_address;
        GlobalState.me.point = response.data.point;
        GlobalState.me.alarm_push = response.data.alarm_push;
        GlobalState.me.alarm_sms = response.data.alarm_sms;
        if (auto_login) {
          PrefUtils.setString(C.ASYNC_PARAM.USER_ID, id);
          PrefUtils.setString(C.ASYNC_PARAM.USER_PWD, pwd);
          PrefUtils.setString(C.ASYNC_PARAM.LOGIN_TYPE, param.login_type);
          // PrefUtils.setString(C.ASYNC_PARAM.APP_TOKEN, response.data.app_token);
          PrefUtils.setBool(C.ASYNC_PARAM.AUTO_LOGIN, auto_login);
        }

        GlobalState.tabIndex = "home";
        this.props.navigation.navigate("Main");
      } else if (response.result === 202 && param.login_type ==="sns") {
        let sns_info = {
          sns_id: 'test@gmail.com',
          nick_name: "snsNick",
        }
        this.props.navigation.navigate({ routeName: "Signup", params: {login_type:"sns", info:sns_info}});

      } else {
        Toast.show(response.msg);
      }
    });
  }

  onSignup() {
    this.props.navigation.navigate("Signup");
  }

  onFindId() {
    this.props.navigation.navigate({ routeName: "Find", params: { item: 0 } });
  }

  onFindPwd() {
    this.props.navigation.navigate({ routeName: "Find", params: { item: 1 } });
  }

  onBack() {
    this.props.navigation.navigate('Intro');
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}
                            behavior={Platform.OS === "ios" ? "padding" : ""}>
        <MyStatusBar theme="white" />
        <TopBar
          theme={"white"}
          title={Strings.login}
          onBackPress={() => {
            this.onBack();
          }} />
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => {
          Keyboard.dismiss();
        }}>
          <View style={{ marginTop: 10, width: "100%", height: "100%", paddingHorizontal: 20 }}>
            <View style={{ height: 50, backgroundColor: Colors.white_two, borderRadius: 5 }}>
              <TextInput value={this.state.id} style={[TextStyles.TEXT_STYLE_16, {
                paddingHorizontal: 25,
                paddingVertical: 15,
                marginLeft: 0,
              }]}
                         ref={input => {
                           this.idTextInput = input;
                         }}
                         onChangeText={text => {
                           this.setState({ id: text });
                         }}
                         placeholder={Strings.id_placeholder}
                         placeholderTextColor={Colors.LIGHT_GREY}
                         keyboardType={"email-address"}
                         returnKeyType="next"
                         onSubmitEditing={() => {
                           this.pwdTextInput.focus();
                         }}
              />
            </View>
            <View style={{ marginTop: 15, height: 50, backgroundColor: Colors.white_two, borderRadius: 5 }}>
              <TextInput value={this.state.pwd} style={[TextStyles.TEXT_STYLE_16, {
                paddingHorizontal: 25,
                paddingVertical: 15,
                marginLeft: 0,
              }]}
                         ref={input => {
                           this.pwdTextInput = input;
                         }}
                         onChangeText={text => {
                           this.setState({ pwd: text });
                         }}
                         placeholder={Strings.password}
                         placeholderTextColor={Colors.LIGHT_GREY}
                         secureTextEntry={true}
                         returnKeyType="done"
                         onSubmitEditing={() => {
                           this.goNext();
                         }}
              />
            </View>
            <Button
              style={{
                marginTop: 15,
                marginBottom: 20,
                height: 50,
                backgroundColor: Colors.primary,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                this.goNext();
              }}
            >
              <Text style={{
                fontSize: 16,
                color: Colors.white,
              }}>{Strings.login}</Text>
            </Button>
            <CheckBox
              style={{ marginLeft: 15, alignItems: "center" }}
              checked={this.state.auto_login}
              textStyle={{ color: Colors.LIGHT_GREY, fontSize: 16 }}
              label={Strings.auto_login}
              onPress={() => {
                this.setState({
                  auto_login: !this.state.auto_login,
                });
              }}
            />
            <View style={{ height: 1, backgroundColor: Colors.LIGHT_GREY, marginTop: 35 }} />
            <Button
              style={{
                marginTop: 20,
                marginBottom: 20,
                height: 50,
                backgroundColor: Colors.yellow,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                this.goSnsLogin();
              }}
            >
              <HorizontalLayout style={{ alignItems: "center" }}>
                <ResizedImage
                  source={require("src/assets/images/ic_sns_login1.png")}
                  style={{ width: 20, position: "absolute", left: -100 }} />
                <Text style={{
                  fontSize: 16,
                  color: Colors.black,
                }}>{Strings.login_sns}</Text>
              </HorizontalLayout>
            </Button>
            <HorizontalLayout style={{ width: "100%", marginTop: 100 }}>
              <Button
                style={{ flex: 1, height: 50, alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                  this.onFindId();
                }}>
                <Text style={{
                  fontSize: 14,
                  color: Colors.LIGHT_GREY,
                }}>{Strings.find_id}</Text>
              </Button>
              <View style={{ height: 50, width: 1, backgroundColor: Colors.LIGHT_GREY }} />
              <Button
                style={{ flex: 1, height: 50, alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                  this.onFindPwd();
                }}>
                <Text style={{
                  fontSize: 14,
                  color: Colors.LIGHT_GREY,
                }}>{Strings.find_password}</Text>
              </Button>
            </HorizontalLayout>
            <Button
              style={{ marginTop: 10, height: 20, alignItems: "center", justifyContent: "center" }}
              onPress={() => {
                this.onFindPwd();
              }}>
              <Text style={{
                fontSize: 12,
                color: Colors.LIGHT_GREY,
              }}>{Strings.not_member_yet}</Text>
            </Button>
            <Button
              style={{ height: 20, alignItems: "center", justifyContent: "center" }}
              onPress={() => {
                this.onSignup();
              }}>
              <Text style={{
                fontSize: 14,
                color: Colors.primary,
                textDecorationLine: "underline",
              }}>{Strings.signup}</Text>
            </Button>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}
