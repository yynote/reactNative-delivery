import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, HorizontalLayout, ResizedImage, VerticalLayout } from "../controls";
import { Colors, MyStyles, Strings } from "../../constants";
import GlobalState from "../../mobx/GlobalState";
import FastImage from "react-native-fast-image";

export class OrderItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item } = this.props;
    return (
      <Button style={{ width: "100%", height: 250, backgroundColor: Colors.white }} onPress={()=>this.props.onGoDetail()}>
        <View style={MyStyles.horizontal_divider} />
        <VerticalLayout style={{ paddingHorizontal: 20 }}>
          <HorizontalLayout style={{ marginTop: 25 }}>
            <Text style={{ fontSize: 12, color: Colors.black, flex: 1 }}>{item.date}</Text>
            <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY }}>{GlobalState.delivery_status[parseInt(item.status)-1]}</Text>
          </HorizontalLayout>
          <HorizontalLayout style={{ marginTop: 15 }}>
            <VerticalLayout style={{ paddingVertical: 10, flex: 1 }}>
              <Text style={{ fontSize: 16, color: Colors.black }}>{item.shop_name}</Text>
              <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY, paddingTop: 10 }}>{item.product_name_str + item.product_price + Strings.$}</Text>
            </VerticalLayout>
            <FastImage source={{ uri: item.shop_image }} style={{ width: 90, height: 60, borderRadius: 10 }} resizeMode={FastImage.resizeMode.cover} />
          </HorizontalLayout>
          <Button
            style={[styles.btn, { backgroundColor: Colors.white_two, marginTop: 5 }]}
            onPress={() => this.props.onStoreDetail()}
          >
            <Text style={{ fontSize: 12, color: Colors.black }}>{Strings.go_store_detail}</Text>
          </Button>
          <Button
            style={[styles.btn, { backgroundColor: Colors.primary }]}
            onPress={() => {
              this.props.onGoReview();
            }}
          >
            <Text style={{ fontSize: 12, color: Colors.white }}>{Strings.go_write_review}</Text>
          </Button>
        </VerticalLayout>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    height: 40,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
});

export default OrderItem;
