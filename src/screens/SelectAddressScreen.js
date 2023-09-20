import React, { Component } from "react";
import { FlatList, Keyboard, KeyboardAvoidingView, Text, TouchableWithoutFeedback, View } from "react-native";
import { SearchBox, TopBar } from "../components/controls";
import Colors from "../constants/Colors";
import { MyStyles, Strings, TextStyles } from "../constants";
import { SelectAddressItem } from "../components/items";
import { MyStatusBar } from "../components/controls/MyStatusBar";

export default class SelectAddressScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressList: [],
      keyword: "",
      isRefreshing: false,
      offset: 0,
      limit: 30,
    };
  }

  componentWillUnmount() {
  }

  componentDidMount() {
    this.loadAddressList();
  }

  onRemove = () => {
    this.setState({ keyword: "" });
  };

  onSearch = () => {
    Keyboard.dismiss();
  };

  handleLoadMore = (clear) => {
    if (clear) {    // onRefresh
      this.noMoreData = false;
      this.setState({
        isRefreshing: clear,
        addressList: [],
        offset: 0,
      }, () => {
        this.loadAddressList();
      });
    } else {        // onEndReached
      if (!this.noMoreData) {
        this.loadAddressList();
      }
    }
  };


  loadAddressList() {
    let list = []; 
    for (let i = 0; i < 5; i++) {
      list.push({
        zipCode: 13494,
        latitude: "38.0",
        longitude: "12.5",
        address: "AAA BBB CCC 228",
        newAddress: "XXX YYY 40",
        detailAddress: "4th floor 1st door"
      });
    }
    this.setState({ addressList: list });
  }


  render() {
    return (
      <KeyboardAvoidingView style={{ width: "100%", height: "100%", backgroundColor: Colors.white_two }}
                            behavior={Platform.OS === "ios" ? "padding" : ""}>
        <MyStatusBar theme="white" />
        <TouchableWithoutFeedback style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <TopBar
              theme={"white"}
              title={Strings.select_delivery_address}
              style={[{ width: "100%" }, MyStyles.shadow]}
              onBackPress={() => {
                this.props.navigation.goBack();
              }} />
            <View style={[{
              backgroundColor: Colors.white,
              height: 60,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }, MyStyles.shadow]}>
              <SearchBox
                style={{ marginBottom: 10 }}
                keyword={this.state.keyword}
                hint={Strings.enter_hint}
                onChangeKeyword={(text) => {
                  this.setState({ keyword: text });
                }}
                onSearch={() => {
                  this.onSearch();
                }}
                onDelete={() => {
                  this.onRemove();
                }}
              />
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.addressList}
              style={{ marginTop: 20 }}
              renderItem={({ item, index }) => (
                <SelectAddressItem
                  item={item}
                  onPress={() => this.props.navigation.replace({ routeName: "SetAddress", params: { item: item } })}
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
        </TouchableWithoutFeedback>


      </KeyboardAvoidingView>
    );
  }
}

