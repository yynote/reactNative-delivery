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
import { TopBar } from "../../components/controls";
import { MyStyles, Strings, TextStyles } from "../../constants";
import { ScrollView } from "react-native-gesture-handler";
import { Button, HorizontalLayout, MyDropdown, ResizedImage, TabBar, VerticalLayout } from "../../components/controls";
import Toast from "react-native-root-toast";
import Common from "../../utils/Common";
import { Net, requestPost } from "../../utils/APIUtils";
import { API_RES_CODE } from "../../constants/AppConstants";

export default class FindScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      email: "",
      afterFix: "",
      phone: "",
      title: this.props.navigation.getParam("item") ? Strings.find_pwd : Strings.find_pwd,
      tab_index: this.props.navigation.getParam("item")? this.props.navigation.getParam("item"):0,
      emailType: 0,
      idResult: "",
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

  }

  componentWillUnmount() {
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onConfirm() {
    let { id, phone } = this.state;
    if (this.state.tab_index === 0 && this.state.idResult !== '') {
      this.props.navigation.goBack();
    }
    if (this.state.tab_index === 0) {
      if (phone === "") {
        Toast.show(Strings.phone_placeholder);
        return;
      }
      requestPost(Net.home.find_id, { phone: this.state.phone}).then(response => {
        if (response.result === API_RES_CODE.SUCCESS) {
          this.setState({
            idResult: response.data,
          });
        } else {
          Toast.show(response.msg);
        }
      });

    } else {
      if (id === "") {
        Toast.show(Strings.enter_email);
        return;
      } else if (!Common.check_validation_email(id)) {
        Toast.show(Strings.enter_correct_email);
        return
      }
      if (phone === "") {
        Toast.show(Strings.phone_placeholder);
        return;
      }
      requestPost(Net.home.find_password, { email: this.state.id, phone: this.state.phone}).then(response => {
        if (response.result === API_RES_CODE.SUCCESS) {
          Toast.show(Strings.pwd_sent);
          this.onBack();
        } else {
          Toast.show(response.msg);
        }
      });

    }
  }

  onChangeAfterFix(id) {
    switch (id) {
      case 0:
        this.setState({
          emailType: id,
          afterFix: "",
        });
        break;
      case 1:
        this.setState({
          emailType: id,
          afterFix: "google.com",
        });
        break;
      case 2:
        this.setState({
          emailType: id,
          afterFix: "apple.com",
        });
        break;
      case 3:
        this.setState({
          emailType: id,
          afterFix: "yahoo.com",
        });
        break;
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ width: "100%", height: "100%", backgroundColor: Colors.white }} behavior={Platform.OS === "ios" ? "padding" : ""}>
        <MyStatusBar theme="white" />
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <View style={MyStyles.full}>
            <TopBar
              theme={"white"}
              title={this.state.title}
              onBackPress={() => {
                this.onBack();
              }}
            />
            <TabBar
              tab_index={this.state.tab_index}
              tab_count={2}
              textStyle={{fontSize:16}}
              titles={[Strings.find_id, Strings.find_pwd]}
              onClick={(id) => {
                this.setState({
                  tab_index: id,
                  title: id === 0 ? Strings.find_id : Strings.find_pwd,
                });
              }}
            />
            {
              this.state.tab_index === 0 && this.state.idResult !== "" &&
              <VerticalLayout style={[MyStyles.center, { flex: 1 }]}>
                <ResizedImage
                  source={require("src/assets/images/ic_search.png")}
                  style={{ width: 50 }} />
                <Text style={{ marginTop: 20, fontSize: 20, color: Colors.black }}>
                  {Strings.your_id_is}
                </Text>
                <Text style={{ fontSize: 20, color: Colors.black }}>
                  {this.state.idResult}
                </Text>
              </VerticalLayout>
            }
            {
              (this.state.tab_index === 1 || (this.state.idResult === "" && this.state.tab_index === 0)) &&
              <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>
                  {Strings.enter_information}
                </Text>
                {
                  this.state.tab_index === 1 &&
                  <View style={[MyStyles.input_back, { marginTop: 20 }]}>
                    <TextInput
                      value={this.state.id}
                      style={[TextStyles.TEXT_STYLE_14, {
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                      }]}
                      ref={input => {
                        this.idTextInput = input;
                      }}
                      onChangeText={text => {
                        this.setState({ id: text });
                      }}
                      placeholder={Strings.ID}
                      placeholderTextColor={Colors.LIGHT_GREY}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        this.phoneTextInput.focus();
                      }}
                    />
                  </View>
                }
                <HorizontalLayout style={{ marginTop: this.state.tab_index === 0 ? 20 : 0, display:"none"}}>
                  <View style={[MyStyles.input_back, { flex: 1 }]}>
                    <TextInput
                      value={this.state.email}
                      style={[TextStyles.TEXT_STYLE_14, {
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                      }]}
                      ref={input => {
                        this.emailTextInput = input;
                      }}
                      onChangeText={text => {
                        this.setState({ email: text });
                      }}
                      placeholder={Strings.email}
                      placeholderTextColor={Colors.LIGHT_GREY}
                      keyboardType={"email-address"}
                      returnKeyType="next"
                      onSubmitEditing={() => {

                      }}
                    />
                  </View>
                  <Text style={styles.mark}>{"@"}</Text>
                  <View style={[MyStyles.input_back, { flex: 1 }]}>
                    <TextInput
                      value={this.state.afterFix}
                      style={[TextStyles.TEXT_STYLE_14, {
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                      }]}
                      editable={this.state.emailType === 0}
                      ref={input => {
                        this.afterFixTextInput = input;
                      }}
                      onChangeText={text => {
                        this.setState({ afterFix: text });
                      }}
                      placeholder={""}
                      placeholderTextColor={Colors.LIGHT_GREY}
                      returnKeyType="next"
                      onSubmitEditing={() => {

                      }}
                    />
                  </View>
                  <MyDropdown
                    style={{ marginTop: 15, marginLeft: 10, flex: 1 }}
                    options={this.emailTypes}
                    defaultIndex={0}
                    defaultValue={Strings.direct_input}
                    onSelect={(rowData, idx) => {
                      this.onChangeAfterFix(idx);
                    }}
                  />
                </HorizontalLayout>
                <View style={[MyStyles.input_back, { marginTop: 15, flex: 1 }]}>
                  <TextInput
                    value={this.state.phone}
                    style={[TextStyles.TEXT_STYLE_14, {
                      paddingHorizontal: 10,
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
                      this.onConfirm();
                    }}
                  />
                </View>
              </ScrollView>
            }
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
