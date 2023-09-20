import React, { Component } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { MyStyles, Strings, TextStyles } from "../constants";
import Colors from "../constants/Colors";
import { Button, HorizontalLayout, MainTopBar, VerticalLayout } from "../components/controls";
import { ApartOrderItem, FoodCateItem } from "../components/items";
import AskPopup from "../components/popups/AskPopup";
import C, { API_RES_CODE } from "../constants/AppConstants";
import { Net, requestPost } from "../utils/APIUtils";
import Toast from "react-native-root-toast";
import GlobalState from "../mobx/GlobalState";
import EventBus from "react-native-event-bus";

export default class FreeDeliveryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: (GlobalState.me.delivery_address ===undefined || GlobalState.me.delivery_address === null)?Strings.please_select_address: GlobalState.me.delivery_address.address,
      myApt: GlobalState.me.apart,
      apartOrderList: [],
      categoryList: [],
      resetConfirmPopup: false,
      loginConfirm: false
    };
  }

  componentDidMount() {
    if (this.state.myApt !== undefined) {
      this.loadApartOrderList();
    }
    this.loadCategoryList();
    EventBus.getInstance().addListener(C.EVENT_PARAMS.APT_SELECT, this.listener = ({}) => {
      this.setState({ myApt: GlobalState.me.apart });
    });
    EventBus.getInstance().addListener(C.EVENT_PARAMS.ADDRESS_SELECT, this.listener = ({}) => {
      if (GlobalState.me.delivery_address !== undefined) {
        this.setState({ title: GlobalState.me.delivery_address.address });
      } else {
        this.setState({ title: Strings.please_select_address });
      }
    });
  }

  componentWillUnmount() {
  }

  loadApartOrderList() {
    requestPost(Net.home.user_apart_order, {
      access_token: GlobalState.access_token,
      apart_uid: GlobalState.me.apart.uid,
    }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        this.setState({ apartOrderList: response.data.list });

      } else {
        Toast.show(response.msg);
      }
    });
  }

  loadCategoryList() {
    requestPost(Net.home.category_list, {}).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        this.setState({ categoryList: response.data });
        GlobalState.categoryList = response.data;
      } else {
        Toast.show(response.msg);
      }
    });
  }


  onReset() {
    this.setState({ resetConfirmPopup: true });
  }

  doReset() {
    this.setState({ myApt: undefined });
    requestPost(Net.home.set_apart, { access_token: GlobalState.access_token, apart_uid: 0 }).then(response => {
      if (response.result !== API_RES_CODE.SUCCESS) {
        Toast.show(response.msg);
      }
    });
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onSearchAddress () {
    if (GlobalState.me.uid === 0) {
      this.setState({loginConfirm: true});
    } else {
      this.props.navigation.navigate("AddressManage")
    }
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
        <View style={{ height: 1, backgroundColor: Colors.divider }} />
        <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 20, flex: 1, paddingBottom: 50 }}>
          <View
            style={{ backgroundColor: Colors.primary, height: 40, justifyContent: "center", paddingHorizontal: 10 }}>
            <Text style={{ fontSize: 20, color: Colors.white, marginLeft: 10 }} numberOfLines={1}
                  ellipsizeMode="tail">{Strings.delivery_free_when}</Text>
          </View>
          {
            (this.state.myApt === undefined) &&
            <View style={[MyStyles.center, {
              height: 120,
              borderRadius: 10,
              borderColor: Colors.divider2,
              borderWidth: 1,
              marginTop: 20,
            }]}>
              <Text style={{ fontSize: 20, color: Colors.black }}>{Strings.no_apart_selected}</Text>
              <Button
                style={[{
                  height: 35,
                  backgroundColor: Colors.primary,
                  borderRadius: 10,
                  paddingHorizontal: 20,
                  marginTop: 10,
                }, MyStyles.center]}
                onPress={() => {
                  if (GlobalState.me.uid === 0) {
                    this.setState({loginConfirm : true});
                  } else {
                    this.props.navigation.navigate("SelectApart");
                  }
                }}
              >
                <Text style={{ color: Colors.white, fontSize: 18 }}>{Strings.go_apart_selection}</Text>
              </Button>
            </View>
          }
          {
            (this.state.myApt !== undefined) &&
            <View>
              <Button onPress={() => {
                this.onReset();
              }}>
                <HorizontalLayout style={{ marginTop: 10 }}>
                  <View style={{ flex: 1 }} />
                  <VerticalLayout style={{height: 50 }}>
                    <View style={{
                      height: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: Colors.light_black,
                    }}>
                      <Text style={{ fontSize: 8, color: Colors.white }}>{Strings.my_apt}</Text>
                    </View>
                    <HorizontalLayout style={{ marginTop: 1 }}>
                      <View style={{
                        backgroundColor: Colors.primary,
                        height: 30,
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 90,
                        paddingHorizontal: 10
                      }}>
                        <Text style={{ color: Colors.white, fontSize: 15 }}>
                          {this.state.myApt == null ? "" : this.state.myApt.name}</Text>
                      </View>
                      <View style={{
                        backgroundColor: Colors.red,
                        height: 30,
                        alignItems: "center",
                        justifyContent: "center",
                        width: 60,
                      }}>
                        <Text style={{ color: Colors.white, fontSize: 15 }}>{Strings.reset}</Text>
                      </View>
                    </HorizontalLayout>
                  </VerticalLayout>
                </HorizontalLayout>
              </Button>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state.apartOrderList}
                numColumns={1}
                renderItem={({ item }) => (
                  <ApartOrderItem
                    numColumns={1}
                    item={item}
                  />
                )}
                refreshing={this.state.isRefreshing}
                // onRefresh={() => this.handleLoadMore(true)}
                // onEndReached={() => this.handleLoadMore(false)}
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
          <FlatList
            showsVerticalScrollIndicator={false}
            data={this.state.categoryList}
            numColumns={4}
            style={{ paddingBottom: 50 }}
            renderItem={({ item }) => (
              <FoodCateItem
                numColumns={4}
                item={item}
                onPress={() => this.props.navigation.navigate({ routeName: "Store", params: { item: item.uid } })}
              />
            )}
            refreshing={this.state.isRefreshing}
            // onRefresh={() => this.handleLoadMore(true)}
            // onEndReached={() => this.handleLoadMore(false)}
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

        </ScrollView>
        <AskPopup
          visible={this.state.resetConfirmPopup}
          title={Strings.reset_apart_confirm}
          yes_no={false}
          onCancel={() => this.setState({ resetConfirmPopup: false })}
          onConfirm={() => {
            this.setState({
              resetConfirmPopup: false,
            }, () => {
              this.doReset();
            });
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


