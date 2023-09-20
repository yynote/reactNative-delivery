import React, {Component} from "react";
import {FlatList, Text, View} from "react-native";
import {Button, HorizontalLayout, ResizedImage} from "../components/controls";
import {MyStatusBar} from "../components/controls/MyStatusBar";
import {MyStyles, Strings, TextStyles} from "../constants";
import Colors from "../constants/Colors";
import C, {API_RES_CODE} from "../constants/AppConstants";
import {OrderItem} from "../components/items/OrderItem";
import {Net, requestPost} from "../utils/APIUtils";
import GlobalState from "../mobx/GlobalState";
import Toast from "react-native-root-toast";
import EventBus from "react-native-event-bus";

export default class OrderHistoryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderList: [],
      limit: 30,
      offset: 0,
      isRefreshing: false,
      noMoreData: false,
      showEmptyUI: false,
    };
  }

  componentDidMount() {
    this.loadOrderList();
    EventBus.getInstance().addListener(C.EVENT_PARAMS.REVIEW_ADD, this.listener = ({}) => {
      this.setState({offset:0, orderList:[]},()=>{this.loadOrderList();})
    });
  }

  componentWillUnmount() {
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onStoreDetail(shop_uid) {
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

  loadOrderList() {
    requestPost(Net.home.order_history, { access_token: GlobalState.access_token, limit: this.state.limit, offset: this.state.offset }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        this.setState({
          orderList: this.state.orderList.length === 0 ? response.data.list : [...this.state.orderList, ...response.data.list],
          isRefreshing: false,
        }, () => {
          this.setState({
            showEmptyUI: this.state.orderList.length === 0,
            offset: this.state.orderList.length,
          });
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
        orderList: [],
        offset: 0,
      }, () => {
        this.loadOrderList();
      });
    } else {        // onEndReached
      if (!this.noMoreData) {
        this.loadOrderList();
      }
    }
  };

  onGoDetail(item) {
    this.props.navigation.navigate({ routeName: "OrderDetail", params: { order: item } });
  }

  onGoReview(item) {
    this.props.navigation.navigate({ routeName: "ReviewDetail", params: { uid: item.review_uid, order_uid: item.uid, shop_uid: item.shop_uid } });
  }

  render() {
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}>
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
              this.props.onDrawOpen()
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
              {Strings.order_history}
            </Text>
          </View>
          <View
            style={{
              width: 50,
              height: 50,
            }} />
        </HorizontalLayout>
        <View style={MyStyles.horizontal_divider} />

        <FlatList
          showsVerticalScrollIndicator={false}
          data={this.state.orderList}
          renderItem={({ item, index }) => (
            <OrderItem
              item={item}
              onStoreDetail={()=>this.onStoreDetail(item.shop_uid)}
              onGoDetail={() => this.onGoDetail(item)}
              onGoReview={() => this.onGoReview(item)}
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
          keyExtractor={(item, index) => `sale-${index.toString()}`}
        />
      </View>
    );
  }
}
