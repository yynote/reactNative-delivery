import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, HorizontalLayout, TopBar, VerticalLayout } from "../components/controls";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { MyStyles, Strings } from "../constants";
import Colors from "../constants/Colors";
import { autoWidthImagesScript, tableBordered } from "../components/controls/autoHeightWebView/config";
import AutoHeightWebView from "../components/controls/autoHeightWebView";

export default class NoticeDetailScreen extends Component {
  constructor(props) {
    super(props);


    this.noticeList = this.props.navigation.getParam("noticeList");
    this.state = {
      id: this.props.navigation.getParam("id"),
      webHeight: 200,
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onBack = () => {
    this.props.navigation.goBack();
  };

  onPrev() {
    if (this.state.id > 0) {
      this.setState({ id: this.state.id - 1 });
    }
  }

  onNext() {
    if (this.state.id < this.noticeList.length - 1) {
      this.setState({ id: this.state.id + 1 });
    }
  }


  render() {
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}>
        <MyStatusBar theme="white" />
        <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}>
          <TopBar
            theme={"white"}
            title={""}
            onBackPress={() => {
              this.onBack();
            }} />
          <VerticalLayout style={{ flex: 1, backgroundColor: Colors.white }}>
            <View style={{ backgroundColor: Colors.white }}>
              <HorizontalLayout
                style={[MyStyles.padding_h_20]}>
                <Text style={[styles.category_text]}>
                  {`[${this.noticeList[this.state.id].category}]`}
                </Text>
                <Text style={[styles.title_text, { flex: 1 }]}>
                  {this.noticeList[this.state.id].title}
                </Text>
              </HorizontalLayout>
              <Text style={styles.date_text}>
                {Strings.reg_date + this.noticeList[this.state.id].reg_dt}
              </Text>
            </View>
            <View style={styles.horizontal_divider} />
            <AutoHeightWebView
              customStyle={tableBordered}
              style={{ marginHorizontal: 20, marginTop: 20 }}
              customScript={autoWidthImagesScript}
              source={{ html: this.noticeList[this.state.id].content }}
            />
            <View style={[styles.horizontal_divider, { height: 10 }]} />
            <Button onPress={() => this.onPrev()}>
              <HorizontalLayout
                style={[MyStyles.padding_h_20, { alignItems: "center", height: 50 }]}>
                <Text style={[styles.title_text, { marginRight: 20, fontSize: 12 }]}>
                  {Strings.prev}
                </Text>
                {
                  this.state.id > 0 &&
                  <HorizontalLayout>
                    <Text style={[styles.category_text, { fontSize: 12 }]}>
                      {`[${this.noticeList[this.state.id - 1].category}]`}
                    </Text>
                    <Text style={[styles.title_text, { fontSize: 12, marginRight: 70 }]}
                          numberOfLines={1} ellipsizeMode="tail">
                      {this.noticeList[this.state.id - 1].title}
                    </Text>
                  </HorizontalLayout>
                }
              </HorizontalLayout>
            </Button>
            <Button onPress={() => this.onNext()}>
              <HorizontalLayout
                style={[MyStyles.padding_h_20, { alignItems: "center", height: 50 }]}>
                <Text style={[styles.title_text, { marginRight: 20, fontSize: 12 }]}>
                  {Strings.next}
                </Text>
                {
                  this.state.id < this.noticeList.length - 1 &&
                  <HorizontalLayout>
                    <Text style={[styles.category_text, { fontSize: 12 }]}>
                      {`[${this.noticeList[this.state.id + 1].category}]`}
                    </Text>
                    <Text style={[styles.title_text, { fontSize: 12, marginRight: 70 }]}
                          numberOfLines={1} ellipsizeMode="tail">
                      {this.noticeList[this.state.id + 1].title}
                    </Text>
                  </HorizontalLayout>
                }

              </HorizontalLayout>
            </Button>
          </VerticalLayout>
          <Button style={[styles.list_btn, MyStyles.center]} onPress={() => {
            this.onBack();
          }}>
            <Text style={{
              fontSize: 16,
              color: Colors.white,
            }}>
              {Strings.go_to_list}
            </Text>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  title_text: {
    marginLeft: 5,
    fontSize: 16,
    color: Colors.black,
    marginRight: 30,
  },

  content_text: {
    backgroundColor: Colors.white,
    paddingVertical: 20,
    paddingHorizontal: 20,
    lineHeight: 22,
    fontSize: 12,
    color: Colors.black,
  },

  category_text: {
    fontSize: 16,
    color: Colors.primary,
  },

  date_text: {
    marginTop: 10,
    marginHorizontal: 20,
    fontSize: 12,
    color: Colors.LIGHT_GREY,
  },

  horizontal_divider: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.white_two,
  },

  list_btn: {
    height: 50,
    backgroundColor: Colors.primary,
    marginBottom: 25,
  },
});

