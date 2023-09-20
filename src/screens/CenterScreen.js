import React, { Component } from "react";
import { FlatList, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { Strings, TextStyles } from "../constants";
import Colors from "../constants/Colors";
import { Button, HorizontalLayout, MyDropdown, TabBar, TopBar, VerticalLayout } from "../components/controls";
import { API_RES_CODE, IMAGE_FOO_URL, IMAGE_FOO_URL2, SCREEN_WIDTH } from "../constants/AppConstants";
import { Net, requestPost, requestUpload } from "../utils/APIUtils";
import Toast from "react-native-root-toast";
import { InquiryItem } from "../components/items";
import ImagePickerPopup from "../components/popups/ImagePickerPopup";
import GlobalState from "../mobx/GlobalState";
import ImageCropPicker from "react-native-image-crop-picker";
import FastImage from "react-native-fast-image";
import ConfirmPopup from "../components/popups/ConfirmPopup";

export default class CenterScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tab_index: 0,
      limit: 30,
      offset: 0,
      isRefreshing: false,
      noMoreData: false,
      showEmptyUI: false,
      inquiryList: [],
      name: GlobalState.me.name,
      email: GlobalState.me.email,
      classVal: "",
      title: "",
      content: "",
      image1: "",
      image2: "",
      image3: "",
      showPicker: false,
      imageIndex: 0,
      confirmPopup: false,
      defaultIndex: -1,
    };

    this.classOptions = [
      {
        code: 0,
        value: Strings.query1,
      },
      {
        code: 0,
        value: Strings.query2,
      },
      {
        code: 0,
        value: Strings.query3,
      },
      {
        code: 0,
        value: Strings.query4,
      },
      {
        code: 0,
        value: Strings.query5,
      },
      {
        code: 0,
        value: Strings.etc,
      },
    ];
  }

  componentDidMount() {
    this.loadInquiryList();
  }

  componentWillUnmount() {
  }

  onBack = () => {
    this.props.navigation.goBack();
  };


  onSearch = () => {

  };

  onRemove = () => {
    this.setState({ keyword: "" });
  };

  handleLoadMore = (clear) => {
    if (clear) {    // onRefresh
      this.noMoreData = false;
      this.setState({
        isRefreshing: clear,
        inquiryList: [],
        offset: 0,
      }, () => {
        this.loadInquiryList();
      });
    } else {        // onEndReached
      if (!this.noMoreData) {
        this.loadInquiryList();
      }
    }
  };

  loadInquiryList = () => {

    // this.dummyData();

    requestPost(
      Net.home.inquiry_list,
      { limit: this.state.limit, offset: this.state.offset, access_token: GlobalState.access_token },
    ).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        this.setState({
          inquiryList: this.state.inquiryList.length === 0 ? response.data.list : [...this.state.inquiryList, ...response.data.list],
          isRefreshing: false,
        }, () => {
          this.setState({
            showEmptyUI: this.state.inquiryList.length === 0,
            offset: this.state.inquiryList.length,
          });
        });
        this.noMoreData = response.data.list.length < this.state.limit;
      } else {
        Toast.show(response.msg);
      }
    });
  };

  dummyData = () => {
    let list = [];
    for (let i = 0; i < 10; i++) {
      list.push({
        uid: i,
        category: "Etc",
        title: "This is inquiry title",
        content: "This is content. This is content. This is content. This is content. This is content. This is content. This is content. This is content. ",
        date: "2019.06.28",
        image: `${IMAGE_FOO_URL}#${IMAGE_FOO_URL2}#${IMAGE_FOO_URL}`,
        answer: "This is the answerThis is the answerThis is the answerThis is the answerThis is the answerThis is the answer",
        status: i % 2,
      });
    }

    this.setState(state => ({
      noMoreData: true,
      isRefreshing: false,
      inquiryList: state.inquiryList.concat(list),
      offset: this.state.inquiryList.length,
    }));
  };

  onInquiryDetail = (index) => {
    let { inquiryList } = this.state;
    this.props.navigation.navigate("InquiryDetail", {
      item: inquiryList[index],
    });
  };

  onImageSelect = (index) => {
    this.setState({
      showPicker: true,
      imageIndex: index,
    });
  };

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
    requestUpload(filePath).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        const image_url = response.data.file_url;
        switch (this.state.imageIndex) {
          case 0:
            this.setState({
              image1: image_url,
            });
            break;
          case 1:
            this.setState({
              image2: image_url,
            });
            break;
          case 2:
            this.setState({
              image3: image_url,
            });
            break;
        }
      } else {
        Toast.show(response.msg);
      }
    });
  };

  onCancel() {
    this.onBack();
  }

  onComplete() {
    let { name, email, classVal, title, content, image1, image2, image3 } = this.state;
    if (name === "") {
      Toast.show(Strings.enter_name);
      return;
    }
    if (email === "") {
      Toast.show(Strings.enter_email);
      return;
    }
    if (classVal === "") {
      Toast.show(Strings.select_class);
      return;
    }
    if (title === "") {
      Toast.show(Strings.enter_title);
      return;
    }
    if (content === "") {
      Toast.show(Strings.enter_content);
      return;
    }
    let image = "";
    if (image1 !== "") image = image1;
    if (image2 !== "") image = image === "" ? image2 : image + "#" + image2;
    if (image3 !== "") image = image === "" ? image3 : image + "#" + image3;
    requestPost(Net.home.inquiry_add, {
      name: this.state.name,
      email: this.state.email,
      category: this.state.classVal,
      title: this.state.title,
      content: this.state.content,
      access_token: GlobalState.access_token,
      image: image,
    }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        this.setState({ confirmPopup: true });
      } else {
        Toast.show(response.msg);
      }
    });
  }

  onConfirm() {
    this.loadInquiryList();
    this.setState({
      confirmPopup: false,
      title: "",
      content: "",
      defaultIndex: -1,
      image1: "",
      image2: "",
      image3: "",
    });
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}
                            behavior={Platform.OS === "ios" ? "padding" : ""}>
        <MyStatusBar theme="white" />
        <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}>
          <TopBar
            theme={"white"}
            title={Strings.cs_center}
            onBackPress={() => {
              this.onBack();
            }} />

          <TabBar
            tab_index={this.state.tab_index}
            tab_count={2}
            textStyle={{ fontSize: 16 }}
            titles={[Strings.one_inquiry, Strings.inquiry_history]}
            onClick={(id) => {
              this.setState({
                tab_index: id,
              });
            }}
          />
          {
            this.state.tab_index === 1 &&
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 20 }}
              data={this.state.inquiryList}
              style={{ flex: 1, marginBottom: 25 }}
              numColumns={1}
              renderItem={({ item, index }) => (
                <InquiryItem
                  item={item}
                  onPress={() => {
                    this.onInquiryDetail(index);
                  }}
                />
              )}
              refreshing={this.state.isRefreshing}
              onRefresh={() => this.handleLoadMore(true)}
              onEndReached={() => this.handleLoadMore(false)}
              ItemSeparatorComponent={() => <View style={styles.horizontal_divider} />}
              onEndReachedThreshold={0.1}
              ListEmptyComponent={this.state.showEmptyUI && (
                <View style={{
                  width: "100%",
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 250,
                }}>
                  <Text style={TextStyles.TEXT_STYLE_14}>{Strings.no_item}</Text>
                </View>
              )}
              keyExtractor={(item, index) => `sale-${index.toString()}`}
            />
          }
          {
            this.state.tab_index === 0 &&
            <VerticalLayout style={{ flex: 1, paddingBottom: 20 }}>
              <ScrollView style={{ flex: 1, paddingVertical: 20, paddingHorizontal: 20 }}>
                <HorizontalLayout>
                  <Text style={[styles.title_text, { alignSelf: "center" }]}>
                    {Strings.name}
                  </Text>
                  <View style={styles.input_bg}>
                    <TextInput
                      value={this.state.name}
                      style={[TextStyles.TEXT_STYLE_16, {
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                      }]}
                      ref={input => {
                        this.nameTextInput = input;
                      }}
                      onChangeText={text => {
                        this.setState({ name: text });
                      }}
                      placeholder={""}
                      placeholderTextColor={Colors.LIGHT_GREY}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        this.emailTextInput.focus();
                      }}
                    />
                  </View>
                </HorizontalLayout>
                <HorizontalLayout style={{ marginTop: 10 }}>
                  <Text style={[styles.title_text, { alignSelf: "center" }]}>
                    {Strings.email}
                  </Text>
                  <View style={styles.input_bg}>
                    <TextInput
                      value={this.state.email}
                      style={[TextStyles.TEXT_STYLE_16, {
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                      }]}
                      ref={input => {
                        this.emailTextInput = input;
                      }}
                      onChangeText={text => {
                        this.setState({ email: text });
                      }}
                      placeholder={""}
                      placeholderTextColor={Colors.LIGHT_GREY}
                      keyboardType={"email-address"}
                      returnKeyType="done"
                      onSubmitEditing={() => {

                      }}
                    />
                  </View>
                </HorizontalLayout>
                <HorizontalLayout style={{ marginTop: 10 }}>
                  <Text style={[styles.title_text, { alignSelf: "center" }]}>
                    {Strings.consult_class}
                  </Text>
                  <View style={styles.input_bg}>
                    <MyDropdown
                      options={this.classOptions}
                      defaultIndex={this.state.defaultIndex}
                      defaultValue={Strings.no_selected}
                      onSelect={(value) => {
                        this.setState({ classVal: value.value });
                      }}
                    />
                  </View>
                </HorizontalLayout>
                <HorizontalLayout style={{ marginTop: 10 }}>
                  <Text style={[styles.title_text, { alignSelf: "center" }]}>
                    {Strings.title}
                  </Text>
                  <View style={styles.input_bg}>
                    <TextInput
                      value={this.state.title}
                      style={[TextStyles.TEXT_STYLE_16, {
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                      }]}
                      ref={input => {
                        this.titleTextInput = input;
                      }}
                      onChangeText={text => {
                        this.setState({ title: text });
                      }}
                      placeholder={""}
                      placeholderTextColor={Colors.LIGHT_GREY}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        this.contentTextInput.focus();
                      }}
                    />
                  </View>
                </HorizontalLayout>
                <HorizontalLayout style={{ marginTop: 10 }}>
                  <Text style={[styles.title_text]}>
                    {Strings.content}
                  </Text>
                  <View style={styles.content_bg}>
                    <TextInput
                      textAlignVertical={"top"}
                      value={this.state.content}
                      style={[TextStyles.TEXT_STYLE_16, {
                        paddingHorizontal: 20,
                        paddingVertical: 20,
                      }]}
                      ref={input => {
                        this.contentTextInput = input;
                      }}
                      onChangeText={text => {
                        this.setState({ content: text });
                      }}
                      multiline={true}
                      maxLength={100}
                      placeholder={""}
                      placeholderTextColor={Colors.LIGHT_GREY}
                      returnKeyType="next"
                      onSubmitEditing={() => {

                      }}
                    />
                  </View>
                </HorizontalLayout>
                <HorizontalLayout style={{ marginTop: 10 }}>
                  <Text style={[styles.title_text]}>
                    {Strings.attach_file}
                  </Text>
                  <Button style={[styles.image_btn]} onPress={() => {
                    this.onImageSelect(0);
                  }}>
                    <FastImage
                      source={this.state.image1 === ""
                        ? require("src/assets/images/ic_add_file.png")
                        : { uri: this.state.image1 }
                      }
                      style={{ width: "100%", height: "100%" }} />
                  </Button>
                  <Button style={[styles.image_btn, { marginLeft: 10 }]} onPress={() => {
                    this.onImageSelect(1);
                  }}>
                    <FastImage
                      source={this.state.image2 === ""
                        ? require("src/assets/images/ic_add_file.png")
                        : { uri: this.state.image2 }
                      }
                      style={{ width: "100%", height: "100%" }} />
                  </Button>
                  <Button style={[styles.image_btn, { marginLeft: 10 }]} onPress={() => {
                    this.onImageSelect(2);
                  }}>
                    <FastImage
                      source={this.state.image3 === ""
                        ? require("src/assets/images/ic_add_file.png")
                        : { uri: this.state.image3 }
                      }
                      style={{ width: "100%", height: "100%" }} />
                  </Button>
                </HorizontalLayout>
                <Text style={styles.image_guide}>
                  {Strings.image_guide}
                </Text>
              </ScrollView>
              <HorizontalLayout style={{ height: 50, marginBottom: 5 }}>
                <Button
                  style={{
                    width: "50%",
                    height: 50,
                    backgroundColor: Colors.white_two,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    this.onCancel();
                  }}>
                  <Text style={{ fontSize: 16, color: Colors.grey4 }}>{Strings.cancel}</Text>
                </Button>
                <Button
                  style={{
                    width: "50%",
                    height: 50,
                    backgroundColor: Colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    this.onComplete();
                  }}>
                  <Text style={{ fontSize: 16, color: Colors.white }}>{Strings.completed}</Text>
                </Button>
              </HorizontalLayout>
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
              <ConfirmPopup
                visible={this.state.confirmPopup}
                title={Strings.inquiry_received}
                onConfirm={() => {
                  this.onConfirm();
                }}
                onCancel={() => this.onBack()}
              />
            </VerticalLayout>
          }
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  horizontal_divider: {
    marginTop: 20,
    width: "100%",
    height: 1,
    backgroundColor: Colors.white_two,
  },

  input_bg: {
    height: 50,
    flex: 1,
    backgroundColor: Colors.white_two,
    borderRadius: 5,
  },

  content_bg: {
    height: 350,
    flex: 1,
    backgroundColor: Colors.white_two,
    borderRadius: 5,
  },

  title_text: {
    width: 100,
    fontSize: 14,
    color: Colors.black,
  },

  image_btn: {
    width: (SCREEN_WIDTH - 140 - 20) / 3,
    height: (SCREEN_WIDTH - 140 - 20) / 3,
    backgroundColor: Colors.white_two,
  },

  image_guide: {
    marginLeft: 100,
    marginTop: 10,
    marginBottom: 50,
    fontSize: 12,
    color: Colors.grey4,
  },

});

