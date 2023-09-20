import React, { Component } from "react";
import { FlatList, Linking, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { MyStyles, Strings, TextStyles } from "../constants";
import Colors from "../constants/Colors";
import { Button, HorizontalLayout, ResizedImage, StarRatingCustom, VerticalLayout } from "../components/controls";
import FastImage from "react-native-fast-image";
import C, { API_RES_CODE, IMAGE_FOO_URL, SCREEN_WIDTH } from "../constants/AppConstants";
import Carousel from "react-native-snap-carousel";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { DetailReviewItem } from "../components/items";
import GlobalState from "../mobx/GlobalState";
import { Net, requestPost } from "../utils/APIUtils";
import Toast from "react-native-root-toast";
import EventBus from "react-native-event-bus";
import moment from "moment";
import Common from "../utils/Common";

export default class DetailScreen extends Component {
  constructor(props) {
    super(props);
    this.shop_uid = this.props.navigation.getParam("shop_uid");
    this.type = this.props.navigation.getParam("type");
    this.state = {
      starNum: Number(GlobalState.shop_detail.starNum),
      image: GlobalState.shop_detail.image,
      activeIndex: 0,
      bigTab: 0,
      detailOrderInfo: GlobalState.shop_detail.detailOrderInfo,
      smallTabList: [],
      productList: [],
      productCnt: GlobalState.product_cnt,
      title: GlobalState.shop_detail.shopName,
      reviewName: "",
      reviewList: [],
      isRefreshing: false,
      storePhone: GlobalState.shop_detail.storePhone,
      fee: GlobalState.shop_detail.fee,
      minOrder: GlobalState.shop_detail.minOrder,
      reviewCnt: GlobalState.shop_detail.reviewCnt,
      reviewBossCnt: GlobalState.shop_detail.reviewBossCnt,
      shopName: GlobalState.shop_detail.shopName,
      likeCnt: GlobalState.shop_detail.likeCnt,
      limit: 10,
      offset: 0,
      showEmptyUI: false,
      intro: GlobalState.shop_detail.intro,
      deliveryArea: GlobalState.shop_detail.deliveryArea,
      operatingTime: JSON.parse(GlobalState.shop_detail.operatingTime),
      holiday: GlobalState.shop_detail.holiday,
      shopPosition: GlobalState.shop_detail.shopPosition,
      representative: GlobalState.shop_detail.representative,
      businessName: GlobalState.shop_detail.businessName,
      businessAddress: GlobalState.shop_detail.businessAddress,
      companyNumber: GlobalState.shop_detail.companyNumber,
      showEmptyReview: false,
      is_like: GlobalState.shop_detail.is_like,
      totalPrice: GlobalState.total_price,
      limitReview: 10,
      offsetReview: 0,
    };
  }

  componentDidMount() {
    this.loadSmallTabList();
    this.loadProductList(0);
    this.loadReviewList();
    EventBus.getInstance().addListener(C.EVENT_PARAMS.REVIEW_ADD, this.listener = ({}) => {
      this.setState({ reviewList: [] }, () => {
        this.loadReviewList();
      });
    });
    EventBus.getInstance().addListener(C.EVENT_PARAMS.ORDER_ADD, this.listener = ({}) => {
      this.setState({
        productCnt: GlobalState.product_cnt,
        totalPrice: GlobalState.total_price,
      });
    });
    if (this.type === undefined) {
      GlobalState.order = [];
      GlobalState.total_price = 0;
      GlobalState.product_cnt = 0;
      this.setState({
        totalPrice: GlobalState.total_price,
        productCnt: GlobalState.product_cnt,
      });
    }
  }

  componentWillUnmount() {
  }

  loadSmallTabList() {
    let list = [];
    for (let i = 0; i < GlobalState.categoryList.length; i++) {
      list.push({
        tab_name: GlobalState.categoryList[i].name,
        selected: false,
        uid: GlobalState.categoryList[i].uid,
      });
    }
    list.unshift({ tab_name: Strings.all, uid: 0, selected: true });
    this.setState({ smallTabList: list });
  }

  loadProductList(uid) {
    requestPost(Net.home.product_list, {
      access_token: GlobalState.access_token,
      category_uid: parseInt(uid),
      shop_uid: this.shop_uid,
      order_by: "",
      latitude: GlobalState.myLatitude,
      longitude: GlobalState.myLongitude,
    }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        let resultList = [];
        for (let i = 0; i < response.data.list.length; i++) {
          resultList.push({
            img: response.data.list[i].image,
            name: response.data.list[i].name,
            price: response.data.list[i].min_price,
            option: response.data.list[i].option,
            optionType: response.data.list[i].option_type,
            selectOption: response.data.list[i].select_option,
            basePrice: response.data.list[i].base_price,
            code: response.data.list[i].code,
          });
        }
        this.noMoreData = false;
        this.setState({ productList: resultList, isRefreshing: false }, () => {
          this.setState({
            showEmptyUI: this.state.productList.length === 0,
            offset: this.state.productList.length,
          });
        });
        this.noMoreData = response.data.list.length < this.state.limit;
      } else {
        Toast.show(response.msg);
      }
    });
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onLike() {
    let { is_like } = this.state;
    requestPost(Net.home.like, {
      access_token: GlobalState.access_token,
      shop_uid: this.shop_uid,
      like: Math.abs(is_like - 1),
    }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        this.setState({ is_like: Math.abs(is_like - 1) });
        GlobalState.shop_detail.is_like = Math.abs(is_like - 1);
        EventBus.getInstance().fireEvent(C.EVENT_PARAMS.BOOKMARK_CHANGE, {});
      } else {
        Toast.show(response.msg);
      }
    });
  }

  onProduct(item) {
    let day = moment(Common.now()).day();
    let timeNow = moment(Common.now()).hour();
    let operatingTime = this.state.operatingTime.map((time) => {
      return time;
    });
    operatingTime.pop();
    operatingTime.unshift(this.state.operatingTime[this.state.operatingTime.length - 1]);
    let workTime = operatingTime[day].split("~").map((time) => {
      return parseInt(time.split(":")[0]);
    });
    if (timeNow > workTime[1] || timeNow < workTime[0]) {
      Toast.show(Strings.not_worktime);
    } else {
      this.props.navigation.navigate({ routeName: "Order", params: { product: item } });
    }
  }

  handleLoadMore = (clear) => {
    if (clear) {    // onRefresh
      this.noMoreData = false;
      this.setState({
        isRefreshing: clear,
        reviewList: [],
        offset: 0,
      }, () => {
        this.loadReviewList();
      });
    } else {        // onEndReached
      if (!this.noMoreData) {
        this.loadReviewList();
      }
    }
  };

  loadReviewList() {
    requestPost(Net.home.shop_detail, {
      access_token: GlobalState.access_token,
      shop_uid: this.shop_uid,
    }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        this.setState({
          reviewList: this.state.reviewList.length === 0 ? response.data.review_list : [...this.state.reviewList, ...response.data.review_list],
          isRefreshing: false,
        }, () => {
          this.setState({
            showEmptyReview: this.state.reviewList.length === 0,
            // offset: this.state.reviewList.length,
          });
        });
      } else {
        Toast.show(response.msg);
      }
    });
  }

  renderBanners = (image) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
        }}>
        {
          <FastImage source={{ uri: image }} style={{ width: "100%", height: "100%" }}
                     resizeMode={FastImage.resizeMode.cover} />
        }
      </TouchableWithoutFeedback>
    );
  };

  onSmTab(index) {
    let { smallTabList } = this.state;
    for (let i = 0; i < smallTabList.length; i++) {
      smallTabList[i].selected = i === index;
    }
    this.setState({ smallTabList: smallTabList });
    this.loadProductList(smallTabList[index].uid);
  }

  render() {
    return (
      <View style={[MyStyles.full, { backgroundColor: Colors.white_detail }]}>
        {
          this.state.bigTab === 0 &&
          <View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ height: 260, width: "100%" }}>
                <HorizontalLayout style={{ height: 200, width: "100%" }}>
                  <Carousel
                    activeSlideAlignment="center"
                    inactiveSlideScale={1}
                    inactiveSlideOpacity={1}
                    data={this.state.image.split("#")}
                    scrollEnabled={true}
                    loop={true}
                    autoplay={true}
                    swipeThreshold={1}
                    autoplayInterval={3000}
                    sliderWidth={SCREEN_WIDTH}
                    itemWidth={SCREEN_WIDTH}
                    onSnapToItem={(index) => this.setState({ activeIndex: index })}
                    renderItem={({ item }) => this.renderBanners(item)}
                  />
                  <View style={styles.banner_index}>
                    <Text style={{
                      fontSize: 12,
                      color: Colors.white,
                    }}>{this.state.activeIndex + 1}/{this.state.image.split("#").length}</Text>
                  </View>
                </HorizontalLayout>
                <VerticalLayout style={styles.name_area}>
                  <Text style={{
                    fontSize: 20,
                    color: Colors.black,
                    marginTop: 15,
                    marginBottom: 10,
                  }}>{this.state.shopName}</Text>
                  <StarRatingCustom
                    emptyStar={require("src/assets/images/ic_star_grey.png")}
                    fullStar={require("src/assets/images/ic_star_red_small.png")}
                    halfStar={require("src/assets/images/ic_star_red_half.png")}
                    buttonStyle={{ paddingHorizontal: 3 }}
                    starCnt={this.state.starNum}
                    size={20}
                    onClick={(index) => {
                      this.setState({ starNum: index });
                    }}
                    disabled={true}
                  />
                  <HorizontalLayout style={{ marginTop: 10, alignItems: "center" }}>
                    <Text style={{ fontSize: 14, color: Colors.black, marginRight: 5 }}>{Strings.recent_review}</Text>
                    <Text style={{ fontSize: 14, color: Colors.black, marginRight: 10 }}>{this.state.reviewCnt}</Text>
                    <Text style={{ fontSize: 20, color: Colors.black, marginRight: 10 }}>|</Text>
                    <Text
                      style={{ fontSize: 14, color: Colors.black, marginRight: 5 }}>{Strings.recent_boss_review}</Text>
                    <Text
                      style={{ fontSize: 14, color: Colors.black, marginRight: 5 }}>{this.state.reviewBossCnt}</Text>
                  </HorizontalLayout>
                </VerticalLayout>

              </View>
              {/*<HorizontalLayout style={{ marginTop: 35, paddingHorizontal: 20 }}>*/}
              {/*  <Text style={[styles.status, { backgroundColor: Colors.primary }]}>{Strings.deliverable}</Text>*/}
              {/*  <Text style={[styles.status, { backgroundColor: Colors.yellow_two }]}>{Strings.packable}</Text>*/}
              {/*  <Text style={[styles.status, { backgroundColor: Colors.green }]}>{Strings.gift_card}</Text>*/}
              {/*  <View style={{ flex: 1 }} />*/}
              {/*  <Text style={{*/}
              {/*    color: Colors.red,*/}
              {/*    borderRadius: 3,*/}
              {/*    borderColor: Colors.red,*/}
              {/*    borderWidth: 1,*/}
              {/*    height: 22,*/}
              {/*    alignItems: "center",*/}
              {/*    paddingTop: 3,*/}
              {/*    justifyContent: "center",*/}
              {/*    fontSize: 12,*/}
              {/*    paddingHorizontal: 5,*/}
              {/*  }}>{Strings.store_original}</Text>*/}
              {/*</HorizontalLayout>*/}
              <VerticalLayout style={{ width: "100%" }}>
                <HorizontalLayout style={{ marginTop: 35, paddingHorizontal: 20 }}>
                  <Text style={{ fontSize: 12, color: Colors.black, width: 100 }}>{Strings.fee}</Text>
                  <Text style={{ fontSize: 12, color: Colors.black, width: 70 }}>{this.state.fee}</Text>
                  <Button>
                    <Text style={{
                      fontSize: 12,
                      color: Colors.LIGHT_GREY,
                      textDecorationLine: "underline",
                      textDecorationColor: Colors.LIGHT_GREY,
                    }}>{Strings.detail}</Text>
                  </Button>
                </HorizontalLayout>
                <HorizontalLayout style={{ marginTop: 5, paddingHorizontal: 20 }}>
                  <Text style={{ fontSize: 12, color: Colors.black, width: 100 }}>{Strings.min_order}</Text>
                  <Text style={{ fontSize: 12, color: Colors.black, width: 70 }}>{this.state.minOrder}</Text>
                </HorizontalLayout>
                <View style={{ marginTop: 5, backgroundColor: Colors.white }}>
                  <View style={[MyStyles.horizontal_divider, { marginTop: 2 }]} />
                  <HorizontalLayout style={{ height: 50, alignItems: "center" }}>
                    <Button style={[{
                      height: 40,
                      flex: 1,
                      borderRightColor: Colors.white_two,
                      borderRightWidth: 1,
                    }, MyStyles.center]}
                            onPress={() => Linking.openURL(`tel:${this.state.storePhone}`)}
                    >
                      <HorizontalLayout style={{ alignItems: "center" }}>
                        <ResizedImage source={require("src/assets/images/ic_phone.png")} style={{ width: 20 }} />
                        <Text style={{ fontSize: 14, color: Colors.black, marginLeft: 10 }}>{Strings.phone_order}</Text>
                      </HorizontalLayout>
                    </Button>
                    <HorizontalLayout style={[{ flex: 1 }, MyStyles.center]}>
                      <Text style={{ fontSize: 14, color: Colors.black, marginLeft: 10 }}>{Strings.like}</Text>
                      <Text style={{ fontSize: 14, color: Colors.primary, marginLeft: 10 }}>{this.state.likeCnt}</Text>
                    </HorizontalLayout>
                    <Button style={[{
                      height: 40,
                      flex: 1,
                      borderLeftColor: Colors.white_two,
                      borderLeftWidth: 1,
                    }, MyStyles.center]}>
                      <HorizontalLayout style={{ alignItems: "center" }}>
                        <ResizedImage source={require("src/assets/images/ic_share.png")} style={{ width: 20 }} />
                        <Text style={{ fontSize: 14, color: Colors.black, marginLeft: 10 }}>{Strings.share}</Text>
                      </HorizontalLayout>
                    </Button>
                  </HorizontalLayout>
                  <View style={[MyStyles.horizontal_divider, { marginBottom: 2 }]} />
                </View>
                <Text style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  color: Colors.LIGHT_GREY,
                  fontSize: 14,
                  minHeight: 80,
                }}>{Strings.order_info}</Text>
                <Text style={{
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  color: Colors.LIGHT_GREY,
                  fontSize: 14,
                  lineHeight: 25,
                }}>{this.state.detailOrderInfo}</Text>
                <HorizontalLayout style={{ height: 50, marginTop: 30 }}>
                  <Button style={this.state.bigTab === 0 ? styles.active_tab_big : styles.tab_big} onPress={() => {
                    this.setState({ bigTab: 0 });
                  }}>
                    <Text style={{
                      color: this.state.bigTab === 0 ? Colors.black : Colors.LIGHT_GREY,
                      fontSize: 14,
                    }}>{Strings.recom_menu}</Text>
                  </Button>
                  <Button style={this.state.bigTab === 1 ? styles.active_tab_big : styles.tab_big} onPress={() => {
                    this.setState({ bigTab: 1, title: this.state.shopName });
                  }}>
                    <Text style={{
                      color: this.state.bigTab === 1 ? Colors.black : Colors.LIGHT_GREY,
                      fontSize: 14,
                    }}>{Strings.information}</Text>
                  </Button>
                  <Button style={this.state.bigTab === 2 ? styles.active_tab_big : styles.tab_big} onPress={() => {
                    this.setState({ bigTab: 2, title: this.state.reviewName });
                  }}>
                    <Text style={{
                      color: this.state.bigTab === 2 ? Colors.black : Colors.LIGHT_GREY,
                      fontSize: 14,
                    }}>{Strings.review}</Text>
                  </Button>
                </HorizontalLayout>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                  style={{ borderBottomWidth: 1, borderBottomColor: Colors.divider }}
                  data={this.state.smallTabList}
                  renderItem={({ item, index }) => {
                    return (
                      <Button style={[item.selected ? styles.active_tab_sm : styles.tab_sm]}
                              onPress={() => {
                                this.onSmTab(index);
                              }}
                      >
                        <Text style={{
                          fontSize: 14,
                          color: item.selected ? Colors.detail_tab_active : Colors.detail_tab_inactive,
                        }} numberOfLines={1} ellipsizeMode="tail">{item.tab_name}</Text>
                      </Button>
                    );
                  }}
                  refreshing={this.state.isRefreshing}
                  onEndReachedThreshold={0.1}
                  keyExtractor={(item, index) => index.toString()}
                  onEndThreshold={0.1}
                />
                <Text style={{
                  fontSize: 16,
                  color: Colors.dark_blue,
                  paddingLeft: 20,
                  paddingTop: 10,
                }}>{Strings.recom_menu}</Text>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  style={{ paddingHorizontal: 20 }}
                  data={this.state.productList}
                  renderItem={({ item }) => {
                    return (
                      <Button style={{ borderBottomColor: Colors.divider, borderBottomWidth: 1, marginTop: 20 }}
                              onPress={() => {
                                this.onProduct(item);
                              }}>
                        <HorizontalLayout style={{ marginBottom: 10 }}>
                          <VerticalLayout style={{ flex: 1 }}>
                            <Text style={{ fontSize: 14, color: Colors.dark_blue }}>{item.name}</Text>
                            <Text style={{
                              fontSize: 14,
                              color: Colors.dark_blue,
                              marginTop: 15,
                            }}>{item.price + Strings.$}</Text>
                          </VerticalLayout>
                          <FastImage source={{ uri: item.img }} style={{ width: 70, height: 70 }}
                                     resizeMode={FastImage.resizeMode.cover} />
                        </HorizontalLayout>
                      </Button>
                    );
                  }}
                  refreshing={this.state.isRefreshing}
                  onEndReachedThreshold={0.1}
                  ListEmptyComponent={this.state.showEmptyUI && (
                    <View style={{
                      width: "100%",
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      marginVertical: 30,
                    }}>
                      <Text style={TextStyles.TEXT_STYLE_14}>{Strings.no_item}</Text>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  onEndThreshold={0.1}
                />
                <Button
                  style={[{ height: 50, backgroundColor: Colors.primary }, MyStyles.center]}
                  onPress={() => this.props.navigation.navigate("Basket")}
                >
                  <Text style={{
                    fontSize: 16,
                    color: Colors.white,
                  }}>{this.state.totalPrice + Strings.$ + Strings.basket}</Text>
                </Button>
              </VerticalLayout>
            </ScrollView>
            <HorizontalLayout style={{ position: "absolute", top: 20, height: 50, width: "100%" }}>
              <Button
                style={{
                  height: 50,
                  width: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  this.onBack();
                }}
              >
                <ResizedImage
                  source={require("src/assets/images/ic_arrow_back_white.png")}
                  style={{ width: 25, height: 25 }}
                />
              </Button>
              <View style={{ flex: 1 }} />
              <Button
                style={{
                  height: 50,
                  width: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => this.onLike()}
              >
                <View>
                  {
                    this.state.is_like === 1 &&
                    <ResizedImage
                      source={require("src/assets/images/ic_heart_white.png")}
                      style={{ width: 25, height: 25 }}
                    />
                  }
                  {
                    this.state.is_like === 0 &&
                    <ResizedImage
                      source={require("src/assets/images/ic_heart_white_off.png")}
                      style={{ width: 25, height: 25 }}
                    />
                  }
                </View>

              </Button>
            </HorizontalLayout>
          </View>
        }
        {
          this.state.bigTab !== 0 &&
          <View>
            <MyStatusBar theme="white" />
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
                  this.onBack();
                }}
              >
                <ResizedImage
                  source={require("src/assets/images/ic_arrow_back_black.png")}
                  style={{ width: 35, height: 30 }}
                />
              </Button>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Text style={{ fontSize: 20, color: Colors.black }}>
                  {this.state.title}
                </Text>
              </View>
              <View
                style={{
                  width: 50,
                  height: 50,
                }}>
                <Button onPress={() => {
                  this.props.navigation.navigate("Basket");
                }}
                        style={[{ width: 50, height: 50 }, MyStyles.center]}>
                  <HorizontalLayout>
                    <ResizedImage source={require("src/assets/images/ic_backet.png")}
                                  style={{ width: 20, height: 20 }} />

                    <Text style={{
                      fontSize: 10,
                      color: Colors.white,
                      backgroundColor: Colors.primary,
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      position: "absolute",
                      top: 10,
                      left: 10,
                      textAlign: "center",
                      lineHeight: 12,
                    }}>{this.state.productCnt}</Text>
                  </HorizontalLayout>
                </Button>
              </View>
            </HorizontalLayout>
            <HorizontalLayout style={{ height: 50 }}>
              <Button style={this.state.bigTab === 0 ? styles.active_tab_big : styles.tab_big} onPress={() => {
                this.setState({ bigTab: 0 });
              }}>
                <Text style={{
                  color: this.state.bigTab === 0 ? Colors.black : Colors.LIGHT_GREY,
                  fontSize: 14,
                }}>{Strings.recom_menu}</Text>
              </Button>
              <Button style={this.state.bigTab === 1 ? styles.active_tab_big : styles.tab_big} onPress={() => {
                this.setState({ bigTab: 1, title: this.state.shopName });
              }}>
                <Text style={{
                  color: this.state.bigTab === 1 ? Colors.black : Colors.LIGHT_GREY,
                  fontSize: 14,
                }}>{Strings.information}</Text>
              </Button>
              <Button style={this.state.bigTab === 2 ? styles.active_tab_big : styles.tab_big} onPress={() => {
                this.setState({ bigTab: 2, title: this.state.shopName });
              }}>
                <Text style={{
                  color: this.state.bigTab === 2 ? Colors.black : Colors.LIGHT_GREY,
                  fontSize: 14,
                }}>{Strings.review}</Text>
              </Button>
            </HorizontalLayout>

            {
              this.state.bigTab === 1 &&
              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={{ paddingHorizontal: 20, backgroundColor: Colors.white, paddingTop: 20, paddingBottom: 30 }}>
                  <Text style={{ fontSize: 14, color: Colors.black }}>{Strings.intro}</Text>
                  <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY }}>{this.state.intro}</Text>

                </View>
                <View style={{ padding: 20, marginVertical: 10, backgroundColor: Colors.white }}>
                  <Text style={{ fontSize: 14, color: Colors.black }}>{Strings.store_info}</Text>
                  <HorizontalLayout style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 12, color: Colors.black, flex: 1 }}>{Strings.delivery_area}</Text>
                    <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY }}>{this.state.deliveryArea}</Text>
                  </HorizontalLayout>
                  <View style={[MyStyles.horizontal_divider, { marginTop: 20 }]} />
                  <HorizontalLayout style={{ marginTop: 15 }}>
                    <Text style={{ fontSize: 12, color: Colors.black, flex: 1 }}>{Strings.delivery_fee}</Text>
                    <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY }}>{this.state.fee}</Text>
                  </HorizontalLayout>
                  <HorizontalLayout>
                    <View style={{ flex: 1 }} />
                    <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY }}>{this.state.fee}</Text>
                  </HorizontalLayout>
                  <View style={[MyStyles.horizontal_divider, { marginTop: 30 }]} />
                  <HorizontalLayout style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 12, color: Colors.black, flex: 1 }}>{Strings.operating_time}</Text>
                    <VerticalLayout>
                      <HorizontalLayout>
                        <View style={{ flex: 1 }} />
                        <Text style={{
                          fontSize: 12,
                          color: Colors.LIGHT_GREY,
                        }}>{Strings.monday + ": " + this.state.operatingTime[0]}</Text>
                      </HorizontalLayout>
                      <HorizontalLayout>
                        <View style={{ flex: 1 }} />
                        <Text style={{
                          fontSize: 12,
                          color: Colors.LIGHT_GREY,
                        }}>{Strings.tuesday + ": " + this.state.operatingTime[1]}</Text>
                      </HorizontalLayout>
                      <HorizontalLayout>
                        <View style={{ flex: 1 }} />
                        <Text style={{
                          fontSize: 12,
                          color: Colors.LIGHT_GREY,
                        }}>{Strings.wednesday + ": " + this.state.operatingTime[2]}</Text>
                      </HorizontalLayout>
                      <HorizontalLayout>
                        <View style={{ flex: 1 }} />
                        <Text style={{
                          fontSize: 12,
                          color: Colors.LIGHT_GREY,
                        }}>{Strings.thursday + ": " + this.state.operatingTime[3]}</Text>
                      </HorizontalLayout>
                      <HorizontalLayout>
                        <View style={{ flex: 1 }} />
                        <Text style={{
                          fontSize: 12,
                          color: Colors.LIGHT_GREY,
                        }}>{Strings.friday + ": " + this.state.operatingTime[4]}</Text>
                      </HorizontalLayout>
                      <HorizontalLayout>
                        <View style={{ flex: 1 }} />
                        <Text style={{
                          fontSize: 12,
                          color: Colors.LIGHT_GREY,
                        }}>{Strings.saturday + ": " + this.state.operatingTime[5]}</Text>
                      </HorizontalLayout>
                      <HorizontalLayout>
                        <View style={{ flex: 1 }} />
                        <Text style={{
                          fontSize: 12,
                          color: Colors.LIGHT_GREY,
                        }}>{Strings.sunday + ": " + this.state.operatingTime[6]}</Text>
                      </HorizontalLayout>
                    </VerticalLayout>

                  </HorizontalLayout>
                  <View style={[MyStyles.horizontal_divider, { marginTop: 30 }]} />
                  <HorizontalLayout style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 12, color: Colors.black, flex: 1 }}>{Strings.holiday}</Text>
                    <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY }}>{this.state.holiday}</Text>
                  </HorizontalLayout>
                </View>
                <Text style={{
                  fontSize: 14,
                  color: Colors.black,
                  fontWeight: "bold",
                  backgroundColor: Colors.white,
                  padding: 20,
                }}>{Strings.location_info}</Text>
                <ResizedImage source={{ uri: IMAGE_FOO_URL }} style={{ height: 200, width: "100%" }}
                              resizeMode={"cover"} />
                <View style={{ padding: 20, marginTop: 10, backgroundColor: Colors.white, marginBottom: 80 }}>
                  <Text style={{ fontSize: 14, color: Colors.black }}>{Strings.business_info}</Text>
                  <HorizontalLayout style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 12, color: Colors.black, flex: 1 }}>{Strings.representative_name}</Text>
                    <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY }}>{this.state.representative}</Text>
                  </HorizontalLayout>
                  <View style={[MyStyles.horizontal_divider, { marginTop: 20 }]} />
                  <HorizontalLayout style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 12, color: Colors.black, flex: 1 }}>{Strings.business_name}</Text>
                    <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY }}>{this.state.businessName}</Text>
                  </HorizontalLayout>
                  <View style={[MyStyles.horizontal_divider, { marginTop: 20 }]} />
                  <HorizontalLayout style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 12, color: Colors.black, flex: 1 }}>{Strings.business_address}</Text>
                    <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY }}>{this.state.businessAddress}</Text>
                  </HorizontalLayout>
                  <View style={[MyStyles.horizontal_divider, { marginTop: 20 }]} />
                  <HorizontalLayout style={{ marginTop: 20, marginBottom: 50 }}>
                    <Text style={{
                      fontSize: 12,
                      color: Colors.black,
                      flex: 1,
                    }}>{Strings.company_registration_number}</Text>
                    <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY }}>{this.state.companyNumber}</Text>
                  </HorizontalLayout>
                </View>

              </ScrollView>
            }
            {
              this.state.bigTab === 2 &&
              <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={this.state.reviewList}
                  contentContainerStyle={{ paddingBottom: 50 }}
                  style={{ flex: 1, marginVertical: 20, paddingHorizontal: 20 }}
                  numColumns={1}
                  renderItem={({ item }) => (
                    <DetailReviewItem
                      item={item}
                    />
                  )}
                  refreshing={this.state.isRefreshing}
                  onRefresh={() => this.handleLoadMore(true)}
                  // onEndReached={() => this.handleLoadMore(false)}
                  ItemSeparatorComponent={() => <View style={styles.horizontal_divider} />}
                  onEndReachedThreshold={0.1}
                  ListEmptyComponent={this.state.showEmptyReview && (
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
                  keyExtractor={(item, index) => `sale-${index.toString()}`}
                />
                <Button
                  style={{
                    height: 50,
                    backgroundColor: Colors.primary,
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 248,
                  }}
                  onPress={() => {
                    this.props.navigation.navigate("Review");
                  }}
                >
                  <Text style={{ fontSize: 16, color: Colors.white }}>{Strings.leave_review}</Text>
                </Button>
              </View>
            }
          </View>
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  status: {
    width: 70,
    height: 22,
    paddingTop: 3,
    textAlign: "center",
    borderRadius: 3,
    fontSize: 12,
    color: Colors.white,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  name_area: {
    top: 160,
    width: SCREEN_WIDTH - 40,
    height: 120,
    marginHorizontal: 20,
    position: "absolute",
    backgroundColor: Colors.white,
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 2,
    elevation: 5,
  },
  banner_index: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.black_40,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 70,
    right: 20,
  },
  active_tab_big: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderTopColor: Colors.white_two,
    borderTopWidth: 1,
  },
  tab_big: {
    backgroundColor: Colors.white_three,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.white_two,

  },
  tab_sm: {
    width: 90,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  active_tab_sm: {
    width: 90,
    height: 40,
    borderBottomColor: Colors.black,
    borderBottomWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
