import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { Button, HorizontalLayout } from "../controls";
import { Colors, Strings } from "../../constants";
import FastImage from "react-native-fast-image";
import Carousel from "react-native-snap-carousel";
import { SCREEN_WIDTH } from "../../constants/AppConstants";

export class SearchFoodItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex:0
    }
  }

  renderBanners = (image) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => this.props.onPress()}
      >
        {
          <FastImage source={{ uri: image }} style={{ width: "100%", height: "100%" }}
                     resizeMode={FastImage.resizeMode.cover} />
        }
      </TouchableWithoutFeedback>
    );
  };

  render() {
    const { item } = this.props;
    return (
      <Button style={{ marginVertical: 10 }} onPress={()=>this.props.onPress()}>
        <HorizontalLayout style={{ height: 120, width: "100%" }}>
          <Carousel
            activeSlideAlignment="center"
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            data={item.img_src.split("#")}
            scrollEnabled={true}
            loop={true}
            autoplay={true}
            swipeThreshold={1}
            autoplayInterval={3000}
            sliderWidth={SCREEN_WIDTH-40}
            itemWidth={SCREEN_WIDTH-40}
            itemHeight={120}
            onSnapToItem={(index) => this.setState({ activeIndex: index })}
            renderItem={({ item, idx }) => this.renderBanners(item)}
          />
          <View style={styles.banner_index}>
            <Text style={{
              fontSize: 12,
              color: Colors.white,
            }}>{this.state.activeIndex + 1}/{item.img_src.split("#").length}</Text>
          </View>
        </HorizontalLayout>
        <HorizontalLayout style={{ marginTop: 10 }}>
          <HorizontalLayout style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: Colors.black }}>{item.product_name}</Text>
            {
              item.is_new === "1" &&
              <Text style={[styles.new_noti, { marginLeft: 5 }]}>{Strings.new}</Text>
            }
          </HorizontalLayout>
          {/*<Text style={{ fontSize: 10, color: Colors.black }}>{item.time}</Text>*/}
        </HorizontalLayout>
        <HorizontalLayout style={{ marginTop: 5 }}>
          <Text style={{ fontSize: 10, color: Colors.black }}>{item.distance} - {Strings.fee} {item.fee}</Text>
        </HorizontalLayout>
        <Text style={{ fontSize: 11, color: Colors.LIGHT_GREY, marginTop: 5 }} numberOfLines={1}
              ellipsizeMode="tail">{item.content}</Text>
        <HorizontalLayout style={{marginTop:5}}>
          {
            item.is_delivery === "1" &&
            <Text style={[styles.status, {backgroundColor: Colors.primary}]}>{Strings.deliverable}</Text>
          }
          {
            item.is_packable === "1" &&
            <Text style={[styles.status, {backgroundColor: Colors.yellow_two}]}>{Strings.packable}</Text>

          }
          {
            item.is_gift &&
            <Text style={[styles.status, {backgroundColor: Colors.green}]}>{Strings.gift_card}</Text>
          }
        </HorizontalLayout>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  new_noti: {
    fontSize: 9,
    paddingTop: 1,
    color: Colors.white,
    backgroundColor: Colors.red,
    borderRadius: 5,
    width: 25,
    height: 15,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  status: {
    width: 60,
    height: 20,
    paddingTop: 3,
    textAlign: "center",
    borderRadius: 5,
    fontSize: 10,
    color: Colors.white,
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  banner_index: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.black_40,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    right: 20,
  },
});
