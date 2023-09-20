import React, { Component } from "react";
import { FlatList, Text, View } from "react-native";
import C, { API_RES_CODE } from "../../constants/AppConstants";
import { TopBar } from "../../components/controls";
import Colors from "../../constants/Colors";
import { Strings, TextStyles } from "../../constants";
import { MyStatusBar } from "../../components/controls/MyStatusBar";
import { BookmarkItem } from "../../components/items";
import { Net, requestPost } from "../../utils/APIUtils";
import Toast from "react-native-root-toast";
import GlobalState from "../../mobx/GlobalState";
import EventBus from "react-native-event-bus";

export default class BookmarkScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarkList: [],
      isRefreshing: false,
      showEmptyUI: false,
      limit: 30,
      offset: 0,
    };
  }

  componentWillUnmount() {
  }

  componentDidMount() {
    this.loadBookmarkList();
    EventBus.getInstance().addListener(C.EVENT_PARAMS.BOOKMARK_CHANGE, this.listener = ({}) => {
      this.setState({offset:0, bookmarkList:[]},()=>{this.loadBookmarkList();})
    });
  }

  loadBookmarkList() {
    requestPost(
      Net.search.bookmark_list,
      { access_token: GlobalState.access_token, limit: this.state.limit, offset: this.state.offset },
    ).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        this.setState({
          bookmarkList: this.state.bookmarkList.length === 0 ? response.data.list : [...this.state.bookmarkList, ...response.data.list],
          isRefreshing: false,
        }, () => {
          this.setState({
            showEmptyUI: this.state.bookmarkList.length === 0,
            offset: this.state.bookmarkList.length,
          });
        });
        this.noMoreData = response.data.list.length < this.state.limit;
      } else {
        Toast.show(response.msg);
      }
    });
  }

  onGoDetail(item) {
    requestPost(Net.home.shop_detail, {
      access_token: GlobalState.access_token,
      shop_uid: item.shop_uid,
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
          shopPosition: response.data.shop_position, // Todo YJ
          representative: response.data.representative,
          businessName: response.data.business_name,
          businessAddress: response.data.business_address,
          companyNumber: response.data.company_number,
          reviewList: response.data.review_list,
          is_like: response.data.is_like,
          shop_uid: item.shop_uid
        };
        this.props.navigation.navigate({ routeName: "Detail", params: { shop_uid: item.shop_uid } })
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
        bookmarkList: [],
        offset: 0,
      }, () => {
        this.loadBookmarkList();
      });
    } else {        // onEndReached
      if (!this.noMoreData) {
        this.loadBookmarkList();
      }
    }
  };


  render() {
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white_two }}>
        <MyStatusBar theme="white" />
        <TopBar
          theme={"white"}
          title={Strings.bookmark}
          onBackPress={() => {
            this.props.navigation.goBack();
          }} />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={this.state.bookmarkList}
          renderItem={({ item }) => (
            <BookmarkItem
              item={item}
              onPress={() => this.onGoDetail(item)}
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
