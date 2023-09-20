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
import { TopBar } from "../components/controls";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { MyStyles, Strings, TextStyles } from "../constants";
import Colors from "../constants/Colors";
import { Button, HorizontalLayout, SearchBox, VerticalLayout } from "../components/controls";
import { API_RES_CODE } from "../constants/AppConstants";
import { Net, requestGet } from "../utils/APIUtils";
import Toast from "react-native-root-toast";

export default class NoticeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: "",
      limit: 30,
      offset: 0,
      isRefreshing: false,
      noMoreData: false,
      showEmptyUI: false,
      noticeList: [],
    };
  }

  componentDidMount() {
    this.loadNoticeList();
  }

  componentWillUnmount() {
  }

  onBack = () => {
    this.props.navigation.goBack();
  };

  onSearch = (keyword) => {
    Keyboard.dismiss();
    requestGet(
      Net.home.notice_list,
      { keyword: keyword, limit: this.state.limit, offset: this.state.offset, type: "user" },
    ).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        this.setState({
          noticeList: response.data.list,
          isRefreshing: false,
        }, () => {
          this.setState({
            showEmptyUI: this.state.noticeList.length === 0,
            offset: 0,
          });
        });
        this.noMoreData = response.data.list.length < this.state.limit;
      } else {
        Toast.show(response.msg);
      }
    });
  };

  onRemove = () => {
    this.setState({ keyword: "" });
  };

  handleLoadMore = (clear) => {
    if (clear) {    // onRefresh
      this.noMoreData = false;
      this.setState({
        isRefreshing: clear,
        noticeList: [],
        offset: 0,
      }, () => {
        this.loadNoticeList();
      });
    } else {        // onEndReached
      if (!this.noMoreData) {
        this.loadNoticeList();
      }
    }
  };

  loadNoticeList = () => {
    requestGet(
      Net.home.notice_list,
      { keyword: "", limit: this.state.limit, offset: this.state.offset, type: "user" },
    ).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        this.setState({
          noticeList: this.state.noticeList.length === 0 ? response.data.list : [...this.state.noticeList, ...response.data.list],
          isRefreshing: false,
        }, () => {
          this.setState({
            showEmptyUI: this.state.noticeList.length === 0,
            offset: this.state.noticeList.length,
          });
        });
        this.noMoreData = response.data.list.length < this.state.limit;
      } else {
        Toast.show(response.msg);
      }
    });
  };


  onNoticeDetail = (id) => {
    let { noticeList } = this.state;

    this.props.navigation.navigate("NoticeDetail", {
      id: id,
      noticeList: noticeList,
    });
  };

  render() {
    return (
      <KeyboardAvoidingView style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}
                            behavior={Platform.OS === "ios" ? "padding" : ""}>
        <MyStatusBar theme="white" />
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => {
          Keyboard.dismiss();
        }}>
          <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}>
            <TopBar
              theme={"white"}
              title={Strings.notice}
              onBackPress={() => {
                this.onBack();
              }} />
            <SearchBox
              style={{ marginTop: 10 }}
              keyword={this.state.keyword}
              hint={Strings.enter_title_content}
              onChangeKeyword={(text) => {
                this.setState({ keyword: text });
              }}
              onSearch={() => {
                this.onSearch(this.state.keyword);
              }}
              onDelete={() => {
                this.onRemove();
              }}
            />
            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.noticeList}
              style={{ flex: 1, marginBottom: 15 }}
              numColumns={1}
              renderItem={({ item, index }) => (
                <Button onPress={() => {
                  this.onNoticeDetail(index);
                }}>
                  <VerticalLayout style={{ width: "100%" }}>
                    <HorizontalLayout
                      style={[MyStyles.padding_h_20, { width: "100%" }]}>
                      <Text style={[styles.category_text]}>
                        {/*{`[${item.category}]`}*/}
                        {`[${Strings.etc}]`}
                      </Text>
                      <Text style={styles.title_text} numberOfLines={1} ellipsizeMode="tail">
                        {item.title}
                      </Text>
                    </HorizontalLayout>
                    <Text style={styles.more_text}>
                      {item.reg_dt}
                    </Text>
                    <View style={styles.horizontal_divider} />
                  </VerticalLayout>
                </Button>
              )}
              refreshing={this.state.isRefreshing}
              onRefresh={() => this.handleLoadMore(true)}
              onEndReached={() => this.handleLoadMore(false)}
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

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({

  title_text: {
    marginTop: 20,
    marginLeft: 5,
    marginRight: 20,
    fontSize: 14,
    color: Colors.black,
  },

  category_text: {
    marginTop: 20,
    fontSize: 14,
    color: Colors.primary,
  },

  more_text: {
    marginTop: 10,
    marginHorizontal: 20,
    fontSize: 12,
    color: Colors.LIGHT_GREY,
  },

  horizontal_divider: {
    marginTop: 20,
    width: "100%",
    height: 1,
    backgroundColor: Colors.white_two,
  },
});

