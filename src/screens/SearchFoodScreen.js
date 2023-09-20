import React, { Component } from "react";
import {
  BackHandler,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, CustomDropdown, HorizontalLayout, ResizedImage } from "../components/controls";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { MyStyles, Strings, TextStyles } from "../constants";
import Colors from "../constants/Colors";
import C, { API_RES_CODE } from "../constants/AppConstants";
import { SearchFoodItem } from "../components/items/SearchFoodItem";
import { Net, requestPost } from "../utils/APIUtils";
import GlobalState from "../mobx/GlobalState";
import Toast from "react-native-root-toast";
import PrefUtils from "../utils/PrefUtils";
import EventBus from "react-native-event-bus";

export default class SearchFoodScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: "",
      resultList: [],
      isRefreshing: false,
      showResult: false,
      keywordList: [],
      classVal: "",
    };

    this.classOptions = [
      {
        code: 0,
        value: Strings.by_near,
      },
      {
        code: 0,
        value: Strings.by_rating,
      },

    ];
    this.handleBackPress = this.handleBackPress.bind(this);
  }

  componentDidMount() {
    this.getKeywordList();
    this.props.navigation.addListener("willFocus", async () => {
      this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
    });

    this.props.navigation.addListener("willBlur", () => {
      if (this.backHandler != null) {
        this.backHandler.remove();
      }
    });
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener);
    if (this.backHandler) {
      try {
        this.backHandler.remove();
      } catch (e) {
        console.log(e);
      }
    }
  }

  async getKeywordList() {
    let data = await PrefUtils.getString(C.ASYNC_PARAM.KEYWORD);
    console.log(data);
    if (data !== undefined && data !== "") {
      this.setState({
        keywordList: data.split(","),
      });
    }
  }

  handleLoadMore = (clear) => {
    if (clear) {    // onRefresh
      this.noMoreData = false;
      this.setState({
        isRefreshing: clear,
        resultList: [],
        offset: 0,
      }, () => {
        this.loadResultList();
      });
    } else {        // onEndReached
      if (!this.noMoreData) {
        this.loadResultList();
      }
    }
  };

  handleBackPress() {
    if (this.state.showResult) {
      this.setState({showResult:false});
    } else {
      this.props.navigation.goBack();
    }
    return true;
  }

  loadResultList() {

    requestPost(
      Net.home.product_list,
      {
        access_token: GlobalState.access_token,
        category_uid: 0,
        shop_uid: 0,
        order_by: this.state.classVal.value === "By near" ? "nearest" : "rate",
        latitude: GlobalState.myLatitude,
        longitude: GlobalState.myLongitude,
        keyword: this.state.keyword,
      }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        let resultList = [];
        for (let i = 0; i < response.data.list.length; i++) {
          resultList.push({
            img_src: response.data.list[i].image,
            product_name: response.data.list[i].name,
            time: response.data.list[i].time + Strings.minute,
            distance: parseInt(response.data.list[i].distance / 1000).toString() + "km",
            fee: response.data.list[i].fee + Strings.$,
            content: response.data.list[i].simple_description,
            is_new: response.data.list[i].is_new,
            shop_uid: response.data.list[i].shop_uid,
            base_price: response.data.list[i].base_price,
            min_price: response.data.list[i].min_price,
            is_delivery: response.data.list[i].is_delivery,
            is_gift: response.data.list[i].is_gift,
            is_packable: response.data.list[i].is_packet,
          });
        }
        this.noMoreData = false;
        this.setState({ resultList: resultList, isRefreshing: false }, () => {
          if (this.state.resultList.length === 0) {
            this.setState({ offset: this.state.resultList.length, showEmptyUI: true });
          }
        });
      } else {
        Toast.show(response.msg);
      }
    });
  }

  onDeleteKeyword(id) {
    let { keywordList } = this.state;
    let newList = keywordList.filter((item, index) => id !== index);
    this.setState({
      keywordList: newList,
    });
    PrefUtils.setString(C.ASYNC_PARAM.KEYWORD, newList.join(","));
  }

  onGoDetail(shop_uid) {
    if (GlobalState.me.uid === 0) {
      this.setState({ loginConfirm: true });
      return;
    }
    requestPost(Net.home.shop_detail, {
      access_token: GlobalState.access_token,
      shop_uid: shop_uid,
    }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        GlobalState.shop_detail = {
          fee: response.data.fee + Strings.$,
          minOrder: response.data.min_order + Strings.$,
          reviewCnt: response.data.review_cnt,
          reviewBossCnt: response.data.review_boss_cnt,
          detailOrderInfo: response.data.order_info,
          image: response.data.image,
          starNum: response.data.rate,
          shopName: response.data.shop_name,
          storePhone: response.data.shop_phone,
          likeCnt: response.data.like_cnt,
          intro: response.data.intro,
          deliveryArea: response.data.delivery_area,
          operatingTime: response.data.operating_time,
          holiday: response.data.holiday,
          shopPosition: response.data.shop_position, 
          representative: response.data.representative,
          businessName: response.data.business_name,
          businessAddress: response.data.business_address,
          companyNumber: response.data.company_number,
          reviewList: response.data.review_list,
          is_like: response.data.is_like,
          shop_uid: shop_uid,
        };
        this.props.navigation.navigate({ routeName: "Detail", params: { shop_uid: shop_uid } });
      } else {
        Toast.show(response.msg);
      }
    });
  }

  onDeleteAll() {
    this.setState({ keywordList: [] });
    PrefUtils.setString(C.ASYNC_PARAM.KEYWORD, "");
  }

  onSearch(keyword) {
    let { keywordList } = this.state;
    Keyboard.dismiss();
    if (keywordList.indexOf(keyword) < 0 && keyword !== "") {
      if (keywordList.length === 10) {
        keywordList.pop();
      }
      keywordList.unshift(keyword);
      this.setState({ keywordList: keywordList });
      PrefUtils.setString(C.ASYNC_PARAM.KEYWORD, keywordList.join(","));
    }

    this.setState({ showResult: true, keyword: keyword }, () => this.loadResultList());

  }

  onBack() {
    if (this.state.showResult) {
      this.setState({ showResult: false })
    } else {
      this.props.navigation.goBack();
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}
                            behavior={Platform.OS === "ios" ? "padding" : ""}>
        <MyStatusBar theme="white" />
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => {
        }}>
          <View style={[MyStyles.full, { backgroundColor: Colors.white_two }]}>
            <HorizontalLayout style={{ height: 50, backgroundColor: Colors.white }}>
              <Button style={[MyStyles.center, { width: 50, height: 50 }]}
                      onPress={() => {
                        this.onBack();
                      }}>
                <ResizedImage
                  source={require("src/assets/images/ic_arrow_back_black.png")}
                  style={{ width: 25, height: 25 }}
                />
              </Button>
              <HorizontalLayout style={[styles.search_box, MyStyles.center]}>
                <TextInput
                  value={this.state.keyword}
                  style={[TextStyles.TEXT_STYLE_14, {
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    flex: 1,
                  }]}
                  onChangeText={text => {
                    this.setState({ keyword: text });
                  }}
                  placeholder={Strings.enter_hint}
                  placeholderTextColor={Colors.LIGHT_GREY}
                  returnKeyType="search"
                  onSubmitEditing={() => {
                    this.onSearch(this.state.keyword);
                  }}
                />
                <Button style={[styles.action_btn, MyStyles.center]} onPress={() => {
                  this.setState({ keyword: "" });
                }}>
                  <ResizedImage
                    source={require("src/assets/images/ic_input_del.png")}
                    style={{ width: 25 }} />
                </Button>
                <Button style={[styles.action_btn, MyStyles.center]} onPress={() => {
                  this.onSearch(this.state.keyword);
                }}>
                  <ResizedImage
                    source={require("src/assets/images/ic_round_search.png")}
                    style={{ width: 25 }} />
                </Button>
              </HorizontalLayout>
            </HorizontalLayout>
            {
              !this.state.showResult &&
              <View style={styles.key_area}>
                <HorizontalLayout style={{ alignItems: "center" }}>
                  <Text style={{ fontSize: 14, color: Colors.black, flex: 1 }}>{Strings.recent_search}</Text>
                  <Button style={[{
                    width: 80,
                    height: 30,
                    backgroundColor: Colors.primary,
                    borderRadius: 5,
                  }, MyStyles.center]}
                          onPress={() => {
                            this.onDeleteAll();
                          }}
                  >
                    <Text style={{ fontSize: 12, color: Colors.white }}>{Strings.delete_all}</Text>
                  </Button>
                </HorizontalLayout>
                <View style={{flexWrap: 'wrap', flexDirection:"row"}}>
                  {
                    this.state.keywordList.map((item, index) => {
                      return (
                        <Button style={styles.keyword}
                                onPress={() => {
                                  this.onSearch(item);
                                }}
                        >
                          <HorizontalLayout>
                            <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY }}>{item}</Text>
                            <Button style={{ marginTop: 2, marginLeft: 10 }}
                                    onPress={() => this.onDeleteKeyword(index)}>
                              <ResizedImage
                                source={require("src/assets/images/ic_del_gray.png")}
                                style={{ width: 10 }}
                              />
                            </Button>
                          </HorizontalLayout>
                        </Button>);
                    })
                  }
                </View>
              </View>
            }
            {
              this.state.showResult &&
              <View style={{ flex: 1 }}>
                <HorizontalLayout
                  style={[{ alignItems: "center", backgroundColor: Colors.white }, MyStyles.padding_h_20]}>
                  <Text style={{ fontSize: 14, color: Colors.black, flex: 1 }}>{Strings.search_result}</Text>
                  <View style={styles.input_bg}>
                    <CustomDropdown
                      options={this.classOptions}
                      textStyle={{ fontSize: 12 }}
                      defaultIndex={0}
                      onSelect={(value) => {
                        this.setState({ classVal: value });
                      }}
                    />
                  </View>
                </HorizontalLayout>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={this.state.resultList}
                  style={{ flex: 1, paddingHorizontal: 20, backgroundColor: Colors.white }}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  numColumns={1}
                  renderItem={({ item, index }) => (
                    <SearchFoodItem
                      numColumns={1}
                      item={item}
                      onPress={() => this.onGoDetail(item.shop_uid)}
                    />
                  )}
                  refreshing={this.state.isRefreshing}
                  onRefresh={() => this.handleLoadMore(true)}
                  onEndReached={() => this.handleLoadMore(false)}
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
              </View>
            }
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

}

const styles = StyleSheet.create({
  search_box: {
    marginRight: 20,
    height: 50,
    borderRadius: 30,
    backgroundColor: Colors.white_two,
    flex: 1,
  },
  key_area: {
    padding: 20,
    backgroundColor: Colors.white,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  keyword: {
    height: 30,
    borderRadius: 30,
    borderColor: Colors.LIGHT_GREY,
    borderWidth: 1,
    justifyContent: "center",
    marginTop: 10,
    marginRight: 10,
    paddingHorizontal: 20,
    alignSelf:"flex-start",
  },
  action_btn: {
    height: 50,
    marginRight: 15,
  },
  input_bg: {
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 5,
  },
});
