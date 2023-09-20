import React from "react";
import { Text, View } from "react-native";
import Colors from "../../constants/Colors";
import { ResizedImage } from "./ResizedImage";
import { Button } from "./Button";
import { HorizontalLayout } from "./index";

export class MainTopBar extends React.Component {

  render() {
    return (
      <View style={{ width: "100%" }}>
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
            {
              this.props.isBackIcon &&
              <ResizedImage
                source={require("src/assets/images/ic_arrow_back_black.png")}
                style={{ width: 25, height: 25 }}
              />
            }
            {
              !this.props.isBackIcon &&
              <ResizedImage
                source={require("src/assets/images/ic_slide.png")}
                style={{ width: 25, height: 25 }}
              />
            }
          </Button>
          <Button style={{ flex: 1 }} onPress={()=>this.props.onSearchAddress()}>
            <HorizontalLayout>
              <View style={{ width: 50, height: 50, alignItems: "center", justifyContent: "center" }}>
                <ResizedImage
                  source={require("src/assets/images/ic_near.png")}
                  style={{ width: 25, height: 25 }}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}>
                <Text style={{ fontSize: 20, color: Colors.black }}>
                  {this.props.title}
                </Text>
              </View>

            </HorizontalLayout>

          </Button>
          <Button
            style={{
              width: 50,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={()=>this.props.onSearchFood()}
          >
            <ResizedImage
              source={require("src/assets/images/ic_search.png")}
              style={{ width: 25, height: 25 }}
            />
          </Button>
        </HorizontalLayout>
      </View>
    );
  }
}

