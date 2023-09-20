import React, { Component } from "react";
import { FlatList, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Button, HorizontalLayout, RadioButton, ResizedImage, TopBar } from "../components/controls";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { MyStyles, Strings, TextStyles } from "../constants";
import Colors from "../constants/Colors";
import { BasketItem, SmallCardItem } from "../components/items";
import AskPopup from "../components/popups/AskPopup";
import GlobalState from "../mobx/GlobalState";
import EventBus from "react-native-event-bus";
import C, { API_RES_CODE } from "../constants/AppConstants";
import { Net, requestPost } from "../utils/APIUtils";
import Toast from "react-native-root-toast";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default class BasketScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foodList: [],
      cardList: [],
      storeName: GlobalState.shop_detail.shopName,
      payMethod: 1,
      deliveryType: 1,
      delConfirmPopup: false,
      point: "",
      setConfirmPopup: false,
      tempId: -1,
      cardId: false
    };
  }

  componentDidMount() {
    EventBus.getInstance().addListener(C.EVENT_PARAMS.ORDER_ADD, this.listener = ({}) => {
      this.loadFoodList();
    });
    EventBus.getInstance().addListener(C.EVENT_PARAMS.CARD_REGISTER, this.listener = ({}) => {
      this.setState({cardId:false})
      this.loadCardList();
    });
    this.loadCardList();
    this.loadFoodList();
  }

  componentWillUnmount() {
  }

  loadCardList() {
    requestPost(Net.home.card_list, { access_token: GlobalState.access_token }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        let cardList = [];
        response.data.list.forEach((item) => {
          cardList.push({
            cardName: item.category,
            cardType: item.type,
            cardNum: item.number,
            cardDetail: item.valid_period,
            cardOrigin: item.nickname,
            usage: item.usage,
            uid: item.uid
          });
          if (item.usage ==="1") {
            this.setState({cardId: true})
          }
        });
        cardList.push("");
        this.setState({ cardList: cardList });
      } else {
        Toast.show(response.msg);
      }
    });

  };

  doDefault(id) {
    requestPost(Net.home.set_card, {
      access_token: GlobalState.access_token,
      card_uid: this.state.cardList[id].uid,
    }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        this.loadCardList();
        Toast.show(Strings.card_set_success);
        EventBus.getInstance().fireEvent(C.EVENT_PARAMS.CARD_REGISTER, {});
      } else {
        Toast.show(response.msg);
      }
    });
  }

  loadFoodList() {
    let list = GlobalState.order.map((item) => {
      return {
        code: item.code,
        productName: item.name,
        content: item.content,
        price: item.total_price,
        quantity: item.count,
        itemPrice: item.price_each,
      };
    });
    this.setState({ foodList: list });
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onIncrease(id) {
    let { foodList } = this.state;
    foodList[id].quantity++;
    foodList[id].price += foodList[id].itemPrice;
    this.setState({ foodList: foodList });
    GlobalState.order[id].count = foodList[id].quantity;
    GlobalState.order[id].total_price = foodList[id].price;
    GlobalState.total_price += foodList[id].itemPrice;
    GlobalState.product_cnt++;
    EventBus.getInstance().fireEvent(C.EVENT_PARAMS.ORDER_ADD, {});
    EventBus.getInstance().fireEvent(C.EVENT_PARAMS.ITEM_ADD, { code: foodList[id].code, mode: "inc" });
  }

  onDecrease(id) {
    let { foodList } = this.state;
    if (foodList[id].quantity !== 1) {
      foodList[id].quantity--;
      foodList[id].price -= foodList[id].itemPrice;
      this.setState({ foodList: foodList });
      GlobalState.order[id].count = foodList[id].quantity;
      GlobalState.order[id].total_price = foodList[id].price;
      GlobalState.total_price -= foodList[id].itemPrice;
      GlobalState.product_cnt--;
      EventBus.getInstance().fireEvent(C.EVENT_PARAMS.ORDER_ADD, {});
      EventBus.getInstance().fireEvent(C.EVENT_PARAMS.ITEM_ADD, { code: foodList[id].code, mode: "dec" });
    }
  }

  onDeleteFood(id) {
    let { foodList } = this.state;
    let newList = foodList.filter((item, index) => {
      return id !== index;
    });
    this.setState({
      foodList: newList,
    });
    GlobalState.order = GlobalState.order.filter((item, index) => {
      return id !== index;
    });
    GlobalState.total_price -= foodList[id].price;
    GlobalState.product_cnt -= foodList[id].quantity;
    EventBus.getInstance().fireEvent(C.EVENT_PARAMS.ORDER_ADD, {});
  }

  onDeleteAll() {
    this.setState({ delConfirmPopup: true });
  }

  doDelAll() {
    this.setState({
      delConfirmPopup: false,
      foodList: [],
    });
    GlobalState.order = [];
    GlobalState.total_price = 0;
    GlobalState.product_cnt = 0;
    EventBus.getInstance().fireEvent(C.EVENT_PARAMS.ORDER_ADD, {});
  }

  onSetDefault(id) {
    this.setState({
      setConfirmPopup: true,
      tempId: id,
    });
  }

  onPointConfirm() {
    let point = parseInt(this.state.point);
    let GPoint = parseInt(GlobalState.me.point);
    if (GPoint < point) {
      this.setState({ point: GlobalState.me.point });
    }
  }

  onOrder() {
    if (GlobalState.total_price < parseInt(GlobalState.shop_detail.minOrder)) {
      Toast.show(Strings.select_more);
      return;
    }
    this.onPointConfirm();
    if (this.state.payMethod === 1 && !this.state.cardId) {
      Toast.show(Strings.register_your_card);
      return;
    }
    if (this.state.deliveryType === 2 && GlobalState.me.apart === undefined) {
      this.props.navigation.navigate("SelectApart");
    } else if (this.state.deliveryType === 1 && (GlobalState.me.delivery_address === undefined || GlobalState.me.delivery_address === null)) {
      this.props.navigation.navigate("AddressManage");
    } else {
      this.props.navigation.navigate({
        routeName: "OrderPayment",
        params: {
          deliveryType: this.state.deliveryType,
          payMethod: this.state.payMethod,
          point: this.state.point,
          cardRegister: this.state.cardList.length,
        },
      });
    }

  }


  render() {
    return (
      <KeyboardAvoidingView style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}
                            behavior={Platform.OS === "ios" ? "padding" : ""}>
        <TouchableWithoutFeedback onPress={() => this.onPointConfirm()}>
          <View style={[MyStyles.full, { backgroundColor: Colors.white }]}>
            <MyStatusBar theme="white" />
            <TopBar
              theme={"white"}
              title={Strings.basket}
              onBackPress={() => {
                this.onBack();
              }} />
            <View style={MyStyles.horizontal_divider} />
            <ScrollView showsVerticalScrollIndicator={false} disableScrollViewPanResponder={true}>
              <HorizontalLayout style={{ paddingHorizontal: 20, alignItems: "center", paddingTop: 20 }}>
                <Text style={{ fontSize: 16, color: Colors.black, flex: 1 }}>{this.state.storeName}</Text>
                {
                  this.state.foodList.length !== 0 &&
                  <Button style={styles.del_btn} onPress={() => this.onDeleteAll()}>
                    <Text style={{ fontSize: 12, color: Colors.white }}>{Strings.delete_all}</Text>
                  </Button>
                }
              </HorizontalLayout>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state.foodList}
                renderItem={({ item, index }) => (
                  <BasketItem
                    item={item}
                    onDecrease={() => this.onDecrease(index)}
                    onIncrease={() => this.onIncrease(index)}
                    onDeleteFood={() => this.onDeleteFood(index)}
                  />
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
              <Button onPress={() => {
                this.props.navigation.navigate({ routeName: "Detail", type: 1 });
              }}
                      style={styles.more_btn}>
                <Text style={{ fontSize: 12, color: Colors.white }}>{Strings.go_for_more}</Text>
              </Button>
              <View style={MyStyles.horizontal_divider} />
              <Text style={{ fontSize: 14, paddingHorizontal: 20, marginTop: 10 }}>{Strings.pay_method_credit}</Text>
              <View style={{ paddingLeft: 20, marginTop: 10 }}>
                <RadioButton
                  onPress={() => {
                    this.setState({ payMethod: 1 });
                  }}
                  selected={this.state.payMethod === 1}
                  title={Strings.credit_card_pay}
                />
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  data={this.state.cardList}
                  renderItem={({ item, index }) => {
                    return (
                      <View>
                        {
                          item !== "" &&
                          <SmallCardItem
                            item={item}
                            onSetDefault={() => this.onSetDefault(index)}
                          />
                        }
                        {
                          item === "" &&
                          <Button style={{
                            marginTop: 10,
                            backgroundColor: Colors.LIGHT_GREY,
                            borderRadius: 10,
                            width: 200,
                            height: 100,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                                  onPress={() => {
                                    this.props.navigation.navigate("PayManage");
                                  }}
                          >
                            <HorizontalLayout>
                              <ResizedImage source={require("src/assets/images/ic_card.png")}
                                            style={{
                                              height: 20,
                                              width: 20,
                                              position: "absolute",
                                              right: 90,
                                              top: -5,
                                            }} />
                              <ResizedImage source={require("src/assets/images/ic_card_add.png")}
                                            style={{ height: 40, width: 40 }} />
                            </HorizontalLayout>
                            <Text
                              style={{
                                fontSize: 14,
                                color: Colors.white,
                                marginTop: 10,
                              }}>{Strings.register_your_card}</Text>
                          </Button>
                        }
                      </View>
                    );
                  }}
                  refreshing={this.state.isRefreshing}
                  onEndReachedThreshold={0.1}
                  keyExtractor={(item, index) => index.toString()}
                  onEndThreshold={0.1}
                />
                <RadioButton
                  onPress={() => {
                    this.setState({ payMethod: 2 });
                  }}
                  selected={this.state.payMethod === 2}
                  title={Strings.account_transfer_pay}
                />
                <Text style={{
                  fontSize: 14,
                  color: Colors.black,
                  marginTop: 20,
                  marginBottom: 10,
                }}>{Strings.delivery_type}</Text>
                <RadioButton
                  onPress={() => {
                    this.setState({ deliveryType: 1 });
                  }}
                  selected={this.state.deliveryType === 1}
                  title={Strings.delivery}
                />
                <HorizontalLayout style={{ alignItems: "center", marginBottom: 20 }}>
                  <RadioButton
                    onPress={() => {
                      this.setState({ deliveryType: 2 });
                    }}
                    selected={this.state.deliveryType === 2}
                    title={Strings.take_out}
                  />
                  <Text style={{
                    fontSize: 12,
                    color: Colors.primary,
                    marginLeft: 5,
                    position: "absolute",
                    top: 14,
                    left: 100,
                  }}>{Strings.no_delivery_fee}</Text>
                </HorizontalLayout>
                <HorizontalLayout style={{ alignItems: "center", marginBottom: 50 }}>
                  <Text style={{ fontSize: 14, color: Colors.black, marginRight: 10 }}>{Strings.point}</Text>
                  <TextInput
                    value={this.state.point}
                    style={[TextStyles.TEXT_STYLE_14, {
                      paddingLeft: 20,
                      paddingVertical: 10,
                      borderColor: Colors.LIGHT_GREY,
                      borderWidth: 1,
                      borderRadius: 5,
                      height: 50,
                      flex: 1,
                    }]}
                    onChangeText={text => {
                      this.setState({ point: text });
                    }}
                    placeholder={Strings.enter_point}
                    keyboardType={"number-pad"}
                    placeholderTextColor={Colors.LIGHT_GREY}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      this.onPointConfirm();
                    }}
                  />
                  <Text style={{
                    fontSize: 14,
                    color: Colors.black,
                    marginLeft: 10,
                    marginRight: 20,
                  }}>{Strings.holding_point + " : " + GlobalState.me.point}P</Text>

                </HorizontalLayout>
              </View>
            </ScrollView>
            <View style={MyStyles.horizontal_divider} />
            <HorizontalLayout
              style={{ backgroundColor: Colors.white, paddingHorizontal: 20, height: 50, alignItems: "center" }}>
              <Text style={{ fontSize: 16, color: Colors.black, flex: 1 }}>{Strings.order_amount}</Text>
              <Text
                style={{ fontSize: 16, color: Colors.black }}>{GlobalState.total_price.toString() + Strings.$}</Text>
            </HorizontalLayout>
            <Button
              style={{
                height: 50,
                backgroundColor: Colors.primary,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                this.onOrder();
              }}
            >
              <Text style={{
                fontSize: 16,
                color: Colors.white,
              }}>{Strings.order_delivery_for + GlobalState.total_price.toString() + Strings.$}</Text>
            </Button>
            <AskPopup
              visible={this.state.delConfirmPopup}
              title={Strings.empty_cart_confirm}
              yes_no={false}
              onCancel={() => this.setState({ delConfirmPopup: false })}
              onConfirm={() => {
                this.doDelAll();
              }}
            />
            <AskPopup
              visible={this.state.setConfirmPopup}
              title={Strings.set_default_confirm}
              yes_no={false}
              onCancel={() => this.setState({ setConfirmPopup: false })}
              onConfirm={() => {
                this.setState({
                  setConfirmPopup: false,
                }, () => {
                  this.doDefault(this.state.tempId);
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
  del_btn: {
    width: 60,
    height: 30,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  more_btn: {
    height: 40,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
    marginHorizontal: 20,
  },
});
