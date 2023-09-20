import React from "react";
import { Text, View } from "react-native";
import { Button } from "../controls";
import { Colors } from "../../constants";
import { SCREEN_WIDTH } from "../../constants/AppConstants";

export class FaqCategoryItem extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { selected } = nextProps;
    const { selected: oldSelected } = this.props;
    return selected !== oldSelected;
  }

  componentDidMount() {
  }

  render() {
    const { item, index } = this.props;

    return (
      <Button
        style={{ width: (SCREEN_WIDTH - 40) / 4, height: 60 }}
        onPress={() => {
          if (this.props.onPress) {
            this.props.onPress();
          }
        }}
      >
        <View
          style={{
            height: "100%",
            width: "100%",
            backgroundColor:
              this.props.selected ? Colors.primary : Colors.white,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: Colors.white_two,
          }}>
          <Text style={{
            fontSize: 12,
            color: this.props.selected ? Colors.white : Colors.black,
            textAlign: "center",
            paddingHorizontal: 7,
          }}>{item.title}</Text>
        </View>
      </Button>
    );
  }
}

export default FaqCategoryItem;
