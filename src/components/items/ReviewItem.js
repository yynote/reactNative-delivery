import React from "react";
import { Text, View } from "react-native";
import { Button, HorizontalLayout, ResizedImage, VerticalLayout } from "../controls";
import { Colors, MyStyles, Strings } from "../../constants";

export class ReviewItem extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const { item, index } = this.props;
    return (
      <View style={{
        width: "100%",
        height: 100,
        paddingLeft: 20,
        paddingRight: 10,
        paddingVertical: 20,
        backgroundColor: Colors.white,
      }}>
        <HorizontalLayout style={{ alignItems: "center" }}>
          {
            item.shop_image !== "" &&
            <ResizedImage
              source={{ uri: item.shop_image.split('#')[0] }}
              style={{ height: 60, width: 60 }}
              resizeMode={"cover"}
            />
          }
          {
            item.shop_image === "" &&
            <View style={{ width: 60, height: 60, backgroundColor: Colors.black_40 }} />
          }
          <VerticalLayout style={{ marginTop: 15, marginHorizontal: 10, marginBottom: 10, flex: 1 }}>
            <Text style={{ fontSize: 12, color: Colors.black }}>{item.shop_name}</Text>
            <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY, marginTop: 15 }} numberOfLines={1}
                  ellipsizeMode="tail">{item.product_name_str}</Text>
          </VerticalLayout>
          {
            item.review_uid === '0' &&
              <Button style={[{backgroundColor: Colors.primary, width: 80, height: 30, borderRadius:5}, MyStyles.center]} onPress={()=>this.props.onAddReview()}>
                <Text style={{fontSize:12, color: Colors.white}}>{Strings.add_review}</Text>
              </Button>
          }
          {
            item.review_uid !== '0' &&
            <Button
              onPress={() => {
                if (this.props.onPress) {
                  this.props.onPress();
                }
              }}
              style={{ width: 60, height: 30, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 12, color: Colors.LIGHT_GREY }}>{Strings.modify}</Text>
            </Button>
          }
          {
            item.review_uid !== '0' &&
            <Button
              style={{
                marginLeft: 10,
                width: 50,
                height: 30,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderRadius: 5,
                borderColor: Colors.LIGHT_GREY,
              }}
              onPress={() => {
                this.props.onDelete();
              }}
            >
              <Text style={{ fontSize: 12, color: Colors.black }}>{Strings.del}</Text>
            </Button>
          }

        </HorizontalLayout>

      </View>
    );
  }
}

export default ReviewItem;
