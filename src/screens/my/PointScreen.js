import React, { Component } from "react";
import { FlatList, Text, View } from "react-native";
import { SearchBox, TopBar } from "../../components/controls";
import Colors from "../../constants/Colors";
import { Strings, TextStyles } from "../../constants";
import { FaqCategoryItem, FaqItem } from "../../components/items";
import { MyStatusBar } from "../../components/controls/MyStatusBar";
import { ScrollView } from "react-native-gesture-handler";
import PointItem from "../../components/items/PointItem";
import { Net, requestPost } from "../../utils/APIUtils";
import GlobalState from "../../mobx/GlobalState";
import { API_RES_CODE } from "../../constants/AppConstants";
import Toast from "react-native-root-toast";

export default class PointScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      historyList: [],
      isRefreshing: false,
      showEmptyUI: false,
    };
  }

  componentDidMount() {
    this.loadHistoryList();
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white_two }}>
        <MyStatusBar theme="white" />
        <TopBar
          theme={"white"}
          title={Strings.point}
          onBackPress={() => {
            this.props.navigation.goBack();
          }} />
        <View
          style={{
            height: 150,
            backgroundColor: Colors.white,
            borderBottomRightRadius: 15,
            borderBottomLeftRadius: 15,
            paddingHorizontal: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 1,
            shadowRadius: 1,
            elevation: 5,
          }}

        >
          <Text style={{ fontSize: 14, color: Colors.black, marginTop: 10 }}>{Strings.holding_points}</Text>
          <Text style={{
            fontSize: 24,
            color: Colors.black,
            marginTop: 15,
            fontWeight: "bold",
            paddingLeft: 10,
          }}>{GlobalState.me.point + Strings.$}</Text>
          <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY, marginTop: 15 }}>{Strings.available_in}</Text>
          <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY }}>{Strings.can_hold_up}</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 15, backgroundColor:Colors.white}}>
          <View style={{ backgroundColor: Colors.white, height: "100%" }}>
            <Text style={{ paddingTop: 25, fontSize: 14, paddingHorizontal: 20 }}>{Strings.point_usage}</Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.historyList}
              renderItem={({ item, index }) =>
                <PointItem item={item} />
              }
              refreshing={this.state.isRefreshing}
              onEndThreshold={0.1}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={this.state.showEmptyUI && (
                <View style={{ width: "100%", height:"100%", flex: 1, justifyContent: "center", alignItems: "center", marginTop: 200, backgroundColor:Colors.white }}>
                  <Text style={TextStyles.TEXT_STYLE_14}>{Strings.no_item}</Text>
                </View>
              )}
            />
          </View>
        </ScrollView>

      </View>

    );
  }

  loadHistoryList = () => {

    requestPost(Net.home.point_history, { access_token: GlobalState.access_token }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        this.setState({
          historyList:  response.data.list,
          isRefreshing: false,
        }, () => {
          this.setState({
            showEmptyUI: this.state.historyList.length === 0,
            offset: this.state.historyList.length,
          });
        });
      } else {
        Toast.show(response.msg);
      }
    });
  };
}
