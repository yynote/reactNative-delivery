import React, { Component } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, HorizontalLayout, ResizedImage, TabBar, TopBar, VerticalLayout } from "../components/controls";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { MyStyles, Strings } from "../constants";
import Colors from "../constants/Colors";
import { TextInputMask } from "react-native-masked-text";
import Toast from "react-native-root-toast";
import { Net, requestPost } from "../utils/APIUtils";
import C, { API_RES_CODE } from "../constants/AppConstants";
import GlobalState from "../mobx/GlobalState";
import EventBus from "react-native-event-bus";

export default class CardRegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab_index: 0,
      showError: false,
      cardNo: "",
      ownerName: "",
      valPeriod: "",
      pwd: "",
      birthday: "",
      cardType: false,
      cardNick: "",
      cvv: "",
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onRegister() {
    if (this.state.cardNo === "") {
      Toast.show(Strings.input_card_number);
      return;
    } else if (this.state.cardNo.length < 19) {
      Toast.show(Strings.input_correct_number);
      return;
    }
    if (this.state.ownerName === "") {
      Toast.show(Strings.enter_name);
      return;
    }
    if (this.state.valPeriod === "") {
      Toast.show(Strings.valid_period_input);
      return;
    }
    if (this.state.cardNick === "") {
      Toast.show(Strings.card_nick_placeholder);
      return;
    }
    if (this.state.tab_index === 0) {
      if (this.state.pwd === "") {
        Toast.show(Strings.enter_pwd);
        return;
      }
      if (this.state.birthday === "") {
        Toast.show(Strings.enter_birthday);
        return;
      }
    }
    if (this.state.tab_index === 1) {
      if (this.state.cvv === "") {
        Toast.show(Strings.enter_cvv);
        return;
      }
    }
    requestPost(Net.home.card_register, {
      access_token: GlobalState.access_token,
      type: this.state.tab_index === 1 ? "overseas" : "domestic",
      number: this.state.cardNo,
      owner: this.state.ownerName,
      valid_period: this.state.valPeriod,
      password: this.state.tab_index === 1 ? "" : this.state.pwd,
      birthday: this.state.tab_index === 1 ? "" : this.state.birthday,
      category: this.state.tab_index === 1 ? "" : (this.state.cardType ? "corporation" : "person"),
      nickname: this.state.cardNick,
      cvv: this.state.tab_index === 1 ? this.state.cvv : "",
    }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        Toast.show(Strings.card_register_success);
        EventBus.getInstance().fireEvent(C.EVENT_PARAMS.CARD_REGISTER, {});
        this.props.navigation.goBack();
      } else {
        Toast.show(response.msg);
      }
    });
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}
                            behavior={Platform.OS === "ios" ? "padding" : ""}>
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}>
            <MyStatusBar theme="white" />
            <TopBar
              theme={"white"}
              title={Strings.card_registration}
              onBackPress={() => {
                this.onBack();
              }} />
            <TabBar
              tab_index={this.state.tab_index}
              tab_count={2}
              textStyle={{ fontSize: 16 }}
              titles={[Strings.domestic_card, Strings.overseas_card]}
              onClick={(id) => {
                this.setState({
                  tab_index: id,
                  title: id === 0 ? Strings.domestic_card : Strings.overseas_card,
                });
              }}
            />
            {
              this.state.tab_index === 0 &&
              <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 20 }} disableScrollViewPanResponder={true}>
                {
                  this.state.showError &&
                  <View style={{
                    height: 40,
                    borderColor: Colors.red,
                    borderWidth: 1,
                    justifyContent: "center",
                    marginBottom: 20,
                  }}>
                    <Text style={{ fontSize: 16, color: Colors.red, paddingLeft: 20 }}>PDK ErrorP818: service no
                      card</Text>
                  </View>
                }
                <HorizontalLayout style={{ alignItems: "center" }}>
                  <Text style={{ width: 90, fontSize: 14, color: Colors.black }}>{Strings.card_no}</Text>
                  <TextInputMask
                    type={"credit-card"}
                    options={{
                      obfuscated: false,
                    }}
                    value={this.state.cardNo}
                    style={{
                      paddingHorizontal: 20,
                      fontSize: 17,
                      paddingVertical: 10,
                      height: 50,
                      backgroundColor: Colors.white_two,
                      flex: 1,
                    }}
                    ref={input => {
                      this.cardNoInput = input;
                    }}
                    onChangeText={text => {
                      this.setState({ cardNo: text });
                    }}
                    placeholder={Strings.card_no_placeholder}
                    placeholderTextColor={Colors.placeholder_1}
                    keyboardType={"number-pad"}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      this.ownerNameInput.focus();
                    }}
                  />
                </HorizontalLayout>
                <HorizontalLayout style={{ alignItems: "center", marginTop: 10 }}>
                  <Text style={{ width: 90, fontSize: 14, color: Colors.black }}>{Strings.owner}</Text>
                  <TextInput
                    value={this.state.ownerName}
                    style={{
                      paddingHorizontal: 20,
                      fontSize: 17,
                      paddingVertical: 10,
                      height: 50,
                      backgroundColor: Colors.white_two,
                      flex: 1,
                    }}
                    ref={input => {
                      this.ownerNameInput = input;
                    }}
                    onChangeText={text => {
                      this.setState({ ownerName: text });
                    }}
                    placeholder={Strings.please_enter_name}
                    placeholderTextColor={Colors.placeholder_1}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      this.validPeriod.focus();
                    }}
                  />
                </HorizontalLayout>
                <HorizontalLayout style={{ marginTop: 10 }}>
                  <VerticalLayout>
                    <Text style={{ fontSize: 13, color: Colors.black }}>{Strings.valid_period}</Text>
                    <Text style={{ fontSize: 13, color: Colors.LIGHT_GREY }}>{Strings.date_style1}</Text>
                    <View style={{
                      height: 25,
                      borderBottomColor: Colors.LIGHT_GREY,
                      borderBottomWidth: 1,
                      width: 80,
                      marginTop: 10,
                    }}>
                      <TextInputMask
                        type={"datetime"}
                        options={{
                          format: "MM/YY",
                        }}
                        style={{
                          fontSize: 13,
                          paddingVertical: 5,
                          backgroundColor: Colors.white,
                          alignSelf: "center",
                        }}
                        placeholder={"     /    "}
                        placeholderTextColor={Colors.LIGHT_GREY}
                        value={this.state.valPeriod}
                        refInput={input => {
                          this.validPeriod = input;
                        }}
                        onChangeText={text => {
                          this.setState({
                            valPeriod: text,
                          });
                        }}
                        returnKeyType="next"
                        onSubmitEditing={() => {
                          this.pwd.focus();
                        }}
                      />
                    </View>
                  </VerticalLayout>
                  <VerticalLayout style={{ marginLeft: 20 }}>
                    <Text style={{ fontSize: 13, color: Colors.black }}>{Strings.password}</Text>
                    <Text style={{ fontSize: 13, color: Colors.LIGHT_GREY }}>{Strings.pwd_placeholder_card}</Text>
                    <HorizontalLayout style={{ alignItems: "center" }}>
                      <TextInput
                        value={this.state.pwd}
                        style={{
                          fontSize: 13,
                          marginTop: 10,
                          paddingVertical: 5,
                          height: 25,
                          backgroundColor: Colors.white,
                          borderBottomColor: Colors.LIGHT_GREY,
                          borderBottomWidth: 1,
                        }}
                        ref={input => {
                          this.pwd = input;
                        }}
                        onChangeText={text => {
                          this.setState({ pwd: text });
                        }}
                        maxLength={2}
                        secureTextEntry={true}
                        placeholderTextColor={Colors.LIGHT_GREY}
                        returnKeyType="next"
                        onSubmitEditing={() => {
                          this.birthdayInput.focus();
                        }}
                      />
                      <Text style={{ fontSize: 13, color: Colors.LIGHT_GREY, marginLeft: 5 }}>**</Text>
                    </HorizontalLayout>
                  </VerticalLayout>
                </HorizontalLayout>
                <VerticalLayout style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 13, color: Colors.black }}>{Strings.birthday}</Text>
                  <Text style={{ fontSize: 13, color: Colors.LIGHT_GREY }}>{Strings.date_style2}</Text>
                  <View style={{
                    height: 25,
                    borderBottomColor: Colors.LIGHT_GREY,
                    borderBottomWidth: 1,
                    width: 130,
                    marginVertical: 10,
                  }}>
                    <TextInputMask
                      type={"datetime"}
                      options={{
                        format: "YYYY/MM/DD",
                      }}
                      style={{
                        fontSize: 13,
                        paddingVertical: 5,
                        backgroundColor: Colors.white,
                        alignSelf: "center",
                      }}
                      placeholder={"   /         /   "}
                      placeholderTextColor={Colors.LIGHT_GREY}
                      value={this.state.birthday}
                      refInput={input => {
                        this.birthdayInput = input;
                      }}
                      onChangeText={text => {
                        this.setState({
                          birthday: text,
                        });
                      }}
                      returnKeyType="done"
                    />
                  </View>

                </VerticalLayout>
                <HorizontalLayout style={{ marginTop: 10, alignItems: "center" }}>
                  <Button onPress={() => {
                    this.setState({ cardType: false });
                  }}>
                    <Text style={{ fontSize: 13, color: Colors.black }}>{Strings.person_card}</Text>
                  </Button>

                  <Button onPress={() => {
                    this.setState({ cardType: !this.state.cardType });
                  }}>
                    <ResizedImage
                      style={{ marginHorizontal: 5 }}
                      source={
                        this.state.cardType ?
                          require("src/assets/images/ic_toggle_on.png") :
                          require("src/assets/images/ic_toggle_off.png")
                      } />
                  </Button>
                  <Button onPress={() => {
                    this.setState({ cardType: true });
                  }}>
                    <Text style={{ fontSize: 13, color: Colors.black }}>{Strings.corporation_card}</Text>
                  </Button>
                </HorizontalLayout>
                <HorizontalLayout style={{ alignItems: "center", marginTop: 10 }}>
                  <Text style={{ width: 100, fontSize: 14, color: Colors.black }}>{Strings.card_nickname}</Text>
                  <TextInput
                    value={this.state.cardNick}
                    style={{
                      paddingHorizontal: 20,
                      fontSize: 17,
                      paddingVertical: 10,
                      height: 50,
                      backgroundColor: Colors.white_two,
                      flex: 1,
                    }}
                    ref={input => {
                      this.cardNickInput = input;
                    }}
                    onChangeText={text => {
                      this.setState({ cardNick: text });
                    }}
                    placeholder={Strings.card_nick_placeholder}
                    placeholderTextColor={Colors.placeholder_1}
                    returnKeyType="done"
                  />
                </HorizontalLayout>
              </ScrollView>
            }
            {
              this.state.tab_index === 1 &&
              <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 20 }}>
                {
                  this.state.showError &&
                  <View style={{
                    height: 40,
                    borderColor: Colors.red,
                    borderWidth: 1,
                    justifyContent: "center",
                    marginBottom: 20,
                  }}>
                    <Text style={{ fontSize: 16, color: Colors.red, paddingLeft: 20 }}>PDK ErrorP818: service no
                      card</Text>
                  </View>
                }
                <HorizontalLayout style={{ alignItems: "center" }}>
                  <Text style={{ width: 90, fontSize: 14, color: Colors.black }}>{Strings.card_no}</Text>
                  <TextInputMask
                    type={"credit-card"}
                    options={{
                      obfuscated: false,
                    }}
                    value={this.state.cardNo}
                    style={{
                      paddingHorizontal: 20,
                      fontSize: 17,
                      paddingVertical: 10,
                      height: 50,
                      backgroundColor: Colors.white_two,
                      flex: 1,
                    }}
                    ref={input => {
                      this.cardNoInput = input;
                    }}
                    onChangeText={text => {
                      this.setState({ cardNo: text });
                    }}
                    placeholder={Strings.card_no_placeholder}
                    placeholderTextColor={Colors.placeholder_1}
                    keyboardType={"number-pad"}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      this.ownerNameInput.focus();
                    }}
                  />
                </HorizontalLayout>
                <HorizontalLayout style={{ alignItems: "center", marginTop: 10 }}>
                  <Text style={{ width: 90, fontSize: 14, color: Colors.black }}>{Strings.owner}</Text>
                  <TextInput
                    value={this.state.ownerName}
                    style={{
                      paddingHorizontal: 20,
                      fontSize: 17,
                      paddingVertical: 10,
                      height: 50,
                      backgroundColor: Colors.white_two,
                      flex: 1,
                    }}
                    ref={input => {
                      this.ownerNameInput = input;
                    }}
                    onChangeText={text => {
                      this.setState({ ownerName: text });
                    }}
                    placeholder={Strings.please_enter_name}
                    placeholderTextColor={Colors.placeholder_1}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      this.validPeriod.focus();
                    }}
                  />
                </HorizontalLayout>
                <VerticalLayout style={{marginTop: 10}}>
                  <Text style={{ fontSize: 13, color: Colors.black }}>{Strings.valid_period}</Text>
                  <Text style={{ fontSize: 13, color: Colors.LIGHT_GREY }}>{Strings.date_style1}</Text>
                  <View style={{
                    height: 25,
                    borderBottomColor: Colors.LIGHT_GREY,
                    borderBottomWidth: 1,
                    width: 80,
                    marginTop: 10,
                  }}>
                    <TextInputMask
                      type={"datetime"}
                      options={{
                        format: "MM/YY",
                      }}
                      style={{
                        fontSize: 13,
                        paddingVertical: 5,
                        backgroundColor: Colors.white,
                        alignSelf: "center",
                      }}
                      placeholder={"     /    "}
                      placeholderTextColor={Colors.LIGHT_GREY}
                      value={this.state.valPeriod}
                      refInput={input => {
                        this.validPeriod = input;
                      }}
                      onChangeText={text => {
                        this.setState({
                          valPeriod: text,
                        });
                      }}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        this.cvvInput.focus();
                      }}
                    />
                  </View>
                </VerticalLayout>

                <VerticalLayout style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 13, color: Colors.black }}>{Strings.cvv_cvc}</Text>
                  <View style={{
                    height: 25,
                    borderBottomColor: Colors.LIGHT_GREY,
                    borderBottomWidth: 1,
                    width: 50,
                    marginTop: 10,
                  }}>
                    <TextInput
                      style={{
                        fontSize: 13,
                        paddingVertical: 5,
                        backgroundColor: Colors.white,
                        alignSelf: "center",
                      }}
                      maxLength={3}
                      placeholder={"***"}
                      placeholderTextColor={Colors.LIGHT_GREY}
                      value={this.state.cvv}
                      ref={input => {
                        this.cvvInput = input;
                      }}
                      onChangeText={text => {
                        this.setState({
                          cvv: text,
                        });
                      }}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        this.cardNickInput.focus();
                      }}
                    />
                  </View>

                </VerticalLayout>
                <HorizontalLayout style={{ alignItems: "center", marginTop: 10, marginBottom: 30 }}>
                  <Text style={{ width: 100, fontSize: 14, color: Colors.black }}>{Strings.card_nickname}</Text>
                  <TextInput
                    value={this.state.cardNick}
                    style={{
                      paddingHorizontal: 20,
                      fontSize: 17,
                      paddingVertical: 10,
                      height: 50,
                      backgroundColor: Colors.white_two,
                      flex: 1,
                    }}
                    ref={input => {
                      this.cardNickInput = input;
                    }}
                    onChangeText={text => {
                      this.setState({ cardNick: text });
                    }}
                    placeholder={Strings.card_nick_placeholder}
                    placeholderTextColor={Colors.placeholder_1}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      this.onRegister();
                    }}
                  />
                </HorizontalLayout>
              </ScrollView>
            }
            <Button
              style={[{ width: "100%", height: 50, backgroundColor: Colors.primary }, MyStyles.center]}
              onPress={() => {
                this.onRegister();
              }}
            >
              <Text style={{ fontSize: 16, color: Colors.white }}>{Strings.register_card}</Text>
            </Button>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}
