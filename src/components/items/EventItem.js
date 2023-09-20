import React from "react";
import { Text, View } from "react-native";
import { Button, HorizontalLayout, VerticalLayout } from "../controls";
import { Colors, Strings } from "../../constants";
import FastImage from "react-native-fast-image";

export class EventItem extends React.Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {}

  render() {
    const { item, index } = this.props;

    return (
      <Button onPress={() => {
        if (this.props.onPress) {
          this.props.onPress();
        }
      }}>
        <FastImage source={{ uri: item.image }} resizeMode={FastImage.resizeMode.cover} style={{ height: 140 }} />
        <HorizontalLayout style={{ padding: 20 }}>
          <VerticalLayout style={{flex: 1, paddingRight: 20}}>
            <Text style={{ fontSize: 14, color: Colors.black }} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
            <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY, marginTop: 5 }}>{item.start_date} ~ {item.end_date}</Text>
          </VerticalLayout>
          <View style={{ width: 90, height: 30, borderColor: item.status === "proceeding" ? Colors.primary: Colors.LIGHT_GREY, borderWidth: 1, borderRadius: 5, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{ fontSize: 12, color: item.status === "proceeding" ?Colors.black: Colors.LIGHT_GREY }}>{item.status === "proceeding" ? Strings.proceeding : Strings.end}</Text>
          </View>
        </HorizontalLayout>
      </Button>
    );
  }
}

export default EventItem;
