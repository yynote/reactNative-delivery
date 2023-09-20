import React from "react";
import { Text, View } from "react-native";
import { Button, HorizontalLayout } from "../controls";
import { Colors, Strings } from "../../constants";

export class PointItem extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const { item } = this.props;

    return (
      <Button onPress={() => {
        if (this.props.onPress) {
          this.props.onPress();
        }
      }}>
        <View style={{ paddingHorizontal: 20, height: 69 }}>
          <HorizontalLayout>
            <Text style={{ fontSize: 14, flex: 1, color: Colors.black, paddingTop: 15 }}>{item.shop_name}</Text>
            <Text style={{ fontSize: 12, color: Colors.primary, paddingTop: 15 }}>{item.type ==="1"? "+" +item.point: "-" +item.point}</Text>
            <Text style={{ fontSize: 12, color: Colors.black, paddingTop: 15 }}>{Strings.$}</Text>
          </HorizontalLayout>
          <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY, paddingTop: 10 }}>{item.created_at.split(" ")[0]}</Text>
        </View>
        <View style={{ height: 1, backgroundColor: Colors.white_two }} />
      </Button>
    );
  }
}

export default PointItem;
