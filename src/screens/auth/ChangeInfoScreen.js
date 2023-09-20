import React, { Component } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Colors from "../../constants/Colors";
import { MyStatusBar } from "../../components/controls/MyStatusBar";
import { TopBar } from "../../components/controls/TopBar";
import { MyStyles, Strings, TextStyles } from "../../constants";
import { ScrollView } from "react-native-gesture-handler";
import { Button, HorizontalLayout, ResizedImage } from "../../components/controls";
import Toast from "react-native-root-toast";
import Common from "../../utils/Common";
import GlobalState from "../../mobx/GlobalState";
import { Net, requestPost } from "../../utils/APIUtils";
import C, { API_RES_CODE } from "../../constants/AppConstants";

export default class ChangeInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.timeTick = 1;
    this.state = {
      id: GlobalState.me.email,
      pwd: "",
      newPwd: "",
      newPwdConfirm: "",
      email: "",
      afterFix: "",
      phone: "",
      code: "",
      emailType: 0,
      step: 0,
      verificationStatus: 0,
      verificationTimeout: 180,
      name: ""
    };

    this.emailTypes = [
      {
        code: 0,
        value: Strings.direct_input,
      },
      {
        code: 0,
        value: "google",
      },
      {
        code: 0,
        value: "apple",
      },
      {
        code: 0,
        value: "yahoo",
      },

    ];
  }

  componentDidMount() {
    if (GlobalState.me.login_type ==="sns") {
      this.setState({step:1})
    }
  }

  componentWillUnmount() {
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onConfirm() {
    if (this.state.pwd === "") {
      Toast.show(Strings.enter_pwd);
      return;
    }
    if (this.state.pwd !== GlobalState.me.pwd) {
      Toast.show(Strings.wrong_password);
      return
    }
    this.setState({ step: 1 });

  }

  onGetVerificationCode() {
    if (this.state.phone === "") {
      Toast.show(Strings.enter_phone);
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
      Toast.show(Strings.enter_certification_code);
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

  onModifyComplete() {
    if ((this.state.newPwd !== "" || this.state.newPwdConfirm !== "") && (this.state.newPwd !== this.state.newPwdConfirm)) {
      Toast.show(Strings.pwd_not_matching);
      return;
    }
    if (this.state.phone === "" && this.state.newPwd === "") {
      return;
    }
    if (this.state.verificationStatus === 0 && this.state.phone!== '') {
      Toast.show(Strings.verify_your_phone);
      return;
    }
    if (this.state.code === "" && this.state.verificationStatus !== 0) {
      Toast.show(Strings.enter_certification_code);
      return;
    }
    requestPost(Net.auth.change_info, {
        access_token: GlobalState.access_token,
        phone: this.state.phone,
        name: this.state.name,
        password: this.state.newPwd
         }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        Toast.show(Strings.modify_success);
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
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <View style={MyStyles.full}>
            <TopBar
              theme={"white"}
              title={Strings.change_personal_info}
              onBackPress={() => {
                this.onBack();
              }}
            />
            {
              this.state.step === 0 &&
              <View style={{ width: "100%", flex: 1, backgroundColor: Colors.white }}>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: "100%" }}>
                  <Text style={{
                    fontSize: 16,
                    color: Colors.black,
                    paddingHorizontal: 30,
                    textAlign: "center",
                  }}>{Strings.enter_pwd_once_more}</Text>
                  <View style={{ width: "100%" }}>
                    <View style={{
                      marginTop: 30,
                      height: 50,
                      backgroundColor: Colors.white_two,
                      borderRadius: 5,
                      marginHorizontal: 10,
                    }}>
                      <TextInput
                        value={this.state.pwd} style={[TextStyles.TEXT_STYLE_14, {
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
                        placeholder={Strings.password_input}
                        placeholderTextColor={Colors.LIGHT_GREY}
                        secureTextEntry={true}
                        returnKeyType="done"
                        onSubmitEditing={() => {
                          this.onConfirm();
                        }}
                      />
                    </View>

                  </View>

                </View>
                <Button
                  style={MyStyles.bottom_btn}
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
            }
            {
              this.state.step === 1 &&
              <View style={{ width: "100%", flex: 1 }}>
                <ScrollView style={{ width: "100%", height: "100%", backgroundColor: Colors.white }} showsVerticalScrollIndicator={false} disableScrollViewPanResponder={true}>
                  <View style={{ flex: 1, padding: 20 }}>
                    <HorizontalLayout>
                      <Text style={{ fontSize: 16, color: Colors.LIGHT_GREY }}>{Strings.ID} {this.state.id}</Text>
                    </HorizontalLayout>
                    {
                      GlobalState.me.login_type !=="sns" &&
                      <View>
                        <Text style={{ fontSize: 16, color: Colors.black, marginVertical: 20 }}>{Strings.change_info}</Text>
                        <TextInput
                          value={this.state.newPwd}
                          style={[TextStyles.TEXT_STYLE_14, {
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            backgroundColor: Colors.white_two,
                            marginBottom: 15,
                          }]}
                          ref={input => {
                            this.pwdTextInput = input;
                          }}
                          onChangeText={text => {
                            this.setState({ newPwd: text });
                          }}
                          secureTextEntry={true}
                          placeholder={Strings.pwd_placeholder}
                          placeholderTextColor={Colors.LIGHT_GREY}
                          returnKeyType="next"
                          onSubmitEditing={() => {
                            this.pwdConfirmTextInput.focus();
                          }}
                        />
                        <TextInput
                          value={this.state.newPwdConfirm}
                          style={[TextStyles.TEXT_STYLE_14, {
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            backgroundColor: Colors.white_two,
                          }]}
                          ref={input => {
                            this.pwdConfirmTextInput = input;
                          }}
                          onChangeText={text => {
                            this.setState({ newPwdConfirm: text });
                          }}
                          secureTextEntry={true}
                          placeholder={Strings.pwd_confirm_placeholder}
                          placeholderTextColor={Colors.LIGHT_GREY}
                          returnKeyType="next"
                          onSubmitEditing={() => {
                            this.phoneTextInput.focus();
                          }}
                        />
                      </View>
                    }
                    <Text
                      style={{ fontSize: 16, color: Colors.black, paddingTop: 50 }}>{Strings.phone_verification}</Text>
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
                            this.setState({ phone: text });
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
                          width: 95,
                          borderRadius: 5,
                          backgroundColor: Colors.primary,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={() => {
                          this.onGetVerificationCode()
                        }}
                      >
                        <Text style={{
                          fontSize: 14,
                          color: Colors.white,
                        }}>{this.state.verificationStatus === 0 ? Strings.get_code : Strings.resend}</Text>
                      </Button>
                    </HorizontalLayout>
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
                          onChangeText={text => {
                            this.setState({ code: text });
                          }}
                          placeholder={Strings.verify_placeholder}
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
                          backgroundColor: Colors.primary,
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
                          color: Colors.white,
                        }}>{Strings.verify}</Text>
                      </Button>
                    </HorizontalLayout>

                  </View>

                </ScrollView>
                <Button
                  style={MyStyles.bottom_btn}
                  onPress={() => {
                    this.onModifyComplete();
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    color: Colors.white,
                  }}>{Strings.modify_complete}</Text>
                </Button>
              </View>
            }
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    marginTop: 30,
    fontSize: 16,
    color: Colors.black,
    alignSelf: "center",
  },

  mark: {
    fontSize: 16,
    color: Colors.black,
    marginHorizontal: 10,
    marginTop: 25,
  },
});
