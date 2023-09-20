import React, { Component } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, HorizontalLayout, ResizedImage, StarRatingCustom, VerticalLayout } from "../../components/controls";
import Colors from "../../constants/Colors";
import { Strings, TextStyles } from "../../constants";
import FastImage from "react-native-fast-image";
import { TextInput } from "react-native-gesture-handler";
import { MyStatusBar } from "../../components/controls/MyStatusBar";
import C, { API_RES_CODE } from "../../constants/AppConstants";
import MyStyles from "../../constants/MyStyles";
import ImagePickerPopup from "../../components/popups/ImagePickerPopup";
import ImageCropPicker from "react-native-image-crop-picker";
import Toast from "react-native-root-toast";
import { Net, requestPost, requestUpload } from "../../utils/APIUtils";
import GlobalState from "../../mobx/GlobalState";
import EventBus from "react-native-event-bus";


export default class ReviewDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: this.props.navigation.getParam("uid"),
      content: "",
      imageList: [""],
      showPicker: false,
      starCnt: 0,
      orderUid: this.props.navigation.getParam('order_uid')?parseInt(this.props.navigation.getParam('order_uid')): 0,
      shop_uid: this.props.navigation.getParam('shop_uid')?this.props.navigation.getParam('shop_uid'):0
    };
  }

  componentDidMount() {
    if (this.state.uid !== '0') {
      requestPost(Net.home.review_detail, {
        access_token: GlobalState.access_token,
        review_uid: parseInt(this.state.uid),
      }).then(response => {
        if (response.result === API_RES_CODE.SUCCESS) {
          this.setState({
            content: response.data.review.content,
            imageList: response.data.review.image.split("#"),
            orderUid: parseInt(response.data.review.order_uid),
            shop_uid: parseInt(response.data.review.shop_uid),
            starCnt: parseInt(response.data.review.rate)
          });
        } else {
          Toast.show(response.msg);
        }
      });
    }

  }

  componentWillUnmount() {
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onDeleteImage(id) {
    let { imageList } = this.state;
    imageList.splice(id, 1);
    this.setState({
      imageList: imageList,
    });
  }

  onImageAdd() {
    let { imageList } = this.state;
    if (imageList.length > 5) {
      Toast.show(Strings.max_select);
      return;
    }
    this.setState({
      showPicker: true,
    });
  }

  onCamera = () => {
    ImageCropPicker.openCamera({
      cropping: true,
      width: 500,
      height: 500,
    }).then(image => {
      this.uploadPhoto(image.path);
    });
  };

  onGallery = () => {
    ImageCropPicker.openPicker({
      cropping: true,
      width: 500,
      height: 500,
    }).then(image => {
      this.uploadPhoto(image.path);
    });
  };

  uploadPhoto = (filePath) => {
    let { imageList } = this.state;
    requestUpload(filePath).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        const image_url = response.data.file_url;
        imageList = this.state.imageList;
        imageList.pop();
        imageList.push(image_url, "");
        this.setState({ imageList: imageList });
      } else {
        Toast.show(response.msg);
      }
    });


  };

  onComplete() {
    if (this.state.content === "") {
      Toast.show(Strings.enter_content);
      return;
    }
    let imageList = this.state.imageList;
    let image = "";
    if (imageList.length > 1) {
      image = imageList.join("#");
    }
    requestPost(Net.home.review_add, {
      access_token: GlobalState.access_token,
      shop_uid: this.state.shop_uid,
      review: this.state.content,
      rate: this.state.starCnt,
      image: image,
      review_uid: this.state.uid !== '0' ? parseInt(this.state.uid) : 0,
      order_uid: this.state.orderUid
    }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        if (this.state.uid !== '0') {
          Toast.show(Strings.review_modified);
        } else {
          Toast.show(Strings.review_added);
        }
        EventBus.getInstance().fireEvent(C.EVENT_PARAMS.REVIEW_ADD, {});
        this.props.navigation.goBack();
      } else {
        Toast.show(response.msg);
      }
    });

  }

  render() {
    return (
      <KeyboardAvoidingView style={{ height: "100%", width: "100%", backgroundColor: Colors.white }}
                            behavior={Platform.OS === "ios" ? "padding" : ""}>
        <MyStatusBar theme={"white"} />

        <View style={{ width: "100%" }}>
          <HorizontalLayout
            style={{
              width: "100%",
              height: 70,
              backgroundColor: Colors.white,

            }}>
            <Button
              style={{
                width: 50,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 25,
              }}
              onPress={() => {
                this.onBack();
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
              <VerticalLayout style={[MyStyles.center]}>
                <Text style={{ fontSize: 17, color: Colors.black, marginBottom: 15 }}>
                  {Strings.my_review}
                </Text>
                <StarRatingCustom
                  emptyStar={require("src/assets/images/ic_star_grey.png")}
                  fullStar={require("src/assets/images/ic_star_green.png")}
                  halfStar={require("src/assets/images/ic_star_half.png")}
                  buttonStyle={{ paddingHorizontal: 3 }}
                  starCnt={this.state.starCnt}
                  size={20}
                  onClick={(index) => {
                    this.setState({ starCnt: index });
                  }}
                  disabled={false}
                />
              </VerticalLayout>
            </View>
            <View
              style={{
                width: 70,
                height: 50,
                marginRight: 5,
              }}>
              <Button onPress={() => {
                this.onComplete();
              }}
                      style={[{ width: 70, height: 50 }, MyStyles.center]}>
                {
                  <Text style={{ fontSize: 14, color: Colors.primary }}>
                    {Strings.complete}
                  </Text>
                }
              </Button>
            </View>

          </HorizontalLayout>
        </View>
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => {
          Keyboard.dismiss();
        }}>
          <View style={{ flex: 1 }}>
            <View style={MyStyles.horizontal_divider} />
            <View style={{ paddingHorizontal: 15, paddingTop: 30 }}>
              <View style={styles.content_bg}>
                <TextInput
                  textAlignVertical={"top"}
                  value={this.state.content}
                  style={[TextStyles.TEXT_STYLE_14, {
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                  }]}
                  ref={input => {
                    this.contentTextInput = input;
                  }}
                  onChangeText={text => {
                    this.setState({ content: text });
                  }}
                  multiline={true}
                  maxLength={100}
                  placeholder={Strings.enter_review}
                  placeholderTextColor={Colors.LIGHT_GREY}
                  onSubmitEditing={() => {
                  }}
                />
              </View>
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={this.state.imageList}
                renderItem={({ item, index }) => {
                  return (
                    <View style={{ marginTop: 20 }}>
                      {
                        index < this.state.imageList.length - 1 &&
                        <View style={{ width: 70, height: 70, marginRight: 10 }}>
                          <ResizedImage
                            source={{ uri: item }}
                            style={{ width: 70, height: 70 }}
                            resizeMode={"cover"}
                          />
                          <Button
                            style={[{ position: "absolute", right: 0, top: 0, width: 20, height: 20 }, MyStyles.center]}
                            onPress={() => this.onDeleteImage(index)}>
                            <ResizedImage
                              source={require("src/assets/images/ic_del_white.png")}
                              style={{ width: 10, height: 10 }}
                            />
                          </Button>
                        </View>
                      }
                      {
                        index === this.state.imageList.length - 1 &&
                        <Button style={{ width: 70, height: 70, backgroundColor: Colors.white_two }} onPress={() => {
                          this.onImageAdd();
                        }}>
                          <FastImage
                            source={require("src/assets/images/ic_add_file.png")}
                            style={{ width: "100%", height: "100%" }} />
                        </Button>
                      }
                    </View>
                  );
                }}
                refreshing={this.state.isRefreshing}
                onEndReachedThreshold={0.1}
                keyExtractor={(item, index) => index.toString()}
                onEndThreshold={0.1}
              />

              <ImagePickerPopup
                visible={this.state.showPicker}
                onCancel={() => this.setState({ showPicker: false })}
                onCamera={() => {
                  this.setState({
                    showPicker: false,
                  }, () => this.onCamera());
                }}
                onGallery={() => {
                  this.setState({
                    showPicker: false,
                  }, () => this.onGallery());
                }} />
              <Text style={{
                fontSize: 15,
                color: Colors.LIGHT_GREY,
                paddingTop: 30,
                lineHeight: 25,
              }}>{Strings.review_content}</Text>
            </View>

          </View>

        </TouchableWithoutFeedback>


      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  content_bg: {
    height: 120,
    backgroundColor: Colors.white_two,
    borderRadius: 5,
  },
});
