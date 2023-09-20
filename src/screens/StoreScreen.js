import React, { Component } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { MyStyles, Strings, TextStyles } from "../constants";
import Colors from "../constants/Colors";
import { Button, CustomDropdown, HorizontalLayout, MainTopBar } from "../components/controls";
import { API_RES_CODE } from "../constants/AppConstants";
import GlobalState from "../mobx/GlobalState";
import { SearchFoodItem } from "../components/items/SearchFoodItem";
import { Net, requestPost } from "../utils/APIUtils";
import Toast from "react-native-root-toast";
import AskPopup from "../components/popups/AskPopup";

export default class StoreScreen extends Component {
  constructor(props) {
    super(props);

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

    this.state = {
      tabIndex: this.props.navigation.getParam("item") ? this.props.navigation.getParam("item") : "6",
      title: (GlobalState.me.delivery_address ===undefined || GlobalState.me.delivery_address === null)?Strings.please_select_address: GlobalState.me.delivery_address.address ,
      tabList: [],
      classVal: this.classOptions[0],
      isRefreshing: false,
      activeIndex: 0,
      showEmptyUI:false,
      offset: 0,
      loginConfirm: false
    };
  }

  componentDidMount() {
    let list = [];
    for (let i = 0; i < GlobalState.categoryList.length; i++) {
      list.push({
        name: GlobalState.categoryList[i].name,
        selected: GlobalState.categoryList[i].uid === this.state.tabIndex,
        uid: GlobalState.categoryList[i].uid,
      });
      if (GlobalState.categoryList[i].uid === this.state.tabIndex) {
        this.setState({ activeIndex: i });
      }
    }
    this.setState({ tabList: list }, () => this.scrollToIndex(this.state.activeIndex, true));
    this.loadResultList(this.props.navigation.getParam("item"));
  }

  componentWillUnmount() {
  }

  onBack() {
    this.props.navigation.goBack();
  }

  scrollToIndex = (index, animated) => {
    this.flatListRef && this.flatListRef.scrollToIndex({ index, animated });
  };

  onSearchAddress () {
    if (GlobalState.me.uid === 0) {
      this.setState({loginConfirm: true});
    } else {
      this.props.navigation.navigate("AddressManage")
    }
  }

  loadResultList(uid) {
    requestPost(
      Net.home.product_list,
      {
        access_token: GlobalState.access_token,
        category_uid: parseInt(uid),
        shop_uid:0,
        order_by: this.state.classVal.value === "By near" ? 'nearest': "rate",
        latitude: GlobalState.myLatitude,
        longitude: GlobalState.myLongitude
      }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        let resultList = [];
        for (let i=0; i< response.data.list.length; i++) {
          resultList.push({
            img_src: response.data.list[i].image,
            product_name: response.data.list[i].name,
            time: response.data.list[i].time+Strings.minute,
            distance: parseInt(response.data.list[i].distance/1000).toString() + 'km',
            fee: response.data.list[i].fee + Strings.$,
            content:response.data.list[i].simple_description,
            is_new: response.data.list[i].is_new,
            shop_uid: response.data.list[i].shop_uid,
            base_price: response.data.list[i].base_price,
            min_price: response.data.list[i].min_price,
            is_delivery: response.data.list[i].is_delivery,
            is_gift: response.data.list[i].is_gift,
            is_packable: response.data.list[i].is_packet
          });
        }
        this.noMoreData = false;
        this.setState({ resultList: resultList, isRefreshing: false }, ()=>{
          if (this.state.resultList.length === 0) {
            this.setState({ offset: this.state.resultList.length, showEmptyUI: true})
          }
        });
      } else {
        Toast.show(response.msg);
      }
    });
  }

  handleLoadMore = (clear) => {
    if (clear) {    // onRefresh
      this.noMoreData = false;
      this.setState({
        isRefreshing: clear,
        resultList: [],
        offset: 0,
      }, () => {
        this.loadResultList(this.state.tabIndex);
      });
    } else {        // onEndReached
      if (!this.noMoreData) {
        this.loadResultList(this.state.tabIndex);
      }
    }
  };

  onCategory(id) {
    let { tabList } = this.state;
    for (let i = 0; i < tabList.length; i++) {
      tabList[i].selected = i === id;
    }
    this.setState({ tabList: tabList, tabIndex: tabList[id].uid, showEmptyUI: false });
    this.loadResultList(tabList[id].uid)
  }

  onGoDetail(shop_uid) {
    if (GlobalState.me.uid === 0) {
      this.setState({loginConfirm: true});
      return
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
          shop_uid: shop_uid
        };
        this.props.navigation.navigate({ routeName: "Detail", params: { shop_uid: shop_uid } })
      } else {
        Toast.show(response.msg);
      }
    });
  }

  render() {
    return (
      <View style={{ height: "100%", width: "100%", backgroundColor: Colors.white }}>
        <MyStatusBar theme="white" />
        <MainTopBar
          theme={"white"}
          title={this.state.title}
          isBackIcon={true}
          onBackPress={() => {
            this.onBack();
          }}
          onSearchAddress={() => this.onSearchAddress()}
          onSearchFood={() => this.props.navigation.navigate("SearchFood")}
        />
        <View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            ref={(ref) => {
              this.flatListRef = ref;
            }}
            initialNumToRender={this.state.tabList.length}
            onScrollToIndexFailed={(error) => {
              this.flatListRef.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
              setTimeout(() => {
                if (this.state.tabList.length !== 0 && this.flatListRef !== null) {
                  this.flatListRef.scrollToIndex({ index: error.index, animated: true });
                }
              }, 100);
            }}
            style={{ borderBottomWidth: 1, borderBottomColor: Colors.white_two }}
            data={this.state.tabList}
            renderItem={({ item, index }) => {
              return (
                <Button style={[item.selected ? styles.active_tab_sm : styles.tab_sm]}
                        onPress={() => {this.onCategory(index);}}
                >
                  <Text style={{
                    fontSize: 14,
                    color: item.selected ? Colors.detail_tab_active : Colors.detail_tab_inactive,
                  }} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                </Button>
              );
            }}
            onEndReachedThreshold={0.1}
            keyExtractor={(item, index) => index.toString()}
            onEndThreshold={0.1}
          />

        </View>
        <HorizontalLayout
          style={[{ alignItems: "center", backgroundColor: Colors.white, marginTop: 5 }, MyStyles.padding_h_20]}>
          <Text style={{ fontSize: 14, color: Colors.black, flex: 1 }}>{Strings.no_delivery_fee}</Text>
          <View style={styles.input_bg}>
            <CustomDropdown
              options={this.classOptions}
              textStyle={{ fontSize: 12 }}
              defaultIndex={0}
              onSelect={(value) => {
                this.setState({ classVal: value }, ()=>{this.loadResultList(this.state.tabIndex)});
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
          renderItem={({ item }) => (
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
