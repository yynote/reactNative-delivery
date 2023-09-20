import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, HorizontalLayout, ResizedImage } from "../controls";
import { Colors, MyStyles, Strings } from "../../constants";

export class SelectAddressItem extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    const { item } = this.props;
    return (
      <Button onPress={()=>this.props.onPress()}
        style={[{ marginHorizontal: 10, marginBottom: 20, padding: 20, backgroundColor: Colors.white, borderRadius: 5 }, MyStyles.shadow]}>
        <Text style={{ fontSize: 12, color: Colors.black}}>{item.zipCode}</Text>
        <Text style={{ fontSize: 12, color: Colors.black, marginTop:10 }}>{item.address}</Text>
        <HorizontalLayout style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY }}>[{Strings.new_address}]{item.newAddress}</Text>
        </HorizontalLayout>
      </Button>
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
    marginRight: 25,
  },
});

export default SelectAddressItem;
