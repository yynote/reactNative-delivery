import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, HorizontalLayout, ResizedImage, VerticalLayout } from "../controls";
import { Colors, Strings } from "../../constants";
import FastImage from "react-native-fast-image";

export class BookmarkItem extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const { item } = this.props;
    const image = item.shop_image.split("#")[0];
    return (
      <Button style={styles.main_tab}>
        <HorizontalLayout style={{ alignItems: "center" }}>
          <FastImage source={{ uri: image }} style={styles.img_food} resizeMode={"cover"} />
          <View style={{ flex: 1 }} />
          <VerticalLayout style={{ justifyContent: "center", alignItems: "center" }}>
            <ResizedImage source={require("src/assets/images/ic_star_red_small.png")}
                          style={{ width: 15, height: 15 }} />
            <Text style={{ fontSize: 16, color: Colors.black, marginTop: 10 }}>{item.shop_name}</Text>
            {/*<Text style={{ fontSize: 12, color: Colors.LIGHT_GREY, marginTop: 10 }}>{2000 + Strings.$}</Text>*/}
            <Button style={styles.go_btn} onPress={() => this.props.onPress()}>
              <HorizontalLayout style={{ alignItems: "center", justifyContent: "center" }}>
                <ResizedImage source={require("src/assets/images/ic_shop.png")} style={{ width: 15, height: 15 }} />
                <Text style={{ fontSize: 14, color: Colors.black, marginLeft: 5 }}>{Strings.go_shop}</Text>
              </HorizontalLayout>
            </Button>
          </VerticalLayout>
        </HorizontalLayout>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  main_tab: {
    backgroundColor: Colors.white,
    padding: 20,
    height: 150,
  },
  img_container: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  img_food: {
    width: 100,
    height: 100,
    marginLeft: 10,
  },
  go_btn: {
    height: 30,
    width: 200,
    backgroundColor: Colors.white_two,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
});
export default BookmarkItem;
