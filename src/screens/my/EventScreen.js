import React, { Component } from "react";
import { FlatList, Text, View } from "react-native";
import { API_RES_CODE } from "../../constants/AppConstants";
import { TopBar } from "../../components/controls";
import Colors from "../../constants/Colors";
import { EventItem } from "../../components/items";
import { Strings, TextStyles } from "../../constants";
import { MyStatusBar } from "../../components/controls/MyStatusBar";
import { Net, requestPost } from "../../utils/APIUtils";
import Toast from "react-native-root-toast";

export default class EventScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventList: [],
      isRefreshing: false,
      showEmptyUI: false,
      limit: 20,
      offset: 0,
    };
  }

  componentDidMount() {
    this.loadEventList();
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}>
        <MyStatusBar theme="white" />
        <TopBar
          theme={"white"}
          title={Strings.event}
          onBackPress={() => {
            this.props.navigation.goBack();
          }} />
        <FlatList
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          data={this.state.eventList}
          renderItem={({ item, index }) =>
            <EventItem
              item={item}
              index={index}
              onPress={() => {
                this.props.navigation.navigate({ routeName: "EventDetail", params: { item: item } });
              }}
            />
          }
          refreshing={this.state.isRefreshing}
          onRefresh={() => this.handleLoadMore(true)}
          onEndReached={() => this.handleLoadMore(false)}
          onEndThreshold={0.1}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={this.state.showEmptyUI && (
            <View style={{ width: "100%", flex: 1, justifyContent: "center", alignItems: "center", marginTop: 200 }}>
              <Text style={TextStyles.TEXT_STYLE_14}>{Strings.no_item}</Text>
            </View>
          )}
        />
      </View>
    );
  }

  loadEventList = () => {
    requestPost(Net.home.event_list, { limit: this.state.limit, offset: this.state.offset }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        this.setState({
          eventList: this.state.eventList.length === 0 ? response.data.list : [...this.state.eventList, ...response.data.list],
          isRefreshing: false,
        }, () => {
          this.setState({
            showEmptyUI: this.state.eventList.length === 0,
            offset: this.state.eventList.length,
          });
        });
        this.noMoreData = response.data.list.length < this.state.limit;
      } else {
        Toast.show(response.msg);
      }
    });
    this.noMoreData = false;
  };

  handleLoadMore = (clear) => {
    if (clear) {    // onRefresh
      this.noMoreData = false;
      this.setState({
        isRefreshing: clear,
        eventList: [],
        offset: 0,
      }, () => {
        this.loadEventList();
      });
    } else {        // onEndReached
      if (!this.noMoreData) {
        this.loadEventList();
      }
    }
  };
}
