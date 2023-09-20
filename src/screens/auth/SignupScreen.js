import React, { Component } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Colors from "../../constants/Colors";
import { MyStatusBar } from "../../components/controls/MyStatusBar";
import { MyStyles, Strings, TextStyles } from "../../constants";
import { Button, CheckBox, CheckBoxTerm, HorizontalLayout, ResizedImage, TopBar } from "../../components/controls";
import Toast from "react-native-root-toast";
import Common from "../../utils/Common";
import GlobalState from "../../mobx/GlobalState";
import EventBus from "react-native-event-bus";
import C, { API_RES_CODE } from "../../constants/AppConstants";
import { Net, requestPost } from "../../utils/APIUtils";
import PrefUtils from "../../utils/PrefUtils";


export default class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.timeTick = 1;
    this.login_type = this.props.navigation.getParam("login_type") ? this.props.navigation.getParam("login_type") : "";
    this.state = {
      selected_tab: 0,
      agreeRule: false,
      agreePrivacy: false,
      agreeLocation: false,
      id: this.props.navigation.getParam("info") ? this.props.navigation.getParam("info").sns_id : "",
      name: this.props.navigation.getParam("info") ? this.props.navigation.getParam("info").nick_name : "",
      errorId: false,
      errorName: false,
      pwd: "",
      errorPwd: false,
      pwdConfirm: "",
      errorPwdConfirm: false,
      phone: "",
      errorPhone: false,
      code: "",
      errorCode: false,
      doubleChecked: false,
      verificationStatus: 0,
      verificationTimeout: 180,
      apart: GlobalState.me.apart,
    };
  }

  componentDidMount() {
    EventBus.getInstance().addListener(C.EVENT_PARAMS.APT_SELECT, this.listener = ({}) => {
      this.setState({ apart: GlobalState.me.apart.name });
    });
  }

  componentWillUnmount() {
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onDoubleCheck() {
    if (this.state.id === "") {
      this.setState({ errorId: true });
      return;
    }
    let idResult = Common.check_validation_email(this.state.id);
    if (idResult) {
      requestPost(Net.auth.double_check, { email: this.state.id }).then(response => {
        if (response.result === API_RES_CODE.SUCCESS) {
          Toast.show(Strings.double_check_done);
          this.setState({ doubleChecked: true });
        } else {
          Toast.show(response.msg);
        }
      });

    } else {
      Toast.show(Strings.enter_correct_id);
    }
  }

  onGetVerificationCode() {
    if (this.state.phone === "") {
      this.setState({ errorPhone: true });
      return;
    }
    requestPost(Net.auth.get_code, { phone: this.state.phone }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        Toast.show(Strings.code_sent);
        this.setState({ verificationStatus: 1, verificationTimeout: 180, code: "" });
        clearInterval(this.interval);
        this.interval = setInterval(() => {
          if (this.state.verificationTimeout === 0) {
            this.setState({ verificationTimeout: 180, verificationStatus: 0 });
            clearInterval(this.interval);
          } else {
            this.setState({ verificationTimeout: this.state.verificationTimeout - 1 });
          }
        }, this.timeTick * 1000);
      } else {
        Toast.show(response.msg);
      }
    });
  }

  onVerifyCode() {
    if (this.state.code === "") {
      this.setState({ errorCode: true });
      return;
    }
    requestPost(Net.auth.check_cert_key, { phone: this.state.phone, cert_key: this.state.code }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        Toast.show(Strings.certification_success);
        this.setState({ verificationStatus: 2 });
        clearInterval(this.interval);
      } else {
        Toast.show(response.msg);
      }
    });
  }

  onGoHome() {
    PrefUtils.setString(C.ASYNC_PARAM.USER_ID, GlobalState.me.email);
    PrefUtils.setString(C.ASYNC_PARAM.USER_PWD, GlobalState.me.pwd);
    PrefUtils.setString(C.ASYNC_PARAM.LOGIN_TYPE, GlobalState.me.login_type);
    PrefUtils.setBool(C.ASYNC_PARAM.AUTO_LOGIN, true);
    this.props.navigation.navigate("Main");
  }

  onGoLogin() {
    this.props.navigation.navigate("Login");
  }

  onConfirmPwd() {
    if (this.state.pwd !== this.state.pwdConfirm) {
      this.setState({ errorPwdConfirm: true });
    }
  }

  onMembershipSignup() {
    if (!(this.state.agreeRule && this.state.agreePrivacy)) {
      Toast.show(Strings.agree_term);
    } else {
      this.setState({ selected_tab: 1 });
    }

  }

  onSignup() {
    if (this.state.id === "") {
      this.setState({ errorId: true });
      return;
    } else if (!Common.check_validation_email(this.state.id)) {
      Toast.show(Strings.enter_correct_id);
      return;
    }
    if (!this.state.doubleChecked) {
      Toast.show(Strings.double_check_id);
      return;
    }
    if (this.state.name === "") {
      this.setState({ errorName: true });
      return;
    }
    if (this.state.pwd === "" && this.login_type === "") {
      this.setState({ errorPwd: true });
      return;
    }
    if (this.state.pwdConfirm === "" && this.login_type === "") {
      Toast.show(Strings.confirm_pwd);
      return;
    } else if (this.state.pwdConfirm !== this.state.pwd) {
      this.setState({ errorPwdConfirm: true });
      return;
    }
    if (this.state.phone === "") {
      this.setState({ errorPhone: true });
      return;
    }
    if (this.state.verificationStatus === 0) {
      Toast.show(Strings.verify_your_phone);
      return;
    }
    if (this.state.code === "") {
      this.setState({ errorCode: true });
      return;
    }
    if (this.state.verificationStatus !== 2) {
      Toast.show(Strings.send_certKey);
      return;
    }
    requestPost(
      Net.auth.signup,
      {
        name: this.state.name,
        email: this.state.id,
        phone: this.state.phone,
        password: this.state.pwd,
        sign_type: this.login_type !== "" ? this.login_type : "email",
        dev_type: Common.get_device_type(),
        user_type: "user",
        apart_id: "",
        dev_token: GlobalState.dev_token,
        address: "",
        detail_address: "",
        latitude: "",
        longitude: "",
        business_license: "",
        sns_id: this.login_type !== "" ? this.state.id : "",
      }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        Toast.show(Strings.signup_success);
        this.setState({ selected_tab: 2 });
        GlobalState.me.uid = response.data.uid;
        GlobalState.me.name = response.data.name;
        GlobalState.me.email = response.data.email;
        GlobalState.me.phone = response.data.phone;
        GlobalState.me.profile = response.data.image;
        GlobalState.me.pwd = this.state.pwd;
        GlobalState.me.login_type = response.data.sign_type;
        GlobalState.access_token = response.data.access_token;
        GlobalState.me.apart = response.data.apart;
        GlobalState.me.sns_id = response.data.sns_id;
        GlobalState.me.point = response.data.point;
      } else {
        Toast.show(response.msg);
      }
    });
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}
                            behavior={Platform.OS === "ios" ? "padding" : ""}>
        <MyStatusBar theme="white" />
        <TouchableWithoutFeedback onPress={() => {
          Keyboard.dismiss();
        }}>
          <View style={{ height: "100%", width: "100%" }}>
            <TopBar
              theme={"white"}
              title={Strings.signup}
              onBackPress={() => {
                this.onBack();
              }} />
            <HorizontalLayout style={{
              backgroundColor: this.state.selected_tab === 2 ? Colors.light_blue : Colors.white_two,
              height: 40,
              borderRadius: 50,
              marginHorizontal: 15,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
            }}>
              <View
                style={[styles.tab_button, { backgroundColor: this.state.selected_tab === 0 ? Colors.primary : (this.state.selected_tab === 2 ? Colors.light_blue : Colors.white_two) }]}
              >
                <Text style={{
                  fontSize: 14,
                  color: this.state.selected_tab === 0 ? Colors.white : (this.state.selected_tab === 2 ? Colors.primary : Colors.black),
                }}>{Strings.user_rule}</Text>
              </View>
              <View
                style={[styles.tab_button, { backgroundColor: this.state.selected_tab === 1 ? Colors.primary : (this.state.selected_tab === 2 ? Colors.light_blue : Colors.white_two) }]}
              >
                <Text style={{
                  fontSize: 14,
                  color: this.state.selected_tab === 1 ? Colors.white : (this.state.selected_tab === 2 ? Colors.primary : Colors.LIGHT_GREY),
                }}>{Strings.input_info}</Text>
              </View>
              <View
                style={[styles.tab_button, { backgroundColor: this.state.selected_tab === 2 ? Colors.primary : Colors.white_two }]}
              >
                <Text style={{
                  fontSize: 14,
                  color: this.state.selected_tab === 2 ? Colors.white : Colors.LIGHT_GREY,
                }}>{Strings.signup_complete}</Text>
              </View>
            </HorizontalLayout>
            {
              this.state.selected_tab === 0 &&
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 16,
                  color: Colors.black,
                  marginTop: 30,
                  marginBottom: 20,
                  paddingLeft: 15,
                }}>{Strings.agree_user_rule}</Text>
                <Text style={{
                  fontSize: 13,
                  color: Colors.LIGHT_GREY,
                  paddingHorizontal: 15,
                  lineHeight: 19,
                }}>{Strings.rule_content}</Text>
                <View style={{ marginTop: 50, paddingHorizontal: 15, flex: 1 }}>
                  <CheckBox
                    checked={this.state.agreeRule &&
                    this.state.agreePrivacy &&
                    this.state.agreeLocation}
                    style={{ marginBottom: 10 }}
                    textStyle={{ color: Colors.primary, fontSize: 16 }}
                    label={Strings.select_all}
                    onPress={() => {
                      if (this.state.agreeRule &&
                        this.state.agreePrivacy &&
                        this.state.agreeLocation) {
                        this.setState({
                          agreeRule: false,
                          agreePrivacy: false,
                          agreeLocation: false,
                        });
                      } else {
                        this.setState({
                          agreeRule: true,
                          agreePrivacy: true,
                          agreeLocation: true,
                        });
                      }

                    }}
                  />
                  <CheckBoxTerm
                    checked={this.state.agreeRule}
                    require={true}
                    label={Strings.agree_rule}
                    onPress={() => {
                      this.setState({
                        agreeRule: !this.state.agreeRule,
                      });
                    }}
                    onView={() => {
                      this.props.navigation.navigate({ routeName: "UserTerm", params: { item: 0 } });
                    }}
                  />
                  <CheckBoxTerm
                    checked={this.state.agreePrivacy}
                    require={true}
                    label={Strings.agree_privacy}
                    onPress={() => {
                      this.setState({
                        agreePrivacy: !this.state.agreePrivacy,
                      });
                    }}
                    onView={() => {
                      this.props.navigation.navigate({ routeName: "UserTerm", params: { item: 1 } });

                    }}
                  />
                  <CheckBoxTerm
                    checked={this.state.agreeLocation}
                    require={false}
                    label={Strings.agree_location}
                    onPress={() => {
                      this.setState({
                        agreeLocation: !this.state.agreeLocation,
                      });
                    }}
                    onView={() => {
                      this.props.navigation.navigate({ routeName: "UserTerm", params: { item: 2 } });
                    }}
                  />
                </View>
                <Button
                  style={MyStyles.bottom_btn}
                  onPress={() => {
                    this.onMembershipSignup();
                  }}>
                  <Text style={{
                    fontSize: 16,
                    color: Colors.white,
                  }}>{Strings.membership_signup}</Text>
                </Button>
              </View>
            }
            {
              this.state.selected_tab === 1 &&
              <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}
                            disableScrollViewPanResponder={true}>
                  <View style={{ paddingHorizontal: 20 }}>
                    <HorizontalLayout style={{ marginTop: 30 }}>
                      <Text style={{ fontSize: 16, color: Colors.black }}>{Strings.enter_account_info}</Text>
                      {
                        this.state.errorId &&
                        <Text style={{ fontSize: 16, color: Colors.primary }}>*</Text>
                      }
                    </HorizontalLayout>
                    <HorizontalLayout style={{ marginTop: 15, height: 50 }}>
                      <TextInput
                        value={this.state.id}
                        style={[TextStyles.TEXT_STYLE_14, {
                          paddingHorizontal: 20,
                          paddingVertical: 10,
                          marginRight: 10,
                          backgroundColor: Colors.white_two,
                          flex: 1,
                        }]}
                        ref={input => {
                          this.idTextInput = input;
                        }}
                        onChangeText={text => {
                          this.setState({ id: text, errorId: false, doubleChecked: false });
                        }}
                        placeholder={Strings.ID}
                        placeholderTextColor={Colors.LIGHT_GREY}
                        keyboardType={"email-address"}
                        returnKeyType="done"
                        onSubmitEditing={() => {
                          this.onDoubleCheck();
                        }}
                      />
                      <Button
                        style={{
                          borderRadius: 5,
                          borderColor: Colors.primary,
                          width: 100,
                          borderWidth: 1,
                          alignItems: "center",
                          justifyContent: "center",
                          paddingHorizontal: 5,
                        }}
                        onPress={() => {
                          this.onDoubleCheck();
                        }}
                      >
                        <Text style={{ fontSize: 14, color: Colors.black }}>{Strings.double_check}</Text>
                      </Button>
                    </HorizontalLayout>
                    {
                      this.state.errorId &&
                      <Text
                        style={{ fontSize: 12, color: Colors.primary, marginTop: 5 }}>{Strings.required_field}</Text>
                    }
                    <TextInput
                      value={this.state.name}
                      maxLength={15}
                      style={[TextStyles.TEXT_STYLE_14, {
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        marginTop: 10,
                        backgroundColor: Colors.white_two,
                      }]}
                      ref={input => {
                        this.nameTextInput = input;
                      }}
                      onChangeText={text => {
                        this.setState({ name: text, errorName: false });
                      }}
                      placeholder={Strings.enter_name}
                      placeholderTextColor={Colors.LIGHT_GREY}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        if (this.login_type !== "") {
                          this.phoneTextInput.focus();
                        } else {
                          this.pwdTextInput.focus();
                        }
                      }}
                    />
                    {
                      this.state.errorName &&
                      <Text
                        style={{ fontSize: 12, color: Colors.primary, marginTop: 5 }}>{Strings.required_field}</Text>
                    }
                    {
                      this.login_type === "" &&
                      <View>
                        <TextInput
                          value={this.state.pwd}
                          style={[TextStyles.TEXT_STYLE_14, {
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            backgroundColor: Colors.white_two,
                            marginTop: 15,
                          }]}
                          ref={input => {
                            this.pwdTextInput = input;
                          }}
                          onChangeText={text => {
                            this.setState({ pwd: text, errorPwd: false });
                          }}
                          secureTextEntry={true}
                          placeholder={Strings.pwd_placeholder}
                          placeholderTextColor={Colors.LIGHT_GREY}
                          returnKeyType="next"
                          onSubmitEditing={() => {
                            this.pwdConfirmTextInput.focus();
                          }}
                        />
                        {
                          this.state.errorPwd &&
                          <Text
                            style={{
                              fontSize: 12,
                              color: Colors.primary,
                              marginTop: 5,
                            }}>{Strings.required_field}</Text>
                        }
                        <TextInput
                          value={this.state.pwdConfirm}
                          style={[TextStyles.TEXT_STYLE_14, {
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            marginTop: 15,
                            backgroundColor: Colors.white_two,
                          }]}
                          ref={input => {
                            this.pwdConfirmTextInput = input;
                          }}
                          onChangeText={text => {
                            this.setState({ pwdConfirm: text, errorPwdConfirm: false });
                          }}
                          secureTextEntry={true}
                          placeholder={Strings.pwd_confirm_placeholder}
                          placeholderTextColor={Colors.LIGHT_GREY}
                          returnKeyType="done"
                          onSubmitEditing={() => {
                            this.onConfirmPwd();
                          }}
                        />
                        {
                          this.state.errorPwdConfirm &&
                          <Text
                            style={{ fontSize: 12, color: Colors.red, marginTop: 5 }}>{Strings.pwd_not_matching}</Text>
                        }
                      </View>
                    }
                    <Text
                      style={{ fontSize: 16, color: Colors.black, paddingTop: 30 }}>{Strings.phone_verification}</Text>
                    <HorizontalLayout>
                      <View style={[MyStyles.input_back, { marginTop: 15, flex: 1 }]}>
                        <TextInput
                          value={this.state.phone}
                          style={[TextStyles.TEXT_STYLE_14, {
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                          }]}
                          ref={input => {
                            this.phoneTextInput = input;
                          }}
                          onChangeText={text => {
                            this.setState({ phone: text, errorPhone: false });
                          }}
                          placeholder={Strings.phone_placeholder}
                          placeholderTextColor={Colors.LIGHT_GREY}
                          returnKeyType="done"
                          keyboardType={"number-pad"}
                          onSubmitEditing={() => {
                            this.onGetVerificationCode();
                          }}
                        />
                      </View>
                      <Button
                        style={{
                          marginLeft: 10,
                          marginTop: 15,
                          borderWidth: 1,
                          width: 95,
                          borderColor: Colors.primary,
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={() => {
                          this.onGetVerificationCode();
                        }}
                      >
                        <Text style={{
                          fontSize: 14,
                          color: Colors.black,
                        }}>{this.state.verificationStatus === 0 ? Strings.get_code : Strings.resend}</Text>
                      </Button>
                    </HorizontalLayout>
                    {
                      this.state.errorPhone &&
                      <Text
                        style={{ fontSize: 12, color: Colors.primary, marginTop: 5 }}>{Strings.required_field}</Text>
                    }
                    <HorizontalLayout style={{ marginVertical: 10 }}>
                      <HorizontalLayout style={[MyStyles.input_back, { flex: 1 }]}>
                        <TextInput
                          value={this.state.code}
                          style={[TextStyles.TEXT_STYLE_14, {
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            flex: 1,
                          }]}
                          ref={input => {
                            this.codeTextInput = input;
                          }}
                          editable={this.state.verificationStatus === 1 ? true : false}
                          onChangeText={text => {
                            this.setState({ code: text, errorCode: false });
                          }}
                          placeholder={Strings.certification_input}
                          placeholderTextColor={Colors.LIGHT_GREY}
                          returnKeyType="done"
                          keyboardType={"number-pad"}
                          onSubmitEditing={() => {
                            this.onVerifyCode();
                          }}
                        />
                        <ResizedImage
                          source={require("src/assets/images/ic_clock.png")}
                          style={{ width: 20, height: 20, alignSelf: "center" }} />
                        <Text style={{
                          fontSize: 18,
                          color: Colors.primary,
                          alignSelf: "center",
                          marginLeft: 15,
                          marginRight: 10,
                        }}>{Common.getMinutesFromSeconds(this.state.verificationTimeout)}</Text>
                      </HorizontalLayout>
                      <Button
                        style={{
                          marginLeft: 10,
                          marginTop: 15,
                          borderWidth: 1,
                          width: 95,
                          borderColor: Colors.primary,
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={() => {
                          this.onVerifyCode();
                        }}
                      >
                        <Text style={{
                          fontSize: 14,
                          color: Colors.black,
                        }}>{Strings.verify}</Text>
                      </Button>

                    </HorizontalLayout>
                    {
                      this.state.errorCode &&
                      <Text
                        style={{ fontSize: 12, color: Colors.primary, marginTop: 5 }}>{Strings.required_field}</Text>
                    }
                  </View>
                </ScrollView>
                <Button
                  style={MyStyles.bottom_btn}
                  onPress={() => {
                    this.onSignup();
                  }}>
                  <Text style={{
                    fontSize: 16,
                    color: Colors.white,
                  }}>{Strings.signup}</Text>
                </Button>
              </View>
            }
            {
              this.state.selected_tab === 2 &&
              <View style={{ flex: 1 }}>
                <View>
                  <Text style={{
                    marginTop: 75,
                    fontSize: 25,
                    alignSelf: "center",
                    textAlign: "center",
                    backgroundColor: "#0000",
                  }}>{Strings.delivery_one_1}</Text>
                  <Button
                    onPress={() => this.props.navigation.navigate("SelectApart")}
                    style={[{
                      marginTop: 50,
                      backgroundColor: Colors.primary_light1,
                      width: 250,
                      height: 100,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: "center",
                    }, MyStyles.shadow]}>
                    {
                      this.state.apart === undefined &&
                      <Text style={{ fontSize: 18, color: Colors.black, textAlign: "center" }}>{Strings.no_apt}</Text>
                    }
                    {
                      this.state.apart !== undefined &&
                      <Text style={{
                        fontSize: 18,
                        color: Colors.black,
                        textAlign: "center",
                      }}>{Strings.formatString(Strings.chosen_apt, this.state.apart)}</Text>
                    }
                  </Button>
                </View>
                <View style={{ flex: 1 }} />
                <HorizontalLayout style={{ marginBottom: 25 }}>
                  <Button style={{
                    flex: 1,
                    height: 50,
                    backgroundColor: Colors.white_two,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                          onPress={() => {
                            this.onGoHome();
                          }}>
                    <Text style={{ fontSize: 16, color: Colors.LIGHT_GREY }}>{Strings.go_home}</Text>
                  </Button>
                  <Button style={{
                    flex: 1,
                    height: 50,
                    backgroundColor: Colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                          onPress={() => {
                            this.onGoLogin();
                          }}>
                    <Text style={{ fontSize: 16, color: Colors.white }}>{Strings.go_login}</Text>
                  </Button>
                </HorizontalLayout>
              </View>
            }
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  tab_button: {
    height: 40,
    borderRadius: 40,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
  star: {
    marginTop: 22,
    marginLeft: 10,
    fontSize: 16,
    color: Colors.primary,
  },
  search_btn: {
    marginLeft: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    height: 45,
    backgroundColor: Colors.light_blue,
    alignItems: "center",
    justifyContent: "center",
  },
});
