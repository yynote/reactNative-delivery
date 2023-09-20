import React, { Component } from "react";
import { Keyboard, KeyboardAvoidingView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { MyStyles, Strings } from "../constants";
import Colors from "../constants/Colors";
import FastImage from "react-native-fast-image";
import Carousel from "react-native-snap-carousel";
import { SCREEN_WIDTH } from "../constants/AppConstants";
import { HorizontalLayout, TopBar } from "../components/controls";

export default class InquiryDetailScreen extends Component {
  constructor(props) {
    super(props);

    this.item = this.props.navigation.getParam("item");
    this.state = {
      activeIndex: 0,
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onBack = () => {
    this.props.navigation.goBack();
  };

  renderBanners = (image) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
        }}>
        {
          <FastImage source={{ uri: image }} style={{ width: "100%", height: "100%", borderRadius: 5 }}
                     resizeMode={FastImage.resizeMode.cover} />
        }
      </TouchableWithoutFeedback>
    );
  };

  render() {
    return (
      <KeyboardAvoidingView style={{ width: "100%", height: "100%", backgroundColor: Colors.white_two }}
                            behavior={Platform.OS === "ios" ? "padding" : ""}>
        <MyStatusBar theme="white" />
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => {
          Keyboard.dismiss();
        }}>
          <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white_two }}>
            <TopBar
              theme={"white"}
              title={""}
              onBackPress={() => {
                this.onBack();
              }} />
            <View
              style={[MyStyles.padding_h_20, { width: "100%", backgroundColor: Colors.white, paddingBottom: 20 }]}>
              <Text style={styles.title_text}>{this.item.title}</Text>
              <Text style={styles.date_text}>{Strings.date_receipt + this.item.reg_dt}</Text>
            </View>
            <View style={styles.horizontal_divider} />
            <Text style={styles.content_text}>{this.item.content}</Text>
            {
              (this.item.image !== "" || this.item.image !== null) &&
              <HorizontalLayout style={styles.image_viewer}>
                <Carousel
                  activeSlideAlignment="center"
                  inactiveSlideScale={1}
                  inactiveSlideOpacity={1}
                  data={this.item.image.split("#")}
                  scrollEnabled={true}
                  loop={true}
                  autoplay={true}
                  swipeThreshold={1}
                  autoplayInterval={3000}
                  containerCustomStyle={{ marginHorizontal: 20 }}
                  sliderWidth={SCREEN_WIDTH - 40}
                  itemWidth={SCREEN_WIDTH - 40}
                  onSnapToItem={(index) => this.setState({ activeIndex: index })}
                  renderItem={({ item, idx }) => this.renderBanners(item)}
                />
                <View style={styles.banner_index}>
                  <Text style={{
                    fontSize: 12,
                    color: Colors.white,
                  }}>{this.state.activeIndex + 1}/{this.item.image.split("#").length}</Text>
                </View>
              </HorizontalLayout>
            }

            <View style={{ marginTop: 20, backgroundColor: Colors.white, paddingVertical: 20 }}>
              <Text style={{ fontSize: 14, color: Colors.black, marginHorizontal: 20 }}>{Strings.answer}</Text>
              {
                (this.item.answer !== null || this.item.answer !== "") &&
                <Text style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: Colors.black,
                  marginHorizontal: 20,
                  lineHeight: 22,
                }}>{this.item.answer}</Text>
              }
              {
                (this.item.answer === null || this.item.answer === "") &&
                <View style={[{ backgroundColor: Colors.white, height: 100 }, MyStyles.center]}>
                  <Text style={{ fontSize: 14, color: Colors.black }}>{Strings.no_item}</Text>
                </View>
              }

            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({

  title_text: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.black,
  },

  content_text: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    lineHeight: 18,
    fontSize: 12,
    color: Colors.black,
    backgroundColor: Colors.white,
  },

  category_text: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.primary,
  },

  date_text: {
    marginTop: 20,
    fontSize: 12,
    color: Colors.LIGHT_GREY,
  },

  horizontal_divider: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.white_two,
  },

  image_viewer: {
    paddingBottom: 20,
    width: "100%",
    height: 180,
    backgroundColor: Colors.white,
  },
  banner_index: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.black_40,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 30,
    right: 25,
  },
});

