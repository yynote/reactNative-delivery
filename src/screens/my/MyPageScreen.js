import React, { Component } from "react";
import { Image, Linking, StyleSheet, Text, View } from "react-native";
import { Button, HorizontalLayout, ResizedImage } from "../../components/controls";
import Colors from "../../constants/Colors";
import { MyStyles, Strings } from "../../constants";
import FastImage from "react-native-fast-image";
import { ScrollView } from "react-native-gesture-handler";
import { MyStatusBar } from "../../components/controls/MyStatusBar";
import C, { API_RES_CODE } from "../../constants/AppConstants";
import AskPopup from "../../components/popups/AskPopup";
import GlobalState from "../../mobx/GlobalState";
import PrefUtils from "../../utils/PrefUtils";
import { Net, requestPost } from "../../utils/APIUtils";
import Toast from "react-native-root-toast";

export default class MyPageScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      versionCurrent: GlobalState.app_current_version,
      latest: false,
      image: "",
      logoutConfirm: false,
      newEvent: undefined,
    };
  }


  componentDidMount() {
    this.setState(
      { latest: this.state.versionCurrent === GlobalState.app_last_version });

    requestPost(Net.auth.home_event, {}).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        this.setState({ newEvent: response.data, image: response.data.image });
      } else if (response.result !== -1) {
        Toast.show(response.msg);
      }
    });
  }

  componentWillUnmount() {
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
    PrefUtils.setString(C.ASYNC_PARAM.USER_ID, "");
    PrefUtils.setString(C.ASYNC_PARAM.USER_PWD, "");
    PrefUtils.setString(C.ASYNC_PARAM.LOGIN_TYPE, "");
    PrefUtils.setBool(C.ASYNC_PARAM.AUTO_LOGIN, false);
    this.props.navigation.navigate("Login");
  }

  newApp() {
    if (!this.state.latest) {
      Linking.openURL(GlobalState.storeLink);
    }
  }

  render() {
    return (
      <View style={MyStyles.full}>
        <MyStatusBar theme={"white"} />
        <View style={{ width: "100%" }}>
          <HorizontalLayout
            style={{
              width: "100%",
              height: 50,
              backgroundColor: Colors.white,
            }}>
            <Button
              style={{
                width: 50,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                this.props.onDrawOpen();
              }}
            >
              <ResizedImage
                source={require("src/assets/images/ic_slide.png")}
                style={{ width: 25, height: 25 }}
              />
            </Button>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Text style={{ fontSize: 20, color: Colors.black }}>
                {Strings.my_page}
              </Text>
            </View>
            <Button
              style={{
                width: 50,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                this.props.navigation.navigate("Setting");
              }}
            >
              <ResizedImage
                source={require("src/assets/images/ic_setting.png")}
                style={{ width: 25 }}
              />
            </Button>
          </HorizontalLayout>
        </View>
        <ScrollView style={{ width: "100%" }} showsVerticalScrollIndicator={false}>
          {
            this.state.image !== "" &&
            <Button style={{ width: "100%", height: 120 }} onPress={() => this.props.navigation.navigate({
              routeName: "EventDetail",
              params: { item: this.state.newEvent },
            })}>
              <FastImage source={{ uri: this.state.image }} style={{ width: "100%", height: "100%" }}
                         resizeMode={FastImage.resizeMode.cover} />
            </Button>
          }

          <Button onPress={() => {
            GlobalState.tabIndex = "history";
          }}>
            <HorizontalLayout style={styles.tab}>
              <Text style={styles.tab_text}>{Strings.order_history}</Text>
              <Image source={require("src/assets/images/ic_left.png")} />
            </HorizontalLayout>
          </Button>
          <View style={styles.horizontal_divider} />
          <Button onPress={() => {
            this.props.navigation.navigate("PayManage");
          }}>
            <HorizontalLayout style={styles.tab}>
              <Text style={styles.tab_text}>{Strings.pay_method_history}</Text>
              <Image source={require("src/assets/images/ic_left.png")} />
            </HorizontalLayout>
          </Button>

          <Button onPress={() => {
            this.props.navigation.navigate("Bookmark");
          }}>
            <HorizontalLayout style={[styles.tab, { marginTop: 10 }]}>
              <Text style={styles.tab_text}>{Strings.bookmark}</Text>
              <Image source={require("src/assets/images/ic_left.png")} />
            </HorizontalLayout>
          </Button>
          <View style={styles.horizontal_divider} />
          <Button onPress={() => {
            this.props.navigation.navigate("Review");
          }}>
            <HorizontalLayout style={styles.tab}>
              <Text style={styles.tab_text}>{Strings.my_review}</Text>
              <Image source={require("src/assets/images/ic_left.png")} />
            </HorizontalLayout>
          </Button>

          <Button onPress={() => {
            this.props.navigation.navigate("Notice");
          }}>
            <HorizontalLayout style={[styles.tab, { marginTop: 10 }]}>
              <Text style={styles.tab_text}>{Strings.notice}</Text>
              <Image source={require("src/assets/images/ic_left.png")} />
            </HorizontalLayout>
          </Button>
          <View style={styles.horizontal_divider} />
          <Button onPress={() => {
            this.props.navigation.navigate("Faq");
          }}>
            <HorizontalLayout style={styles.tab}>
              <Text style={styles.tab_text}>{Strings.faq}</Text>
              <Image source={require("src/assets/images/ic_left.png")} />
            </HorizontalLayout>
          </Button>
          <View style={styles.horizontal_divider} />
          <Button onPress={() => {
            this.props.navigation.navigate("Event");
          }}>
            <HorizontalLayout style={styles.tab}>
              <Text style={styles.tab_text}>{Strings.event}</Text>
              <Image source={require("src/assets/images/ic_left.png")} />
            </HorizontalLayout>
          </Button>
          <View style={styles.horizontal_divider} />
          <Button onPress={() => {
            this.props.navigation.navigate("Center");
          }}>
            <HorizontalLayout style={styles.tab}>
              <Text style={styles.tab_text}>{Strings.customer_inquiry}</Text>
              <Image source={require("src/assets/images/ic_left.png")} />
            </HorizontalLayout>
          </Button>

          <Button onPress={() => {
            this.props.navigation.navigate({ routeName: "UserTerm", params: { item: 0 } });
          }}>
            <HorizontalLayout style={[styles.tab, { marginTop: 10 }]}>
              <Text style={styles.tab_text}>{Strings.user_rule}</Text>
              <Image source={require("src/assets/images/ic_left.png")} />
            </HorizontalLayout>
          </Button>
          <View style={styles.horizontal_divider} />
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

          <Button onPress={() => {
          }}>
            <HorizontalLayout style={[styles.tab, { marginTop: 10 }]}>
              <Text style={styles.tab_text}>{Strings.share}</Text>
              <Image source={require("src/assets/images/ic_left.png")} />
            </HorizontalLayout>
          </Button>
          <View style={styles.horizontal_divider} />
          <Button onPress={() => {
            this.props.navigation.navigate("Notification");
          }}>
            <HorizontalLayout style={styles.tab}>
              <Text style={styles.tab_text}>{Strings.notification_set}</Text>
              <Image source={require("src/assets/images/ic_left.png")} />
            </HorizontalLayout>
          </Button>
          <View style={styles.horizontal_divider} />
          <Button onPress={() => {
            this.onLogout();
          }}>
            <HorizontalLayout style={styles.tab}>
              <Text style={styles.tab_text}>{Strings.logout}</Text>
              <Image source={require("src/assets/images/ic_left.png")} />
            </HorizontalLayout>
          </Button>
          <View style={styles.horizontal_divider} />
          <Button onPress={() => {
            this.props.navigation.navigate("Withdrawal");
          }}>
            <HorizontalLayout style={styles.tab}>
              <Text style={{ fontSize: 14, color: Colors.red, flex: 1 }}>{Strings.withdrawal}</Text>
              <Image source={require("src/assets/images/ic_left.png")} />
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

