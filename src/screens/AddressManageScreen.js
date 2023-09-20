import React, { Component } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, SearchBox, TopBar } from "../components/controls";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { MyStyles, Strings, TextStyles } from "../constants";
import Colors from "../constants/Colors";
import { AddressItem } from "../components/items";
import AskPopup from "../components/popups/AskPopup";
import EventBus from "react-native-event-bus";
import C, { API_RES_CODE } from "../constants/AppConstants";
import GlobalState from "../mobx/GlobalState";
import { Net, requestPost } from "../utils/APIUtils";
import Toast from "react-native-root-toast";

export default class AddressManageScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      addressList: [],
      isRefreshing: false,
      delPopup: false,
      delId: -1,
      basicUid: -1,
      basicId: -1,
    };
  }

  componentDidMount() {
    this.loadAddressList("");
    EventBus.getInstance().addListener(C.EVENT_PARAMS.ADDRESS_ADD, this.listener = ({}) => {
      this.loadAddressList("");
    });
  }

  componentWillUnmount() {
  }

  onSearch() {
    Keyboard.dismiss();
    this.loadAddressList(this.state.keyword);
  }

  onRemove() {
    this.setState({ keyword: "" });
  }


  loadAddressList(keyword) {
    requestPost(Net.home.address_list, { access_token: GlobalState.access_token, keyword: keyword }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        let list = response.data;
        if (list.length === undefined) {
          list = [];
        }
        list.push({
          uid: -2,
        });
        list.forEach((item, idx) => {
          if (item.usage === "1") {
            this.setState({ basicUid: parseInt(item.uid), basicId: idx });
          }
        });
        this.setState({ addressList: list, isRefreshing: false });
      } else {
        Toast.show(response.msg);
      }
    });
  }

  onDeleteAddress(id) {
    this.setState({ delPopup: true, delId: id });
  }

  doDeleteAddress(id) {
    let { addressList } = this.state;
    requestPost(Net.home.address_del, {
      access_token: GlobalState.access_token,
      address_uid: addressList[id].uid,
    }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        let newList = addressList.filter((item, index) => id !== index);
        this.setState({
          addressList: newList,
        });
        if (id === this.state.basicId) {
          this.setState({ basicUid: -1, basicId: -1 });
          GlobalState.me.delivery_address = undefined;
          EventBus.getInstance().fireEvent(C.EVENT_PARAMS.ADDRESS_SELECT, {});
        }
      } else {
        Toast.show(response.msg);
      }
    });
  }

  onBasicSet(id) {
    let { addressList } = this.state;
    addressList = addressList.map((item, index) => {
      item.usage = id === index ? "1" : "0";
      return item;
    });
    this.setState({ addressList: addressList, basicUid: addressList[id].uid, basicId: id });
  }

  onChangeAddress() {
    if (this.state.basicId === -1) {
      Toast.show(Strings.no_basic_address);
      return;
    }
    requestPost(Net.home.address_set, {
      access_token: GlobalState.access_token,
      address_uid: this.state.basicUid,
    }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        Toast.show(Strings.address_changed);
        GlobalState.me.delivery_address = this.state.addressList[this.state.basicId];
        EventBus.getInstance().fireEvent(C.EVENT_PARAMS.ADDRESS_SELECT, {});
        this.props.navigation.goBack();
      } else {
        Toast.show(response.msg);
      }
    });

  }


  render() {
    return (
      <KeyboardAvoidingView style={{ width: "100%", height: "100%", backgroundColor: Colors.white_two }}
                            behavior={Platform.OS === "ios" ? "padding" : ""}>
        <MyStatusBar theme="white" />
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => {
        }}>
          <View style={MyStyles.full}>
            <TopBar
              theme={"white"}
              title={Strings.delivery_address_manage}
              style={[{ width: "100%" }, MyStyles.shadow]}
              onBackPress={() => {
                this.props.navigation.goBack();
              }} />
            <View style={styles.search_area}>
              <SearchBox
                keyword={this.state.keyword}
                hint={Strings.search_address}
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
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
              <Text style={{ padding: 20, fontSize: 14, color: Colors.black }}>{Strings.registered_address}</Text>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state.addressList}
                style={{ marginBottom: 50 }}
                renderItem={({ item, index }) => (
                  <View>
                    {
                      item.uid !== -2 &&
                      <AddressItem
                        item={item}
                        onDeleteAddress={() => this.onDeleteAddress(index)}
                        onBasicSet={() => this.onBasicSet(index)}
                      />
                    }
                    {
                      item.uid === -2 &&
                      <Button style={styles.add_btn} onPress={() => this.props.navigation.navigate("SelectAddress")}>
                        <Text style={{ fontSize: 14, color: Colors.white }}>{Strings.add_delivery_address}</Text>
                      </Button>
                    }
                  </View>
                )}
                refreshing={this.state.isRefreshing}
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
            </ScrollView>
            <Button
              style={{
                height: 50,
                backgroundColor: Colors.primary,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 25,
              }}
              onPress={() => {
                this.onChangeAddress();
              }}
            >
              <Text style={{ fontSize: 16, color: Colors.white }}>{Strings.change_delivery_address}</Text>
            </Button>
            <AskPopup
              visible={this.state.delPopup}
              title={Strings.delete_address_pop}
              yes_no={false}
              onCancel={() => this.setState({ delPopup: false })}
              onConfirm={() => {
                this.setState({
                  delPopup: false,
                }, () => {
                  this.doDeleteAddress(this.state.delId);
                });
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  search_area: {
    width: "100%",
    height: 70,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 2,
    elevation: 5,


  },
  add_btn: {
    width: 200,
    height: 40,
    backgroundColor: Colors.primary,
    borderRadius: 40,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
});
