import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AdjustQuantity, Button, HorizontalLayout } from "../controls";
import { Colors, MyStyles, Strings } from "../../constants";

export class BasketItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item } = this.props;
    return (
      <View>
        <View style={[MyStyles.horizontal_divider, { marginTop: 10 }]} />
        <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
          <HorizontalLayout style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 14, color: Colors.black, flex: 1 }}>{item.productName}</Text>
            <Button style={styles.del_btn} onPress={() => this.props.onDeleteFood()}>
              <Text style={{ fontSize: 12, color: Colors.white }}>{Strings.delete}</Text>
            </Button>
          </HorizontalLayout>
          <Text style={{ fontSize: 10, color: Colors.LIGHT_GREY, lineHeight: 15 }}>{item.content}</Text>
          <HorizontalLayout style={{ marginTop: 10, alignItems: "center" }}>
            <Text style={{ fontSize: 18, color: Colors.black, flex: 1 }}>{item.itemPrice * item.quantity + Strings.$}</Text>
            <AdjustQuantity
              buttonStyle={{ width: 20, height: 30 }}
              textStyle={{ fontSize: 12 }}
              quantity={item.quantity}
              onDecrease={() => this.props.onDecrease()}
              onIncrease={() => this.props.onIncrease()}
            />
          </HorizontalLayout>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  del_btn: {
    width: 50,
    height: 30,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default BasketItem;
