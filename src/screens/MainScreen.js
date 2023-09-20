import { observer } from "mobx-react";
import React, { Component } from "react";
import { BackHandler, Linking, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";
import EventBus from "react-native-event-bus";
import Strings from "../constants/Strings";
import C from "../constants/AppConstants";
import Colors from "../constants/Colors";
import { Button, ResizedImage } from "../components/controls";
import GlobalState from "../mobx/GlobalState";
import { TextStyles } from "../constants";
import HomeScreen from "./HomeScreen";
import SlideMenu from "../components/controls/SlideMenu";
import Drawer from "react-native-drawer";
import OrderHistoryScreen from "./OrderHistoryScreen";
import MyPageScreen from "./my/MyPageScreen";
import AskPopup from "../components/popups/AskPopup";


@observer
export default class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuSelected: 0,
      loginConfirm: false,
      drawerOpen: false,
    };
    this.handleBackPress = this.handleBackPress.bind(this);
  }

  componentDidMount() {
    this.props.navigation.addListener("willFocus", async () => {
      this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
    });

    this.props.navigation.addListener("willBlur", () => {
      if (this.backHandler != null) {
        this.backHandler.remove();
      }
    });


    EventBus.getInstance().addListener(C.EVENT_PARAMS.TOKEN_EXPIRED, this.listener = (data) => {
      Toast.show(Strings.token_expired);
      this.props.navigation.navigate("Login");
    });

    Linking.getInitialURL().then(url => {
      if (url != null) {
        this.handleKakaoLink({ url: url });
      }
    });

    Linking.addEventListener("url", this.handleKakaoLink);
  }

  componentWillUnmount() {
    Linking.removeEventListener("url", this.handleKakaoLink);
    EventBus.getInstance().removeListener(this.listener);
    if (this.backHandler) {
      try {
        this.backHandler.remove();
      } catch (e) {
        console.log(e);
      }
    }
  }

  handleBackPress() {
    if (this.state.drawerOpen) {
      this.setState({ drawerOpen: false });
    } else {
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
    }
    return true;
  }

  handleKakaoLink = (event) => {
    try {
      var url = event.url;
      var queryParams = url.split("?")[1];
      var paramList = queryParams.split("&");
      var designerId = 0;
      if (paramList.find(it => it.includes(C.SHARE_LINK_PARAMS.DESIGNER_ID)) != undefined) {
        designerId = paramList.find(it => it.includes(C.SHARE_LINK_PARAMS.DESIGNER_ID)).split("=")[1];
      }
      if (designerId != 0) {
        this.props.navigation.navigate({
          routeName: "DesignerDetail",
          params: { [C.NAVIGATION_PARAMS.DESIGNER_ID]: designerId },
          key: designerId,
        });
      }
    } catch (error) {
    }
  };

  onPoint() {
    this.props.navigation.navigate("Point");
    this.setState({ drawerOpen: false });

  }

  onHome() {
    GlobalState.tabIndex = "home";
    this.setState({ drawerOpen: false });
  }

  onNoticeManage() {
    this.props.navigation.navigate("Notice");
    this.setState({ drawerOpen: false });
  }

  onInquiryManage() {
    this.props.navigation.navigate("Inquiry");
    this._drawer.close();
  }

  onCenterManage() {
    if (GlobalState.me.uid === 0) {
      this.setState({ loginConfirm: true, drawerOpen: false});
    } else {
      this.props.navigation.navigate("Center");
      this.setState({ drawerOpen: false });
    }
  }

  onSettingManage() {
    if (GlobalState.me.uid === 0) {
      this.setState({ loginConfirm: true, drawerOpen: false });
    } else {
      this.props.navigation.navigate("Setting");
      this.setState({ drawerOpen: false });
    }
  }

  onMyPage() {
    this.setState({ drawerOpen: false });
    GlobalState.tabIndex = "profile";
  }

  onMyReview() {
    if (GlobalState.me.uid === 0) {
      this.setState({ loginConfirm: true, drawerOpen: false });
    } else {
      this.setState({ drawerOpen: false });
      this.props.navigation.navigate("Review");
    }

  }

  onChangeInfo() {
    this.setState({ drawerOpen: false });
    this.props.navigation.navigate("ChangeInfo");
  }

  onOrderHistory() {
    if (GlobalState.me.uid === 0) {
      this.setState({ loginConfirm: true, drawerOpen: false });
    } else {
      this.setState({ drawerOpen: false });
      GlobalState.tabIndex = "history";
    }
  }

  onBookmark() {
    if (GlobalState.me.uid === 0) {
      this.setState({ loginConfirm: true, drawerOpen: false });
    } else {
      this.setState({ drawerOpen: false });
      this.props.navigation.navigate("Bookmark");
    }
  }

  onLogin() {
    this.props.navigation.navigate("Login");
  }

  render() {
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="overlay"
        open={this.state.drawerOpen}
        content={
          <SlideMenu
            selected={this.state.menuSelected}
            onLogin={() => this.onLogin()}
            onHome={() => this.onHome()}
            onMyPage={() => this.onMyPage()}
            onPoint={() => this.onPoint()}
            onChangeInfo={() => this.onChangeInfo()}
            onOrderHistory={() => this.onOrderHistory()}
            onBookmark={() => this.onBookmark()}
            onMyReview={() => this.onMyReview()}
            onNoticeManage={() => this.onNoticeManage()}
            onInquiryManage={() => this.onInquiryManage()}
            onCenterManage={() => this.onCenterManage()}
            onSettingManage={() => this.onSettingManage()}
            onClose={() => {
              this.setState({ drawerOpen: false });
            }}
          />
        }
        tapToClose={true}
        side={"left"}
        openDrawerOffset={0} // 20% gap on the right side of drawer
        panCloseMask={0}
        closedDrawerOffset={-3}
        styles={{
          drawer: { shadowColor: Colors.black, shadowOpacity: 1, shadowRadius: 3 },
          main: { paddingLeft: 3 },
        }}
        tweenHandler={(ratio) => ({
          main: { opacity: (2 - ratio) / 2 },
        })}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {GlobalState.tabIndex === "home" &&
            <HomeScreen navigation={this.props.navigation}
                        onDrawOpen={() => {
                          this.setState({ drawerOpen: true });
                        }} />
            }
            {GlobalState.tabIndex === "history" &&
            <OrderHistoryScreen navigation={this.props.navigation}
                                onDrawOpen={() => {
                                  this.setState({ drawerOpen: true });
                                }} />}
            {GlobalState.tabIndex === "profile" &&
            <MyPageScreen navigation={this.props.navigation}
                          onDrawOpen={() => {
                            this.setState({ drawerOpen: true });
                          }} />}
          </View>
          <SafeAreaView
            style={{ height: 60, flexDirection: "row", backgroundColor: Colors.white, alignItems: "center" }}>
            <Button
              style={styles.tab_btn}
              onPress={() => {
                GlobalState.tabIndex = "home";
              }}>
              <View>
                <ResizedImage
                  source={GlobalState.tabIndex === "home" ?
                    require("src/assets/images/ic_menu_home_on.png") :
                    require("src/assets/images/ic_menu_home_off.png")}
                  style={{ height: 20 }}

                />
              </View>
              <Text style={[TextStyles.TEXT_STYLE_10, { color: Colors.tab_home }]}>{Strings.home}</Text>
            </Button>
            <Button
              style={styles.tab_btn}
              onPress={() => {
                if (GlobalState.me.uid === 0) {
                  this.setState({ loginConfirm: true });
                } else {
                  GlobalState.tabIndex = "history";
                }
              }}>
              <View>
                <ResizedImage
                  source={GlobalState.tabIndex === "history" ?
                    require("src/assets/images/ic_menu_file_on.png") :
                    require("src/assets/images/ic_menu_file_off.png")}
                  style={{ height: 20 }}
                />
              </View>
              <Text style={[TextStyles.TEXT_STYLE_10, { color: Colors.tab_home }]}>{Strings.history}</Text>
            </Button>
            <Button
              style={styles.tab_btn}
              onPress={() => {
                if (GlobalState.me.uid === 0) {
                  this.setState({ loginConfirm: true });
                } else {
                  GlobalState.tabIndex = "profile";
                }
              }}>
              <View>
                <ResizedImage
                  source={GlobalState.tabIndex === "profile" ?
                    require("src/assets/images/ic_menu_user_on.png") :
                    require("src/assets/images/ic_menu_user_off.png")}
                  style={{ height: 20 }}
                />
              </View>
              <Text style={[TextStyles.TEXT_STYLE_10, { color: Colors.tab_home }]}>{Strings.profile}</Text>
            </Button>
          </SafeAreaView>
          <AskPopup
            visible={this.state.loginConfirm}
            title={Strings.login_confirm}
            yes_no={false}
            onCancel={() => this.setState({ loginConfirm: false })}
            onConfirm={() => {
              this.setState({
                loginConfirm: false,
              }, () => {
                this.props.navigation.navigate("Login");
              });
            }}
          />
        </View>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  carousel_wrapper: {
    marginHorizontal: 0,
    height: 220,
    backgroundColor: "#ebfcf9",
    alignSelf: "stretch",
    overflow: "hidden",
  },
  pagination_wrapper: { position: "absolute", width: "100%", bottom: 0, paddingVertical: 0 },
  pagination_dots: { marginHorizontal: -8 },
  tab_btn: {
    height: 60,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
