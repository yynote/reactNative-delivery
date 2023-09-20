import React, { Component } from "react";
import { Text, View } from "react-native";
import { Button, HorizontalLayout, ResizedImage, TopBar } from "../../components/controls";
import Colors from "../../constants/Colors";
import { Strings } from "../../constants";
import { MyStatusBar } from "../../components/controls/MyStatusBar";
import AskPopup from "../../components/popups/AskPopup";
import GlobalState from "../../mobx/GlobalState";

export default class InquiryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginConfirm: false
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white_two }}>
        <MyStatusBar theme="white"/>
        <TopBar
          title={Strings.inquiry1}
          onBackPress={() => {
            this.props.navigation.goBack();
          }} />
        <View style={{ height: "100%" }}>
          <Button style={{
            height: 50,
            paddingHorizontal: 20,
            backgroundColor: Colors.white,
            borderBottomColor: Colors.white_two,
            borderBottomWidth: 1,
          }}
                  onPress={() => {
                    this.props.navigation.navigate("Faq");
                  }}
          >
            <HorizontalLayout style={{ alignItems: "center", paddingTop: 12 }}>
              <Text style={{ flex: 1, fontSize: 14, color: Colors.black }}>{Strings.faq}</Text>
              <ResizedImage source={require("src/assets/images/ic_left.png")} />
            </HorizontalLayout>
          </Button>
          <Button style={{
            height: 50,
            paddingHorizontal: 20,
            backgroundColor: Colors.white,
          }}
                  onPress={() => {
                    if (GlobalState.me.uid === 0) {
                      this.setState({loginConfirm: true});
                    } else {
                      this.props.navigation.navigate("Center");
                    }
                  }}
          >
            <HorizontalLayout style={{ alignItems: "center", paddingTop: 12 }}>
              <Text style={{ flex: 1, fontSize: 14, color: Colors.black }}>{Strings.inquiry}</Text>
              <ResizedImage source={require("src/assets/images/ic_left.png")} />
            </HorizontalLayout>
          </Button>
          <View style={{ alignItems: "center", justifyContent: "flex-end", flex: 1, marginBottom:100 }}>
            <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY }}>{Strings.cs_center}</Text>
            <Text style={{ fontSize: 24, color: Colors.LIGHT_GREY, marginVertical: 20 }}>1000 - 1000</Text>
            <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY }}>{Strings.weekdays}</Text>
          </View>
          <AskPopup
            visible={this.state.loginConfirm}
            title={Strings.login_confirm}
            yes_no={false}
            onCancel={() => this.setState({ loginConfirm: false })}
            onConfirm={() => {
              this.setState({
                loginConfirm: false,
              }, () => {
                this.props.navigation.navigate("Login")
              });
            }}
          />
        </View>
      </View>
    );
  }
}
