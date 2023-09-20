import React, { Component } from "react";
import { FlatList, Linking, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { MyStyles, Strings, TextStyles } from "../constants";
import Colors from "../constants/Colors";
import { HorizontalLayout, MainTopBar } from "../components/controls";
import { FoodCateItem } from "../components/items";
import FastImage from "react-native-fast-image";
import C, { API_RES_CODE, SCREEN_WIDTH } from "../constants/AppConstants";
import Carousel from "react-native-snap-carousel";
import { Net, requestPost } from "../utils/APIUtils";
import Toast from "react-native-root-toast";
import GlobalState from "../mobx/GlobalState";
import EventBus from "react-native-event-bus";
import AskPopup from "../components/popups/AskPopup";

export default class FastDeliveryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      image: [],
      categoryBanner: GlobalState.category_banner,
      title: (GlobalState.me.delivery_address === undefined || GlobalState.me.delivery_address === null) ? Strings.please_select_address : GlobalState.me.delivery_address.address,
      loginConfirm: false
    };
  }

  componentDidMount() {
    let image = [];
    for (let i = 0; i < this.state.categoryBanner.length; i++) {
      image.push(this.state.categoryBanner[i].image);
    }
    this.setState({ image: image });
    this.loadCategoryList();
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

  loadCategoryList() {
    requestPost(Net.home.category_list, {}).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        this.setState({ categoryList: response.data });
        GlobalState.categoryList = response.data;
      } else {
        Toast.show(response.msg);
      }
    });
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onSearchAddress () {
    if (GlobalState.me.uid === 0) {
      this.setState({loginConfirm: true});
    } else {
      this.props.navigation.navigate("AddressManage")
    }
  }

  renderBanners = (image) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Linking.openURL(this.state.categoryBanner[this.state.activeIndex].link);
        }}>
        {
          <FastImage source={{ uri: image }} style={{ width: "100%", height: "100%" }}
                     resizeMode={FastImage.resizeMode.cover} />
        }
      </TouchableWithoutFeedback>
    );
  };

  render() {
    return (
      <View style={[MyStyles.full, { backgroundColor: Colors.white }]}>
        <MyStatusBar theme="white" />
        <MainTopBar
          theme={"white"}
          title={this.state.title}
          isBackIcon={true}
          onBackPress={() => {
            this.onBack();
          }}
          onSearchAddress={() => this.onSearchAddress()}
          onSearchFood={() => this.props.navigation.navigate("SearchFood")} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {
            this.state.image.length !== 0 &&
            <HorizontalLayout style={{ height: 150, width: "100%" }}>
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
                renderItem={({ item, idx }) => this.renderBanners(item)}
              />
              <View style={styles.banner_index}>
                <Text style={{
                  fontSize: 12,
                  color: Colors.white,
                }}>{this.state.activeIndex + 1}/{this.state.image.length}</Text>
              </View>
            </HorizontalLayout>
          }
          <FlatList
            showsVerticalScrollIndicator={false}
            data={this.state.categoryList}
            style={{ paddingHorizontal: 20, marginBottom: 50 }}
            numColumns={3}
            renderItem={({ item, index }) => (
              <FoodCateItem
                numColumns={3}
                item={item}
                onPress={() => this.props.navigation.navigate({ routeName: "Store", params: { item: item.uid } })}
              />
            )}
            refreshing={this.state.isRefreshing}
            // onRefresh={() => this.handleLoadMore(true)}
            // onEndReached={() => this.handleLoadMore(false)}
            onEndReachedThreshold={0.1}
            ListEmptyComponent={this.state.showEmptyUI && (
              <View style={{
                width: "100%",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 250,
              }}>
                <Text style={TextStyles.TEXT_STYLE_14}>{Strings.no_item}</Text>
              </View>
            )}
            keyExtractor={(item, index) => {
              index.toString();
            }}
          />
        </ScrollView>
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
  banner_index: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.black_40,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 15,
    right: 20,
  },
});
