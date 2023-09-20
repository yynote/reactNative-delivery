import React from "react";
import { Text } from "react-native";
import { Button, HorizontalLayout } from "./index";
import Colors from "../../constants/Colors";
import { MyStyles } from "../../constants";

export class AdjustQuantity extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { quantity } = this.props;
    return (
      <HorizontalLayout style={{ alignItems: "center" }}>
        <Button style={[this.props.buttonStyle, { borderColor: Colors.LIGHT_GREY, borderWidth: 1 }, MyStyles.center]}
                onPress={() => {
                  this.props.onDecrease();
                }}>
          <Text
            style={{
              fontSize: this.props.textStyle ? 20 : 25,
              color: quantity === 1 ? Colors.LIGHT_GREY : Colors.black,
            }}>-</Text>
        </Button>
        <Text style={[{ color: Colors.black, marginHorizontal: 20 }, this.props.textStyle]}>{quantity}</Text>
        <Button style={[this.props.buttonStyle, { borderColor: Colors.LIGHT_GREY, borderWidth: 1 }, MyStyles.center]}
                onPress={() => {
                  this.props.onIncrease();
                }}>
          <Text style={[{ color: Colors.black }, this.props.textStyle]}>+</Text>
        </Button>
      </HorizontalLayout>
    );
  }
}








