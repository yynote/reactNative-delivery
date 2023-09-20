import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { HorizontalLayout, StarRatingCustom, VerticalLayout } from "../controls";
import FastImage from "react-native-fast-image";
import { Colors } from "../../constants";
import Carousel from "react-native-snap-carousel";
import { SCREEN_WIDTH } from "../../constants/AppConstants";

export class DetailReviewItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    };
  }

  renderBanners = (image) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
        }}>
        {
          <FastImage source={{ uri: image }} style={{ width: "100%", height: "100%" }}
                     resizeMode={FastImage.resizeMode.cover} />
        }
      </TouchableWithoutFeedback>
    );
  };

  render() {
    const { item } = this.props;
    const imageList = item.image.split("#");
    imageList.pop();
    return (
      <HorizontalLayout style={{ marginBottom: 20, width: "100%" }}>
        <FastImage
          source={item.user_image !== "" ? { uri: item.user_image } : require("src/assets/images/img_default_profile.png")}
          style={{ width: 35, height: 35, borderRadius: 35 }}
          resizeMode={"cover"} />
        <VerticalLayout style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ fontSize: 12, color: Colors.black, marginBottom: 5 }}>{item.user_name}</Text>
          <HorizontalLayout style={{ alignItems: "center", marginBottom: 10 }}>
            <StarRatingCustom
              emptyStar={require("src/assets/images/ic_star_grey.png")}
              fullStar={require("src/assets/images/ic_star_green.png")}
              halfStar={require("src/assets/images/ic_star_half.png")}
              buttonStyle={{ paddingHorizontal: 1 }}
              starCnt={item.rate}
              size={12}
              disabled={true}
            />
            <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY, marginLeft: 10 }}>{item.reg_time}</Text>
          </HorizontalLayout>
          {
            item.image !== "" &&
            <HorizontalLayout style={{ height: 120, width: "100%" }}>
              <Carousel
                activeSlideAlignment="center"
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                data={imageList}
                scrollEnabled={true}
                loop={true}
                autoplay={true}
                swipeThreshold={1}
                autoplayInterval={3000}
                sliderWidth={SCREEN_WIDTH-85}
                itemWidth={SCREEN_WIDTH-85}
                onSnapToItem={(index) => this.setState({ activeIndex: index })}
                renderItem={({ item }) => this.renderBanners(item)}
              />
              <View style={styles.banner_index}>
                <Text style={{
                  fontSize: 12,
                  color: Colors.white,
                }}>{this.state.activeIndex + 1}/{imageList.length}</Text>
              </View>
            </HorizontalLayout>
          }
          <Text style={{ fontSize: 12, color: Colors.black, marginTop: 10, lineHeight: 15 }}>{item.content}</Text>
          {
            (item.comment !== null && item.comment !== "") &&
            <View style={{ backgroundColor: Colors.white_two, padding: 15, borderRadius: 5, marginTop: 15 }}>
              <HorizontalLayout>
                <Text style={{ fontSize: 12, color: Colors.black }}>{item.boss_name}</Text>
                <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY, marginLeft: 10 }}>{item.comment_time}</Text>
              </HorizontalLayout>
              <Text style={{ fontSize: 12, color: Colors.black, marginTop: 5 }}>{item.user_name}, {item.comment}</Text>
            </View>
          }
        </VerticalLayout>
      </HorizontalLayout>
    );
  }
}

const styles = StyleSheet.create({
  banner_index: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.black_40,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});

export default DetailReviewItem;
