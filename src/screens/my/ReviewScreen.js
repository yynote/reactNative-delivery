import React, { Component } from "react";
import { FlatList, Text, View } from "react-native";
import { TopBar } from "../../components/controls";
import Colors from "../../constants/Colors";
import { Strings, TextStyles } from "../../constants";
import { MyStatusBar } from "../../components/controls/MyStatusBar";
import C, { API_RES_CODE } from "../../constants/AppConstants";
import { ReviewItem } from "../../components/items/ReviewItem";
import AskPopup from "../../components/popups/AskPopup";
import { Net, requestPost } from "../../utils/APIUtils";
import GlobalState from "../../mobx/GlobalState";
import Toast from "react-native-root-toast";
import EventBus from "react-native-event-bus";

export default class ReviewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewList: [],
      limit: 30,
      offset: 0,
      isRefreshing: false,
      noMoreData: false,
      showEmptyUI: false,
      delConfirmPopup: false,
      delId: 0,
    };

  }

  componentDidMount() {
    this.loadReviewList();
    EventBus.getInstance().addListener(C.EVENT_PARAMS.REVIEW_ADD, this.listener = ({}) => {
      this.setState({offset:0, reviewList:[]},()=>{this.loadReviewList();})
    });

  }

  componentWillUnmount() {
  }

  loadReviewList() {
    requestPost(Net.home.my_review_list, {
      access_token: GlobalState.access_token,
      limit: this.state.limit,
      offset: this.state.offset,
    }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        this.setState({
          reviewList: response.data.list,
          isRefreshing: false,
        }, () => {
          this.setState({
            showEmptyUI: this.state.reviewList.length === 0,
            offset: this.state.reviewList.length,
          });
        });
        this.noMoreData = response.data.list.length < this.state.limit;
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

  onReviewDetail(item) {
    this.props.navigation.navigate({ routeName: "ReviewDetail", params: { uid: item.review_uid, shop_uid: item.shop_uid } });
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onDelete(id) {
    this.setState({
      delConfirmPopup: true,
      delId: id,
    });
  }

  doRemove(id) {

    requestPost(Net.home.review_del, {
      access_token: GlobalState.access_token,
      review_uid: parseInt(this.state.reviewList[id].review_uid),
    }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        Toast.show(Strings.review_del_success);
        let { reviewList } = this.state;
        reviewList[id].review_uid = '0';
        this.setState({
          reviewList: reviewList,
        });
        EventBus.getInstance().fireEvent(C.EVENT_PARAMS.REVIEW_ADD, {});
      } else {
        Toast.show(response.msg);
      }
    });
  }

  onAddReview(item) {
    this.props.navigation.navigate({routeName:"ReviewDetail", params:{uid: item.review_uid, order_uid: item.order_uid, shop_uid: item.shop_uid}});
  }

  render() {
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white_two }}>
        <MyStatusBar theme={"white"} />
        <TopBar
          theme={"white"}
          title={Strings.my_review}
          onBackPress={() => {
            this.onBack();
          }} />
          <FlatList
            showsVerticalScrollIndicator={false}
            data={this.state.reviewList}
            style={{ flex: 1, marginBottom: 35 }}
            numColumns={1}
            renderItem={({ item, index }) => (
              <ReviewItem
                item={item}
                onPress={() => {
                  this.onReviewDetail(item);
                }}
                onDelete={() => this.onDelete(index)}
                onAddReview={() => this.onAddReview(item)}
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
          visible={this.state.delConfirmPopup}
          title={Strings.del_review_confirm}
          yes_no={true}
          onCancel={() => this.setState({ delConfirmPopup: false })}
          onConfirm={() => {
            this.setState({
              delConfirmPopup: false,
            }, () => {
              this.doRemove(this.state.delId);
            });
          }}
        />
      </View>
    );
  }
}
