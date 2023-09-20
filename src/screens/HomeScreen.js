import React, { Component } from "react";
import { Linking, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { Strings } from "../constants";
import Colors from "../constants/Colors";
import { Button, HorizontalLayout, MainTopBar, ResizedImage } from "../components/controls";
import C, { SCREEN_WIDTH } from "../constants/AppConstants";
import FastImage from "react-native-fast-image";
import Carousel, { Pagination } from "react-native-snap-carousel";
import GlobalState from "../mobx/GlobalState";
import EventBus from "react-native-event-bus";
import AskPopup from "../components/popups/AskPopup";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: (GlobalState.me.delivery_address ===undefined || GlobalState.me.delivery_address === null)?Strings.please_select_address: GlobalState.me.delivery_address.address,
      image: [],
      mainBanner: GlobalState.main_banner,
      activeIndex: 0,
      id: GlobalState.me.name,
      loginConfirm: false
    };

  }

  componentDidMount() {
    let image = [];
    for (let i = 0; i < this.state.mainBanner.length; i++) {
      image.push(this.state.mainBanner[i].image);
    }
    this.setState({ image: image });
    EventBus.getInstance().addListener(C.EVENT_PARAMS.ADDRESS_SELECT, this.listener = ({}) => {
      if (GlobalState.me.delivery_address !== undefined) {
        this.setState({ title: GlobalState.me.delivery_address.address });
      } else {
        this.setState({ title: Strings.please_select_address });
      }
    });

  }

  componentWillUnmount() {
  }

  renderBanners = (image) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Linking.openURL(this.state.mainBanner[this.state.activeIndex].link);
        }}>
        {
          <FastImage source={{ uri: image }} style={{ width: "100%", height: "100%" }}
                     resizeMode={FastImage.resizeMode.cover} />
        }
      </TouchableWithoutFeedback>
    );
  };

  onSearchAddress () {
    if (GlobalState.me.uid === 0) {
      this.setState({loginConfirm: true});
    } else {
      this.props.navigation.navigate("AddressManage")
    }
  }

  render() {
    return (
      <View style={{ height: "100%", width: "100%", backgroundColor: Colors.white_two }}>
        <MyStatusBar theme="white" />
        <MainTopBar
          theme={"white"}
          title={this.state.title}
          isBackIcon={false}
          onBackPress={() => {
            this.props.onDrawOpen();
          }}
          onSearchAddress={() => this.onSearchAddress()}
          onSearchFood={() => this.props.navigation.navigate("SearchFood")}
        />
        <View style={{ width: "100%", flex: 1 }}>
          <Carousel
            activeSlideAlignment="center"
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            data={this.state.image}
            scrollEnabled={true}
            loop={true}
            autoplay={true}
            swipeThreshold={1}
            autoplayInterval={3000}
            sliderWidth={SCREEN_WIDTH}
            itemWidth={SCREEN_WIDTH}
            onSnapToItem={(index) => this.setState({ activeIndex: index })}
            renderItem={({ item, index }) => this.renderBanners(item)}
          />
          <Pagination
            dotsLength={this.state.image.length}
            activeDotIndex={this.state.activeIndex}
            dotContainerStyle={{ height: 20 }}
            containerStyle={styles.pagination_wrapper}
            dotStyle={[styles.pagination_dots, { backgroundColor: Colors.red }]}
            inactiveDotStyle={[styles.pagination_dots, { backgroundColor: Colors.white }]}
            inactiveDotOpacity={1}
            inactiveDotScale={1}
          />
        </View>
        <View style={{ marginTop: 10, backgroundColor: Colors.white }}>
          <View style={{
            backgroundColor: Colors.primary,
            padding: 10,
            width: "60%",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Text style={{ fontSize: 14, color: Colors.white }}>{Strings.select_delivery_type}</Text>
          </View>
          <HorizontalLayout style={{ marginTop: 10, paddingHorizontal: 10 }}>
            <Button
              style={{ height: 170, width: "45%", alignItems: "center", paddingHorizontal:10 }}
              onPress={() => {
                this.props.navigation.navigate("FastDelivery");
              }}
            >
              <ResizedImage source={require("src/assets/images/ic_fast_mode.png")}
                            style={{ width: '100%', height: '85%' }} resizeMode={"contain"}/>
              <Text style={{ fontSize: 15, color: Colors.light_black }}>{Strings.fast_delivery}</Text>
            </Button>
            <Button
              style={{ width: "55%", height: 170, alignItems: "center", paddingHorizontal:10 }}
              onPress={() => {
                this.props.navigation.navigate("FreeDelivery");
              }}
            >
              <HorizontalLayout style={{ width: '100%', height: '85%' }}>
                <ResizedImage source={require("src/assets/images/ic_slow_mode.png")}
                              style={{ width: '100%', height: '100%' }} resizeMode={"contain"}/>
                <View style={{
                  width: 40,
                  height: 18,
                  backgroundColor: Colors.primary,
                  borderRadius: 18,
                  position: "absolute",
                  right: '10%',
                  top: '15%',
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Text style={{ fontSize: 10, color: Colors.white }}>{Strings.best}</Text>
                </View>
              </HorizontalLayout>
              <Text style={{ fontSize: 15, color: Colors.light_black }}>{Strings.slow_delivery}</Text>
            </Button>
          </HorizontalLayout>
        </View>
        <View style={{ height: 1, width: "100%", backgroundColor: Colors.white_two }} />
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

