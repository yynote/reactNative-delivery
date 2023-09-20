import React from "react";
import { Text } from "react-native";
import { Button, HorizontalLayout, ResizedImage } from "./index";
import Colors from "../../constants/Colors";

export class RadioButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Button onPress={() => {
        this.props.onPress();
      }}>
        <HorizontalLayout style={{ alignItems: "center", marginTop: 10 }}>
          <ResizedImage
            source={this.props.selected ? require("src/assets/images/ic_radio_on.png") : require("src/assets/images/ic_radio_off.png")}
          />
          <Text style={{
            fontSize: this.props.fontSize ?? 12,
            color: this.props.selected ? Colors.black : Colors.LIGHT_GREY,
            marginLeft: 5,
          }}>{this.props.title}</Text>
        </HorizontalLayout>
      </Button>
    );
  }
}
