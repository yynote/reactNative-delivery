import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import { Button } from "./Button";
import { HorizontalLayout, ResizedImage, VerticalLayout } from "./index";
import { MyStyles, Strings } from "../../constants";
import GlobalState from "../../mobx/GlobalState";
import C, { SCREEN_HEIGHT } from "../../constants/AppConstants";
import EventBus from "react-native-event-bus";

export default class SlideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: GlobalState.me.name,
      point: GlobalState.me.point,
    };
  }

  componentDidMount() {
    EventBus.getInstance().addListener(C.EVENT_PARAMS.GLOBAL_CHANGE, this.listener = ({ point }) => {
      this.setState({ point: point });
    });
  }

  render() {
    return (
      <HorizontalLayout style={styles.container}>
        <VerticalLayout style={styles.main_area}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <VerticalLayout>
              {
                GlobalState.me.uid !== 0 &&
                <Button onPress={() => {
                  this.props.onMyPage();
                }}>
                  <HorizontalLayout style={{ alignItems: "center", marginLeft: 20, paddingBottom: 20 }}>
                    <View style={{ width: 70, height: 70, alignItems: "center", justifyContent: "center" }}>
                      <ResizedImage source={require("src/assets/images/img_default_profile.png")}
                                    style={{ height: 60 }} />
                    </View>
                    <VerticalLayout style={{ marginLeft: 5 }}>
                      <Text
                        style={{ fontSize: 16, color: Colors.black, marginLeft: 5 }}>{Strings.hello}{this.state.id}</Text>
                      <Button style={{ padding: 10 }} onPress={() => this.props.onPoint()}>
                        <HorizontalLayout>
                          <Text style={{ fontSize: 12, color: Colors.black }}>{Strings.point}</Text>
                          <Text style={{
                            fontSize: 12,
                            color: Colors.primary,
                            marginLeft: 80,
                          }}>{this.state.point + Strings.$}</Text>
                        </HorizontalLayout>
                      </Button>
                    </VerticalLayout>
                    <Button
                      style={{
                        position: "absolute",
                        right: 10,
                        top: 5,
                        height: 50,
                        width: 50,
                        alignItems: "center",
                      }}
                      onPress={() => this.props.onChangeInfo()}
                    >
                      <ResizedImage source={require("src/assets/images/ic_edit.png")} style={{ height: 20 }} />
                    </Button>
                  </HorizontalLayout>
                </Button>
              }
              {
                GlobalState.me.uid === 0 &&
                <HorizontalLayout style={{ paddingHorizontal: 20 }}>
                  <View style={{ width: 70, height: 70, alignItems: "center", justifyContent: "center" }}>
                    <ResizedImage source={require("src/assets/images/img_default_profile.png")}
                                  style={{ height: 60 }} />
                  </View>
                  <View style={{ flex: 1 }} />
                  <Button style={[{
                    width: 100,
                    height: 40,
                    backgroundColor: Colors.primary,
                    marginTop: 20,
                    marginBottom: 10,
                    borderRadius: 5,
                  }, MyStyles.center]}
                          onPress={() => {
                            this.props.onLogin();
                          }}>
                    <Text style={{ fontSize: 16, color: Colors.white }}>{Strings.login}</Text>
                  </Button>
                </HorizontalLayout>
              }

              <View style={MyStyles.horizontal_divider} />
              <HorizontalLayout style={{ marginTop: 25, marginBottom: 15 }}>
                <Button
                  style={{ width: 100, height: 70, alignItems: "center", justifyContent: "center", flex: 1 }}
                  onPress={() => {
                    this.props.onOrderHistory();
                  }}
                >
                  <ResizedImage source={require("src/assets/images/ic_order_history.png")} style={{ width: 40 }} />
                  <Text style={{ fontSize: 12, color: Colors.black, marginTop: 10 }}>{Strings.order_history}</Text>
                </Button>
                <Button
                  style={{ width: 100, height: 70, alignItems: "center", justifyContent: "center", flex: 1 }}
                  onPress={() => {
                    this.props.onBookmark();
                  }}
                >
                  <ResizedImage source={require("src/assets/images/ic_bookmark.png")} style={{ width: 40 }} />
                  <Text style={{ fontSize: 12, color: Colors.black, marginTop: 10 }}>{Strings.bookmark}</Text>
                </Button>
                <Button
                  style={{ width: 100, height: 70, alignItems: "center", justifyContent: "center", flex: 1 }}
                  onPress={() => {
                    this.props.onMyReview();
                  }}
                >
                  <ResizedImage source={require("src/assets/images/ic_my_review.png")} style={{ width: 40 }} />
                  <Text style={{ fontSize: 12, color: Colors.black, marginTop: 10 }}>{Strings.my_review}</Text>
                </Button>
              </HorizontalLayout>
              <Button onPress={() => this.props.onHome()}
                      style={this.props.selected === 0 ? styles.selected_btn : styles.normal_btn}>
                <HorizontalLayout>
                  <ResizedImage
                    source={this.props.selected === 0 ?
                      require("src/assets/images/ic_slide_home_on.png") :
                      require("src/assets/images/ic_slide_home_off.png")
                    }
                    style={styles.icon}
                  />
                  <Text style={this.props.selected === 0 ? styles.selected_text : styles.normal_text}>
                    {Strings.home}
                  </Text>
                </HorizontalLayout>
              </Button>
              <Button onPress={() => this.props.onNoticeManage()}
                      style={this.props.selected === 1 ? styles.selected_btn : styles.normal_btn}>
                <HorizontalLayout>
                  <ResizedImage
                    source={this.props.selected === 1 ?
                      require("src/assets/images/ic_slide_notice_on.png") :
                      require("src/assets/images/ic_slide_notice_off.png")
                    }
                    style={styles.icon}
                  />
                  <Text style={this.props.selected === 1 ? styles.selected_text : styles.normal_text}>
                    {Strings.notice}
                  </Text>
                </HorizontalLayout>
              </Button>
              <Button onPress={() => this.props.onInquiryManage()}
                      style={this.props.selected === 2 ? styles.selected_btn : styles.normal_btn}>
                <HorizontalLayout>
                  <ResizedImage
                    source={this.props.selected === 2 ?
                      require("src/assets/images/ic_slide_contacts_on.png") :
                      require("src/assets/images/ic_slide_contacts_off.png")
                    }
                    style={styles.icon}
                  />
                  <Text style={this.props.selected === 2 ? styles.selected_text : styles.normal_text}>
                    {Strings.one_inquiry}
                  </Text>
                </HorizontalLayout>
              </Button>
              <Button onPress={() => this.props.onCenterManage()}
                      style={this.props.selected === 3 ? styles.selected_btn : styles.normal_btn}>
                <HorizontalLayout>
                  <ResizedImage
                    source={this.props.selected === 3 ?
                      require("src/assets/images/ic_slide_cs_center_on.png") :
                      require("src/assets/images/ic_slide_cs_center_off.png")
                    }
                    style={styles.icon}
                  />
                  <Text style={this.props.selected === 3 ? styles.selected_text : styles.normal_text}>
                    {Strings.cs_center}
                  </Text>
                </HorizontalLayout>
              </Button>
              <Button onPress={() => this.props.onSettingManage()}
                      style={this.props.selected === 4 ? styles.selected_btn : styles.normal_btn}>
                <HorizontalLayout>
                  <ResizedImage
                    source={this.props.selected === 4 ?
                      require("src/assets/images/ic_slide_settings_on.png") :
                      require("src/assets/images/ic_slide_settings_off.png")
                    }
                    style={styles.icon}
                  />
                  <Text style={this.props.selected === 4 ? styles.selected_text : styles.normal_text}>
                    {Strings.preferences}
                  </Text>
                </HorizontalLayout>
              </Button>
              <View style={styles.spacer} />
              <VerticalLayout style={[MyStyles.center, {marginTop:20, marginBottom: 40}]}>
                <Text style={{ fontSize: 16, color: Colors.black }}>
                  {Strings.delivery_person}
                </Text>
                <Text style={{ fontSize: 12, color: Colors.black, marginTop: 5 }}>
                  {"1234-1234"}
                </Text>
                <Text style={{ fontSize: 11, color: Colors.LIGHT_GREY, marginTop: 5 }}>
                  {`${Strings.weekday} : 09:00 ~ 18:00 / ${Strings.weekends}, ${Strings.holidays}`}
                </Text>
                <Text style={{ fontSize: 11, color: Colors.LIGHT_GREY, marginTop: 5 }}>
                  {`(${Strings.lunch_hour} 12:00 ~ 13:00)`}
                </Text>
              </VerticalLayout>
            </VerticalLayout>
          </ScrollView>
        </VerticalLayout>
        <Button style={{ flex: 1 }} onPress={() => this.props.onClose()} />
      </HorizontalLayout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.transparent,
    height: SCREEN_HEIGHT
  },
  main_area: {
    width: "80%",
    backgroundColor: Colors.white,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 40,
    paddingBottom: 30,
    height: SCREEN_HEIGHT
  },
  selected_btn: {
    height: 55,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    backgroundColor: Colors.slider_selected,
    paddingLeft: 20,
    justifyContent: "center",
    marginTop: 10,
    marginRight: 20,
  },
  normal_btn: {
    height: 55,
    paddingLeft: 20,
    justifyContent: "center",
    marginTop: 10,
  },
  selected_text: {
    marginLeft: 20,
    fontSize: 16,
    color: Colors.primary,
  },
  normal_text: {
    marginLeft: 20,
    fontSize: 16,
    color: Colors.LIGHT_GREY,
    alignSelf: "center",
  },
  icon: {
    width: 25,
    height: 25,
  },
  spacer: {
    height: SCREEN_HEIGHT - 750
  }
});
