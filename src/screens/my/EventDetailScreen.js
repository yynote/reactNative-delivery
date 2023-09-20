import React, { Component } from "react";
import { ScrollView, Text, View } from "react-native";
import { Button, TopBar } from "../../components/controls";
import Colors from "../../constants/Colors";
import { Strings } from "../../constants";
import FastImage from "react-native-fast-image";
import { MyStatusBar } from "../../components/controls/MyStatusBar";
import ScaledFastImage from "../../components/controls/ScaledFastImage";
import { SCREEN_WIDTH } from "../../constants/AppConstants";
import AutoHeightWebView from "../../components/controls/autoHeightWebView";
import { autoWidthImagesScript, tableBordered } from "../../components/controls/autoHeightWebView/config";

export default class EventDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.navigation.getParam("item"),
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const item = this.state.item;
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}>
        <MyStatusBar theme="white" />
        <TopBar
          title={Strings.event}
          onBackPress={() => {
            this.props.navigation.goBack();
          }} />
        <View style={{ height: 1, backgroundColor: Colors.white_two }} />
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 16, color: Colors.black }}>{item.title}</Text>
            <Text style={{
              fontSize: 12,
              color: Colors.LIGHT_GREY,
              paddingTop: 5,
            }}>{item.start_date} ~ {item.end_date}</Text>
          </View>
          <ScaledFastImage
            uri={item.image}
            width={SCREEN_WIDTH}
            resizeMode={FastImage.resizeMode.contain}
          />
          <AutoHeightWebView
            customStyle={tableBordered}
            style={{ marginHorizontal: 20, marginTop: 20 }}
            customScript={autoWidthImagesScript}
            source={{ html: item.content }}
          />
        </ScrollView>
        <Button
          style={{
            height: 50,
            backgroundColor: Colors.primary,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            this.props.navigation.navigate("Event");
          }}
        >
          <Text style={{ fontSize: 16, color: Colors.white }}>{Strings.go_to_list}</Text>
        </Button>
      </View>
    );
  }
}
