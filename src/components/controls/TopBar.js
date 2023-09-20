import React from "react";
import { StyleSheet, Text, View } from "react-native";
import C from "../../constants/AppConstants";
import TextStyles from "../../constants/TextStyles";
import Colors from "../../constants/Colors";
import { MyStatusBar } from "./MyStatusBar";
import { ResizedImage } from "./ResizedImage";
import { Button } from "./Button";
import { HorizontalLayout } from "./index";
import MyStyles from "../../constants/MyStyles";

export class TopBar extends React.Component {

  render() {
    return (
      <View style={this.props.style? this.props.style: { width: "100%" }} >
        <HorizontalLayout
          style={{
            width: "100%",
            height: 50,
            backgroundColor: Colors.white,

          }}>
          <Button
            style={{
              width: 50,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              this.props.onBackPress();
            }}
          >
            <ResizedImage
              source={require("src/assets/images/ic_arrow_back_black.png")}
              style={{ width: 35, height: 30 }}
            />
          </Button>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Text style={{ fontSize: 20, color: Colors.black }}>
              {this.props.title}
            </Text>
          </View>
          <View
            style={{
              width: 50,
              height: 50,
            }} >
            <Button onPress={() => {
              if (this.props.onRightPress) {
                this.props.onRightPress();
              }
            }}
                    style={[{width: 50, height: 50}, MyStyles.center]}>
              {
                this.props.rightLabel &&
                <Text style={{fontSize: 12, color: Colors.black}}>
                  {this.props.rightLabel}
                </Text>
              }
            </Button>
          </View>

        </HorizontalLayout>
      </View>
    );
  }
}

