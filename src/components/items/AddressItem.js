import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, HorizontalLayout, ResizedImage, VerticalLayout } from "../controls";
import { Colors, MyStyles, Strings } from "../../constants";

export class AddressItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item } = this.props;
    return (
      <View
        style={[{ marginHorizontal: 10, marginBottom: 20, padding: 10, backgroundColor: Colors.white, borderRadius: 5 }, MyStyles.shadow]}>
        <HorizontalLayout>
          <Text style={{ fontSize: 12, color: Colors.primary, flex: 1 }}>{item.zip_code}</Text>
          <Button style={styles.del_btn} onPress={() => {
            this.props.onDeleteAddress();
          }}>
            <Text style={{ fontSize: 12, color: Colors.white }}>{Strings.del}</Text>
          </Button>
        </HorizontalLayout>
        <HorizontalLayout>
          <VerticalLayout style={{flex:1}}>
            <Text style={{ fontSize: 12, color: Colors.black }}>{item.address}</Text>
            <Text style={{ fontSize: 12, color: Colors.black }}>{item.detail_address}</Text>
          </VerticalLayout>
          <Button onPress={() => this.props.onBasicSet()}>
            <HorizontalLayout style={{ alignItems: "center", marginTop: 10 }}>
              <ResizedImage
                source={item.usage === '1' ? require("src/assets/images/ic_radio_on.png") : require("src/assets/images/ic_radio_off.png")}
              />
              <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY, marginLeft: 5 }}>{Strings.basic_set}</Text>
            </HorizontalLayout>
          </Button>
        </HorizontalLayout>
        <HorizontalLayout style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY }}>[{Strings.new_address}]{item.detail_address}</Text>
        </HorizontalLayout>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  del_btn: {
    width: 50,
    height: 30,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
});

export default AddressItem;
