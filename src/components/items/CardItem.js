import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, HorizontalLayout, ResizedImage } from "../controls";
import { Colors } from "../../constants";

export class CardItem extends React.Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
  }

  render() {
    const { item } = this.props;
    return (
      <Button style={styles.main_tab} onPress={() => this.props.onSetDefault()}>
        <HorizontalLayout style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 20, color: Colors.white, flex: 1 }}>{item.nickname}</Text>
          <Button
            style={{ height: 30, width: 30, alignItems: "center", justifyContent: "center" }}
            onPress={() => this.props.onDelete()}
          >
            <ResizedImage source={require("src/assets/images/ic_trash.png")} style={{ width: 20 }} />
          </Button>
        </HorizontalLayout>
        <HorizontalLayout style={{ marginTop: 15 }}>
          <View style={{ flex: 1 }} />
          <Text style={{ fontSize: 16, color: Colors.white, marginRight: 40 }}>{item.type}</Text>
        </HorizontalLayout>
        <Text style={{ fontSize: 19, color: Colors.white, marginVertical: 15 }}>{"**** **** **** "+item.number.slice(15,19)}</Text>
        <HorizontalLayout style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: Colors.white, flex: 1 }}>{item.valid_period}</Text>
          <Text style={{ fontSize: 16, color: Colors.white, marginRight: 10 }}>{item.owner}</Text>
          <Button
            style={{ height: 30, width: 30, alignItems: "center", justifyContent: "center" }}
          >
            <ResizedImage
              source={item.usage === "1" ?
                require("src/assets/images/ic_heart_white.png") :
                require("src/assets/images/ic_heart_white_off.png")
              }
              style={{ width: 20 }} />
          </Button>
        </HorizontalLayout>
      </Button>

    );
  }
}

const styles = StyleSheet.create({
  main_tab: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    height: 170,
    paddingVertical: 10,
    paddingLeft: 20,
    paddingRight: 10,
    marginBottom: 10,
  },
});

export default CardItem;
