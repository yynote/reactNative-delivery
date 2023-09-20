import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, HorizontalLayout, ResizedImage } from "../controls";
import { Colors } from "../../constants";

export class SmallCardItem extends React.Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
  }

  render() {
    const { item } = this.props;
    return (
      <Button style={styles.main_tab} onPress={() => this.props.onSetDefault()}>
        <HorizontalLayout>
          <Text style={{ fontSize: 14, color: Colors.white, flex:1 }}>{item.cardName}</Text>
          <ResizedImage
            source={item.usage === "1" ?
              require("src/assets/images/ic_heart_white.png") :
              require("src/assets/images/ic_heart_white_off.png")
            }
            style={{ width: 20 }} />
        </HorizontalLayout>
        <HorizontalLayout style={{ marginTop: 3 }}>
          <View style={{ flex: 1 }} />
          <Text style={{ fontSize: 14, color: Colors.white }}>{item.cardType}</Text>
        </HorizontalLayout>
        <Text style={{ fontSize: 14, color: Colors.white, marginVertical: 3 }}>{"**** **** **** "+item.cardNum.slice(15,19)}</Text>
        <HorizontalLayout style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 14, color: Colors.white, flex: 1 }}>{item.cardDetail}</Text>
          <Text style={{ fontSize: 14, color: Colors.white }}>{item.cardOrigin}</Text>
        </HorizontalLayout>
      </Button>

    );
  }
}

const styles = StyleSheet.create({
  main_tab: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    width: 200,
    height: 100,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    marginRight: 10,
  },
});

export default SmallCardItem;
