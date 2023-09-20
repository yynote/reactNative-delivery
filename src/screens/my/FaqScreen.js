import React, { Component } from "react";
import { FlatList, Keyboard, ScrollView, Text, View } from "react-native";
import { SearchBox, TopBar } from "../../components/controls";
import Colors from "../../constants/Colors";
import { MyStyles, Strings, TextStyles } from "../../constants";
import { FaqCategoryItem, FaqItem } from "../../components/items";
import { MyStatusBar } from "../../components/controls/MyStatusBar";
import { Net, requestPost } from "../../utils/APIUtils";
import { API_RES_CODE } from "../../constants/AppConstants";
import Toast from "react-native-root-toast";

export default class FaqScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: "",
      cateList: [],
      faqList: [],
      selectedCate: 0,
      isRefreshing: false,
      showEmptyUI: false,
    };
  }

  componentDidMount() {
    this.initCategory();
    this.loadFaqList();
  }

  componentWillUnmount() {
  }

  onRemove = () => {
    this.setState({ keyword: "" });
  };
  onSearch = (keyword) => {
    Keyboard.dismiss();
    requestPost(Net.home.faq_list, { keyword: keyword, category: this.state.selectedCate }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        this.setState({
          isRefreshing: false,
          faqList: response.data.list,
        }, () => {
          this.setState({ showEmptyUI: this.state.faqList.length === 0 });
        });

      } else {
        Toast.show(response.msg);
      }
    });
  };

  render() {
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white_two }}>
        <MyStatusBar theme="white" />
        <TopBar
          theme={"white"}
          title={Strings.faq}
          style={[{ width: "100%" }, MyStyles.shadow]}
          onBackPress={() => {
            this.props.navigation.goBack();
          }} />

        <View style={[{
          backgroundColor: Colors.white,
          height: 60,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }, MyStyles.shadow]}>
          <SearchBox
            style={{ marginBottom: 10 }}
            keyword={this.state.keyword}
            hint={Strings.enter_hint}
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
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <View>
              <FlatList
                style={{ margin: 20 }}
                numColumns={4}
                showsVerticalScrollIndicator={false}
                data={this.state.cateList}
                renderItem={({ item, index }) =>
                  <FaqCategoryItem
                    item={item}
                    selected={item.selected}
                    onPress={() => {
                      if (index !== 7) {
                        let cateList = this.state.cateList;
                        for (let i = 0; i < cateList.length; i++) {
                          cateList[i].selected = i === index;
                        }
                        this.setState({ cateList: cateList, selectedCate: index }, () => {
                          this.loadFaqList();
                        });
                      }
                    }}
                  />
                }
              />
            </View>
            <View>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state.faqList}
                renderItem={({ item, index }) =>
                  <FaqItem
                    index={index}
                    item={item} />
                }
                refreshing={this.state.isRefreshing}
                onRefresh={() => this.handleLoadMore(true)}
                // onEndReached={() => this.handleLoadMore(false)}
                onEndThreshold={0.1}
                ListEmptyComponent={this.state.showEmptyUI && (
                  <View
                    style={{ width: "100%", flex: 1, justifyContent: "center", alignItems: "center", marginTop: 100 }}>
                    <Text style={TextStyles.TEXT_STYLE_14}>{Strings.no_item}</Text>
                  </View>
                )}
                keyExtractor={(item, index) => `sale-${index.toString()}`}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  initCategory = () => {
    this.setState({
      cateList: [
        {
          id: 0,
          title: Strings.top_10,
          selected: true,
        },
        {
          id: 1,
          title: Strings.signup,
          selected: false,
        },
        {
          id: 2,
          title: Strings.payment,
          selected: false,
        },
        {
          id: 3,
          title: Strings.review_manage,
          selected: false,
        },
        {
          id: 4,
          title: Strings.usage_inquiry,
          selected: false,
        },
        {
          id: 5,
          title: Strings.inconvenience_inquiry,
          selected: false,
        },
        {
          id: 6,
          title: Strings.etc,
          selected: false,
        },
        {
          id: 7,
          title: "",
          selected: false,
        },
      ],
    }, () => {
      this.handleLoadMore(true);
    });
  };

  loadFaqList = () => {
    requestPost(Net.home.faq_list, { keyword: "", category: this.state.selectedCate }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        this.setState({
          isRefreshing: false,
          faqList: response.data.list,
        }, () => {
          this.setState({
            showEmptyUI: this.state.faqList.length === 0,
          });
        });

      } else {
        Toast.show(response.msg);
      }
    });
    this.noMoreData = false;
  };

  handleLoadMore = (clear) => {
    if (clear) {    // onRefresh
      this.noMoreData = false;
      this.setState({
        isRefreshing: clear,
        faqList: [],
        offset: 0,
      }, () => {
        this.loadFaqList();
      });
    } else {        // onEndReached
      if (!this.noMoreData) {
        this.loadFaqList();
      }
    }
  };
}


