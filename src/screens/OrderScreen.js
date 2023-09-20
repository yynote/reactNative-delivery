import React, { Component } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { MyStyles, Strings, TextStyles } from "../constants";
import { AdjustQuantity, Button, CheckBox, HorizontalLayout, ResizedImage, TopBar } from "../components/controls";
import C, { SCREEN_WIDTH } from "../constants/AppConstants";
import Toast from "react-native-root-toast";
import GlobalState from "../mobx/GlobalState";
import Common from "../utils/Common";
import EventBus from "react-native-event-bus";

export default class OrderScreen extends Component {
  constructor(props) {
    super(props);
    this.product = this.props.navigation.getParam("product");
    this.state = {
      requiredList: [],
      optionList: this.product.selectOption.split("#"),
      quantity: 1,
      totalPrice: parseInt(this.product.price) + parseInt(this.product.option.split("#")[0].split(":")[1]),
      selectedOption: 0,
      optionType: this.product.optionType,
      newItem: Common.check_new_item(this.product.name),
      itemIndex: -1,
    };
  }

  componentDidMount() {
    EventBus.getInstance().addListener(C.EVENT_PARAMS.ITEM_ADD, this.listener = ({ code, mode }) => {
      if (code === this.product.code) {
        this.setState({
          quantity: mode === "inc" ? this.state.quantity + 1 : this.state.quantity - 1,
        });
      }

    });
    if (GlobalState.order.length !== 0) {
      GlobalState.order.forEach((order, index) => {
        if (this.product.name === order.name) {
          let options = order.option.map((item) => {
            return item.name;
          });
          this.setState({ quantity: order.count });
          let requiredList = this.product.option.split("#").map((item) => {
            return {
              name: item.split(":")[0],
              price: item.split(":")[1],
              selected: options.indexOf(item.split(":")[0]) > -1,
            };
          });
          this.setState({ requiredList: requiredList });
          let optionList = this.product.selectOption.split("#").map((item) => {
            return {
              name: item.split(":")[0],
              price: item.split(":")[1],
              selected: options.indexOf(item.split(":")[0]) > -1,
            };
          });
          this.setState({ optionList: optionList, totalPrice: order.total_price / order.count, itemIndex: index });
        }
      });
    }
    if (this.state.newItem) {
      this.loadRequiredList();
      this.loadOptionList();
    }
  }

  componentWillUnmount() {
  }

  onBack() {
    this.props.navigation.goBack();
  }

  loadRequiredList() {
    let list = this.product.option.split("#").map((item, index) => {
      return {
        name: item.split(":")[0],
        price: item.split(":")[1],
        selected: index === 0,
      };
    });
    this.setState({ requiredList: list });
  }

  loadOptionList() {
    let list = this.product.selectOption.split("#").map((item, index) => {
      return {
        name: item.split(":")[0],
        price: item.split(":")[1],
        selected: false,
      };
    });
    this.setState({ optionList: list });
  }

  onRequireSelect(id) {
    let { requiredList } = this.state;
    for (let i = 0; i < requiredList.length; i++) {
      requiredList[i].selected = id === i;
    }
    if (id !== this.state.selectedOption) {
      let totalPrice = this.state.totalPrice + parseInt(requiredList[id].price) - parseInt(requiredList[this.state.selectedOption].price);
      this.setState({ totalPrice: totalPrice });
    }
    this.setState({ requiredList: requiredList, selectedOption: id });
  }

  onRequireType2(index) {
    let { requiredList } = this.state;
    requiredList[index].selected = !requiredList[index].selected;
    this.setState({
      requiredList: requiredList,
    });
    if (requiredList[index].selected) {
      this.setState({ totalPrice: this.state.totalPrice + parseInt(requiredList[index].price) });
    } else {
      this.setState({ totalPrice: this.state.totalPrice - parseInt(requiredList[index].price) });
    }
  }

  onOptionSelect(index) {
    let { optionList } = this.state;
    optionList[index].selected = !optionList[index].selected;
    this.setState({
      optionList: optionList,
    });
    if (optionList[index].selected) {
      this.setState({ totalPrice: this.state.totalPrice + parseInt(optionList[index].price) });
    } else {
      this.setState({ totalPrice: this.state.totalPrice - parseInt(optionList[index].price) });
    }

  }

  onIncrease() {
    let { quantity } = this.state;
    this.setState({ quantity: quantity + 1 });
  }

  onDecrease() {
    if (this.state.quantity !== 1) {
      let { quantity } = this.state;
      this.setState({ quantity: quantity - 1 });
    }
  }

  onPay() {
    let { requiredList } = this.state;
    let { optionList } = this.state;
    let selectedOptionList = [];
    if (this.product.optionType === "1") {
      let requireCheck = false;
      requiredList.forEach(option => {
        requireCheck = (requireCheck || option.selected);
      });
      if (!requireCheck) {
        Toast.show(Strings.select_require);
        return;
      }
    }
    requiredList.forEach(option => {
      if (option.selected) {
        selectedOptionList.push({
          name: option.name,
          price: option.price,
        });
      }
    });
    optionList.forEach(option => {
      if (option.selected) {
        selectedOptionList.push({
          name: option.name,
          price: option.price,
        });
      }
    });
    let content = Strings.base_price + ":" + this.product.price + Strings.$;
    selectedOptionList.forEach((item) => {
      content = content + "\n" + item.name + ":" + item.price.toString() + Strings.$;
    });
    let newItem = Common.check_new_item(this.product.name);
    let id = -1;
    GlobalState.order.forEach((order, index) => {
      if (this.product.name === order.name) {
        id = index;
      }
    });
    this.setState({ newItem: newItem, itemIndex: id }, () => {
      if (this.state.newItem) {
        GlobalState.order.push({
          name: this.product.name,
          code: this.product.code,
          price: parseInt(this.product.price),
          count: this.state.quantity,
          total_price: this.state.totalPrice * this.state.quantity,
          option: selectedOptionList,
          content: content,
          price_each: this.state.totalPrice,
        });
        GlobalState.total_price += this.state.totalPrice * this.state.quantity;
        GlobalState.product_cnt += this.state.quantity;
      } else {
        GlobalState.total_price = GlobalState.total_price + this.state.totalPrice * this.state.quantity - GlobalState.order[this.state.itemIndex].total_price;
        GlobalState.product_cnt = GlobalState.product_cnt + this.state.quantity - GlobalState.order[this.state.itemIndex].count;
        GlobalState.order[this.state.itemIndex].name = this.product.name;
        GlobalState.order[this.state.itemIndex].code = this.product.code;
        GlobalState.order[this.state.itemIndex].price = parseInt(this.product.price);
        GlobalState.order[this.state.itemIndex].count = this.state.quantity;
        GlobalState.order[this.state.itemIndex].total_price = this.state.quantity * this.state.totalPrice;
        GlobalState.order[this.state.itemIndex].option = selectedOptionList;
        GlobalState.order[this.state.itemIndex].content = content;
        GlobalState.order[this.state.itemIndex].price_each = this.state.totalPrice;
      }
      EventBus.getInstance().fireEvent(C.EVENT_PARAMS.ORDER_ADD, {});
    });
    this.props.navigation.navigate("Basket");
  }

  render() {
    return (
      <View style={[MyStyles.full, { backgroundColor: Colors.white }]}>
        <MyStatusBar theme="white" />
        <TopBar
          theme={"white"}
          title={Strings.order}
          onBackPress={() => {
            this.onBack();
          }} />
        <View style={{ height: 1, backgroundColor: Colors.LIGHT_GREY }} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <HorizontalLayout>
            <Text style={{ padding: 20, fontSize: 16, color: Colors.black, flex: 1 }}>{Strings.base_price}</Text>
            <Text style={{ padding: 20, fontSize: 16, color: Colors.black }}>{this.product.price + Strings.$}</Text>
          </HorizontalLayout>
          <View style={MyStyles.horizontal_divider} />
          <Text style={{ padding: 20, fontSize: 12, color: Colors.black }}>{Strings.required_optional}</Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={this.state.requiredList}
            style={{ paddingHorizontal: 20 }}
            renderItem={({ item, index }) => (
              <View>
                {
                  this.product.optionType === "0" &&
                  <HorizontalLayout style={{ marginBottom: 20 }}>
                    <Button style={{ flex: 1 }} onPress={() => this.onRequireSelect(index)}>
                      <HorizontalLayout style={{ alignItems: "center" }}>
                        <ResizedImage
                          source={item.selected ? require("src/assets/images/ic_radio_on.png") : require("src/assets/images/ic_radio_off.png")}
                        />
                        <Text style={{ fontSize: 12, color: Colors.black, marginLeft: 15 }}>{item.name}</Text>
                      </HorizontalLayout>
                    </Button>
                    <Text style={{ fontSize: 14, color: Colors.black }}>{item.price + Strings.$}</Text>
                  </HorizontalLayout>
                }
                {
                  this.product.optionType === "1" &&
                  <HorizontalLayout style={{ marginBottom: 20 }}>
                    <CheckBox
                      style={{ alignItems: "center" }}
                      checked={item.selected}
                      textStyle={{
                        color: item.selected ? Colors.black : Colors.LIGHT_GREY,
                        fontSize: 12,
                        marginLeft: 5,
                      }}
                      label={item.name}
                      onPress={() => {
                        this.onRequireType2(index);
                      }}
                    />
                    <Text style={{
                      fontSize: 14,
                      color: item.selected ? Colors.black : Colors.LIGHT_GREY,
                      position: "absolute",
                      right: 0,
                    }}>{item.price + Strings.$}</Text>
                  </HorizontalLayout>
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
          <View style={[{ marginTop: 5 }, MyStyles.horizontal_divider]} />
          <Text style={{ padding: 20, fontSize: 12, color: Colors.black, flex: 1 }}>{Strings.optional}</Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={this.state.optionList}
            style={{ paddingHorizontal: 20 }}
            renderItem={({ item, index }) => (
              <HorizontalLayout style={{ marginBottom: 30, alignItems: "center" }}>
                <CheckBox
                  style={{ alignItems: "center" }}
                  checked={item.selected}
                  textStyle={{ color: item.selected ? Colors.black : Colors.LIGHT_GREY, fontSize: 12, marginLeft: 5 }}
                  label={item.name}
                  onPress={() => {
                    this.onOptionSelect(index);
                  }}
                />
                <Text style={{
                  fontSize: 14,
                  color: item.selected ? Colors.black : Colors.LIGHT_GREY,
                  position: "absolute",
                  right: 0,
                }}>{item.price + Strings.$}</Text>
              </HorizontalLayout>

            )}
            onEndReachedThreshold={0.1}
            keyExtractor={(item, index) => `sale-${index.toString()}`}
          />
          <View style={[MyStyles.horizontal_divider]} />

        </ScrollView>
        <HorizontalLayout style={{ padding: 20 }}>
          <Text style={{ fontSize: 14, color: Colors.black, flex: 1 }}>{Strings.quantity}</Text>
          <AdjustQuantity
            buttonStyle={{ width: 30, height: 35 }}
            textStyle={{ fontSize: 16 }}
            quantity={this.state.quantity}
            onDecrease={() => this.onDecrease()}
            onIncrease={() => this.onIncrease()}
          />
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
            this.onPay();
          }}
        >
          <HorizontalLayout>
            <Text style={{
              fontSize: 16,
              color: Colors.white,
            }}>{this.state.totalPrice * this.state.quantity + Strings.$}</Text>
            <Text style={{
              fontSize: 16,
              color: Colors.white,
              position: "absolute",
              right: -SCREEN_WIDTH / 2 + 50,
            }}>{Strings.add} {this.state.quantity}</Text>
          </HorizontalLayout>
        </Button>


      </View>
    );
  }
}
