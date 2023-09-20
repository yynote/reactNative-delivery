import React from "react";
import { Text } from "react-native";
import { Button } from "../controls";
import { Colors, MyStyles } from "../../constants";
import Common from "../../utils/Common";
import FastImage from "react-native-fast-image";

export class FoodCateItem extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const { item } = this.props;
    const numColumns = this.props.numColumns;
    return (
      <Button
        style={[{ marginTop: 10, width: Common.cal_width(numColumns) + 20, paddingTop: 10 }, MyStyles.center]}
        onPress={() => this.props.onPress()}
      >
        <FastImage source={{ uri: item.image }}
                   style={{ width: Common.cal_width(numColumns), height: Common.cal_width(numColumns) }}
                   resizeMode={FastImage.resizeMode.cover} />
        <Text style={{ marginTop: 5, fontSize: numColumns < 5 ? 15 : 12, color: Colors.black }} numberOfLines={1}
              ellipsizeMode="tail">{item.name}</Text>
      </Button>
    );
  }
}

export default FoodCateItem;
