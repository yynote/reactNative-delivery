import React, { Component } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { HorizontalLayout, TopBar, VerticalLayout } from "../components/controls";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { Strings, TextStyles } from "../constants";
import Colors from "../constants/Colors";
import { IMAGE_FOO_URL } from "../constants/AppConstants";
import FastImage from "react-native-fast-image";
import moment from "moment";
import { ScrollView } from "react-native-gesture-handler";
import Common from "../utils/Common";

export default class OrderDetailScreen extends Component {
  constructor(props) {
    super(props);

    this.order = this.props.navigation.getParam("order");

    this.weekdays = [
      Strings.sunday,
      Strings.monday,
      Strings.tuesday,
      Strings.wednesday,
      Strings.thursday,
      Strings.friday,
      Strings.saturday,
    ];

    this.state = {
      weekday: "",
      showReasonPopup: false,
    };
  }

  componentDidMount() {
    this.setState({
      weekday: this.weekdays[moment(this.order.date, "YYYY-MM-DD").day()],
    });
  }

  componentWillUnmount() {
  }

  onBack = () => {
    this.props.navigation.goBack();
  };

  onCancel() {
    this.setState({
      showReasonPopup: true,
    });
  }

  onReject(reasonId) {
    this.setState({
      showReasonPopup: false,
    }, () => this.onBack);
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}>
        <MyStatusBar theme="white" />
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => {
          Keyboard.dismiss();
        }}>
          <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}>
            <TopBar
              theme={"white"}
              title={Strings.order_history}
              onBackPress={() => {
                this.onBack();
              }} />
            <ScrollView style={{ flex: 1 }}>
              <View style={[styles.horizontal_divider]} />
              <View style={{ backgroundColor: Colors.white_two, paddingBottom: 15 }}>
                <VerticalLayout style={styles.top_area}>
                  <HorizontalLayout>
                    <FastImage
                      source={{ uri: this.order.shop_image }}
                      style={{ width: 100, height: 65, borderRadius: 5 }} />
                    <VerticalLayout style={{ marginLeft: 20 }}>
                      <Text style={styles.text_title}>
                        {`${this.order.date} (${this.state.weekday})`}
                      </Text>
                      <Text style={styles.text_shop}>
                        {this.order.shop_name}
                      </Text>
                      <Text style={[styles.text_product, { marginTop: 5 }]}>
                        {this.order.product_name_str}
                      </Text>
                    </VerticalLayout>
                  </HorizontalLayout>
                  <View style={[styles.horizontal_divider, { marginTop: 20 }]} />
                  <HorizontalLayout style={{ width: "100%" }}>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      numColumns={1}
                      data={JSON.parse(this.order.product)}
                      renderItem={({ item, index }) =>
                        <VerticalLayout style={{ width: "100%" }}>
                          <Text style={[styles.text_shop]}>
                            {item.name}
                          </Text>
                          <Text style={[styles.text_product, { marginTop: 5 }]}>
                            {"- " + Strings.base_price + " : " + item.price + Strings.$}
                          </Text>
                          <Text style={[styles.text_product]}>
                            {"- " + Strings.quantity + " : " + item.count}
                          </Text>
                          <FlatList
                            showsVerticalScrollIndicator={false}
                            numColumns={1}
                            data={item.option}
                            renderItem={({ item, index }) =>
                              <Text style={[styles.text_product]}>
                                {"- " + item.name + " : " + item.price + Strings.$}
                              </Text>
                            }
                            ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
                            onEndThreshold={0.1}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={(<View />)}
                          />
                          <Text style={[styles.text_title, { marginTop: 5 }]}>
                            {"- " + Strings.total_pay_price + " : " + item.total_price + Strings.$}
                          </Text>
                        </VerticalLayout>
                      }
                      ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
                      onEndThreshold={0.1}
                      keyExtractor={(item, index) => index.toString()}
                      ListEmptyComponent={(
                        this.state.showOption &&
                        <View style={{
                          width: "100%",
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 50,
                        }}>
                          <Text style={TextStyles.TEXT_STYLE_14}>{Strings.no_item}</Text>
                        </View>
                      )}
                    />
                  </HorizontalLayout>
                  <View style={[styles.horizontal_divider, { marginTop: 20 }]} />
                </VerticalLayout>
              </View>
              <View style={{ backgroundColor: Colors.white_two, paddingBottom: 15 }}>
                <VerticalLayout style={styles.center_area}>
                  <HorizontalLayout>
                    <Text style={[styles.text_title, { flex: 1 }]}>
                      {Strings.recipient}
                    </Text>
                    <Text style={styles.text_product}>{this.order.user_name}</Text>
                  </HorizontalLayout>
                  <View style={[styles.horizontal_divider, { marginVertical: 20 }]} />
                  <HorizontalLayout style={{}}>
                    <Text style={[styles.text_title, { flex: 1 }]}>
                      {Strings.delivery_address}
                    </Text>
                    <VerticalLayout>
                      <Text style={styles.text_product}>{this.order.delivery_address}</Text>
                    </VerticalLayout>
                  </HorizontalLayout>
                  <View style={[styles.horizontal_divider, { marginVertical: 20 }]} />
                  <HorizontalLayout>
                    <Text style={[styles.text_title, { flex: 1 }]}>
                      {Strings.phone_number}
                    </Text>
                    <Text style={styles.text_product}>{this.order.user_phone}</Text>
                  </HorizontalLayout>
                  <View style={[styles.horizontal_divider, { marginVertical: 20 }]} />
                  <HorizontalLayout>
                    <Text style={[styles.text_title]}>
                      {Strings.requests}
                    </Text>
                    <Text style={[styles.text_product, { flex: 1, marginLeft: 20 }]}>{this.order.request}</Text>
                  </HorizontalLayout>
                </VerticalLayout>
              </View>
              <VerticalLayout style={styles.center_area}>
                <HorizontalLayout>
                  <Text style={[styles.text_title, { flex: 1 }]}>
                    {Strings.total_pay_price}
                  </Text>
                  <Text style={styles.text_price}>{Common.formatNumber(this.order.product_price) + Strings.$}</Text>
                </HorizontalLayout>
                <View style={[styles.horizontal_divider, { marginVertical: 10 }]} />
                <HorizontalLayout>
                  <Text style={[styles.text_title, { flex: 1 }]}>
                    {Strings.delivery_fee}
                  </Text>
                  <Text style={[styles.text_price, { marginBottom: 30 }]}>
                    {
                      this.order.type === "1"
                        ? Common.formatNumber(this.order.fee) + Strings.$
                        : Strings.no_delivery_fee
                    }
                  </Text>
                </HorizontalLayout>
              </VerticalLayout>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  horizontal_divider: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.white_grey,
  },

  top_area: {
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: 20,
    backgroundColor: Colors.white,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 2,
    elevation: 5,
  },

  text_title: {
    fontSize: 14,
    color: Colors.black,
  },
  text_shop: {
    fontSize: 16,
    color: Colors.black,
    marginTop: 5,
  },
  text_product: {
    fontSize: 14,
    color: Colors.LIGHT_GREY,
  },
  text_price: {
    fontSize: 16,
    color: Colors.primary,
  },
  center_area: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cancel_btn: {
    backgroundColor: Colors.cancel_color,
    height: 50,
    marginBottom: 20,
  },
});



