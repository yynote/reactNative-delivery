import React, { Component } from "react";
import { Image, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, HorizontalLayout, TopBar } from "../components/controls";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { Strings } from "../constants";
import Colors from "../constants/Colors";
import AskPopup from "../components/popups/AskPopup";
import GlobalState from "../mobx/GlobalState";
import C, { API_RES_CODE } from "../constants/AppConstants";
import PrefUtils from "../utils/PrefUtils";

export default class SettingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: GlobalState.me.email,
      versionCurrent: GlobalState.app_current_version,
      latest: false,
      logoutConfirm: false,
    };
  }

  componentDidMount() {
    this.setState(
      { latest: this.state.versionCurrent === GlobalState.app_last_version });
  }

  componentWillUnmount() {
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onLogout() {
    this.setState({ logoutConfirm: true });
  }

  doLogout() {
    GlobalState.tabIndex = "home";
    GlobalState.me.point = 0;
    GlobalState.me.apart = undefined;
    GlobalState.me.delivery_address = undefined;
    GlobalState.me.pwd = "";
    GlobalState.me.uid = 0;
    GlobalState.me.phone = "";
    GlobalState.me.login_type = "";
    GlobalState.me.sns_id = "";
    GlobalState.me.apart_id = "";
    GlobalState.me.name = "";
    GlobalState.order = [];
    GlobalState.total_price = 0;
    GlobalState.product_cnt = 0;
    PrefUtils.setString(C.ASYNC_PARAM.USER_ID, '');
    PrefUtils.setString(C.ASYNC_PARAM.USER_PWD, '');
    PrefUtils.setString(C.ASYNC_PARAM.LOGIN_TYPE, '');
    PrefUtils.setBool(C.ASYNC_PARAM.AUTO_LOGIN, false);
    this.props.navigation.navigate("Login");
  }

  newApp() {
    if (!this.state.latest) {
      if(GlobalState.dev_token === 'android') {
        Linking.openURL(C.APP_URL.playstore);
      } else if (GlobalState.dev_token === 'ios') {
        Linking.openURL(C.APP_URL.appstore);
      }
    }
  }


  render() {
    return (
      <ScrollView style={{ width: "100%" }} showsVerticalScrollIndicator={false}>
        <MyStatusBar theme={"white"} />
        <TopBar
          theme={"white"}
          title={Strings.setting}
          onBackPress={() => {
            this.onBack();
          }} />
        <View style={{ backgroundColor: Colors.white, padding: 20, marginTop: 10 }}>
          <HorizontalLayout>
            <Text style={{ fontSize: 14, color: Colors.black }}>{this.state.id}</Text>
            <Text style={{ fontSize: 14, color: Colors.LIGHT_GREY, marginLeft: 5 }}>{Strings.normal}</Text>
          </HorizontalLayout>
          <Button
            style={{
              width: 100,
              height: 30,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
              borderColor: Colors.red,
              borderWidth: 1,
              marginTop: 15,
            }}
            onPress={() => this.onLogout()}
          >
            <Text style={{ fontSize: 12, color: Colors.black }}>{Strings.logout}</Text>
          </Button>
        </View>


        <View style={{ height: 40, paddingHorizontal: 20, justifyContent: "center" }}>
          <Text style={{ fontSize: 14, color: Colors.black }}>{Strings.rule}</Text>
        </View>

        <Button onPress={() => {
          this.props.navigation.navigate({ routeName: "UserTerm", params: { item: 0 } });
        }}>
          <HorizontalLayout style={styles.tab}>
            <Text style={styles.tab_text}>{Strings.service_rule}</Text>
            <Image source={require("src/assets/images/ic_left.png")} />
          </HorizontalLayout>
        </Button>
        <View style={styles.horizontal_divider} />
        <Button onPress={() => {
          this.props.navigation.navigate({ routeName: "UserTerm", params: { item: 1 } });
        }}>
          <HorizontalLayout style={styles.tab}>
            <Text style={styles.tab_text}>{Strings.privacy_policy}</Text>
            <Image source={require("src/assets/images/ic_left.png")} />
          </HorizontalLayout>
        </Button>
        <View style={styles.horizontal_divider} />
        {/*<Button onPress={() => {*/}
        {/*  this.props.navigation.navigate({ routeName: "UserTerm", params: { item: 3 } });*/}
        {/*}}>*/}
        {/*  <HorizontalLayout style={styles.tab}>*/}
        {/*    <Text style={styles.tab_text}>{Strings.agree_receive_marketing}</Text>*/}
        {/*    <Image source={require("src/assets/images/ic_left.png")} />*/}
        {/*  </HorizontalLayout>*/}
        {/*</Button>*/}
        <View style={styles.horizontal_divider} />
        <Button onPress={() => {
          this.props.navigation.navigate({ routeName: "UserTerm", params: { item: 2 } });
        }}>
          <HorizontalLayout style={styles.tab}>
            <Text style={styles.tab_text}>{Strings.agree_location_service}</Text>
            <Image source={require("src/assets/images/ic_left.png")} />
          </HorizontalLayout>
        </Button>

        <View style={{ height: 40, paddingHorizontal: 20, justifyContent: "center" }}>
          <Text style={{ fontSize: 14, color: Colors.black }}>{Strings.view}</Text>
        </View>
        <Button onPress={() => {
          this.newApp();
        }}>
          <HorizontalLayout style={styles.tab}>
            <Text style={styles.tab_text}>{Strings.version_info}</Text>
            {
              !this.state.latest &&
              <Text style={{ fontSize: 12, color: Colors.red, paddingRight: 10 }}>{Strings.install_latest}</Text>
            }
            <Text style={{ fontSize: 14, color: Colors.black }}>{this.state.versionCurrent}</Text>
          </HorizontalLayout>
        </Button>
        <AskPopup
          visible={this.state.logoutConfirm}
          title={Strings.logout_confirm}
          yes_no={false}
          onCancel={() => this.setState({ logoutConfirm: false })}
          onConfirm={() => {
            this.setState({
              logoutConfirm: false,
            }, () => {
              this.doLogout();
            });
          }}
        />
      </ScrollView>
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
