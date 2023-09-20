import React, { Component } from "react";
import { BackHandler, Text, View } from "react-native";
import { Button, HorizontalLayout, ResizedImage } from "../../components/controls";
import Colors from "../../constants/Colors";
import { Strings } from "../../constants";
import { MyStatusBar } from "../../components/controls/MyStatusBar";
import Toast from "react-native-root-toast";

export default class IntroScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

    this.props.navigation.addListener("willFocus", async () => {
      this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
    });
    this.props.navigation.addListener('willBlur', () => {
      if (this.backHandler != null) {
        this.backHandler.remove();
      }
    });
  }

  componentWillUnmount() {
    if (this.backHandler) {
      try {
        this.backHandler.remove();
      } catch (e) {
        console.log(e);
      }
    }
  }

  onLogin() {
    this.props.navigation.navigate("Login");
  }

  onSignup() {
    this.props.navigation.navigate("Signup");
  }

  handleBackPress() {
    if (this.confirmExit == true) {
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



  render() {
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}>
        <MyStatusBar theme="white" />
        <HorizontalLayout style={{ marginTop: 10 }}>
          <View style={{ flex: 1 }} />
          <Button style={{ padding: 10 }} onPress={() => {
            this.props.navigation.navigate("Main");
          }}>
            <HorizontalLayout style={{
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Text style={{ fontSize: 15, color: Colors.light_black }}>{Strings.look_around}</Text>
              <ResizedImage
                source={require("src/assets/images/ic_left.png")}
                style={{ width: 20 }} />
            </HorizontalLayout>
          </Button>
        </HorizontalLayout>
        <View style={{ marginTop: 60, height: 150, alignItems: "center", justifyContent: "center" }}>
          <ResizedImage
            source={require("src/assets/images/ic_logo_circle.png")}
            style={{ width: 150 }} />
          <Text style={{
            position: "absolute",
            fontSize: 35,
            color: Colors.black,
            textAlign: "center",
            marginLeft: 20,
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
          style={{ width: "100%", height: "65%", position: "absolute", bottom: "-10%", right: "10%" }} />
        <HorizontalLayout style={{ width: "100%", position: "absolute", bottom: 0 }}>
          <Button style={{
            width: "50%",
            height: 50,
            backgroundColor: Colors.white_two,
            alignItems: "center",
            justifyContent: "center",
          }}
                  onPress={() => {
                    this.onLogin();
                  }}>
            <Text style={{ fontSize: 16, color: Colors.LIGHT_GREY }}>{Strings.login}</Text>
          </Button>
          <Button style={{
            width: "50%",
            height: 50,
            backgroundColor: Colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
                  onPress={() => {
                    this.onSignup();
                  }}>
            <Text style={{ fontSize: 16, color: Colors.white }}>{Strings.signup}</Text>
          </Button>
        </HorizontalLayout>
      </View>

    );
  }
}
