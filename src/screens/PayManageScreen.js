import React, { Component } from "react";
import { FlatList, Text, View } from "react-native";
import { Button, HorizontalLayout, ResizedImage, TopBar } from "../components/controls";
import { MyStatusBar } from "../components/controls/MyStatusBar";
import { Strings } from "../constants";
import Colors from "../constants/Colors";
import { CardItem } from "../components/items";
import AskPopup from "../components/popups/AskPopup";
import C, { API_RES_CODE, SCREEN_WIDTH } from "../constants/AppConstants";
import { Net, requestPost } from "../utils/APIUtils";
import GlobalState from "../mobx/GlobalState";
import Toast from "react-native-root-toast";
import EventBus from "react-native-event-bus";

export default class PayManageScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardList: [],
      isRefreshing: false,
      delConfirmPopup: false,
      delId: 0,
      setConfirmPopup: false,
      tempId: "",
    };
  }

  componentDidMount() {
    this.loadCardList();
    EventBus.getInstance().addListener(C.EVENT_PARAMS.CARD_REGISTER, this.listener = ({}) => {
      this.loadCardList();
    });
  }

  componentWillUnmount() {
  }

  onBack() {
    this.props.navigation.goBack();
  }

  loadCardList() {
    requestPost(Net.home.card_list, { access_token: GlobalState.access_token }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        let list = response.data.list;
        list.push("");
        this.setState({ cardList: list });
      } else {
        Toast.show(response.msg);
      }
    });

  };

  onDelete(id) {
    this.setState({
      delConfirmPopup: true,
      delId: id,
    });
  }

  doRemove(id) {
    let { cardList } = this.state;
    let newList = cardList.filter((item, index) => id !== index);
    this.setState({
      cardList: newList,
    });
    requestPost(Net.home.del_card, {
      access_token: GlobalState.access_token,
      card_uid: this.state.cardList[id].uid,
    }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        Toast.show(Strings.card_del_success);
        EventBus.getInstance().fireEvent(C.EVENT_PARAMS.CARD_REGISTER, {});
      } else {
        Toast.show(response.msg);
      }
    });
  }

  onSetDefault(id) {
    this.setState({
      setConfirmPopup: true,
      tempId: id,
    });
  }

  doDefault(id) {
    requestPost(Net.home.set_card, {
      access_token: GlobalState.access_token,
      card_uid: this.state.cardList[id].uid,
    }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        Toast.show(Strings.card_set_success);
        EventBus.getInstance().fireEvent(C.EVENT_PARAMS.CARD_REGISTER, {});
      } else {
        Toast.show(response.msg);
      }
    });
  }

  handleLoadMore = (clear) => {
    if (clear) {    // onRefresh
      this.noMoreData = false;
      this.setState({
        isRefreshing: clear,
        cardList: [],
        offset: 0,
      }, () => {
        this.loadCardList();
        this.setState({isRefreshing: false});
      });
    } else {        // onEndReached
      if (!this.noMoreData) {
        this.loadCardList();
      }
    }
  };

  render() {
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white_two }}>
        <MyStatusBar theme="white" />
        <TopBar
          theme={"white"}
          title={Strings.pay_method_manage}
          onBackPress={() => {
            this.onBack();
          }} />
        <View style={{ marginTop: 10, marginHorizontal: 20 }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={this.state.cardList}
            contentContainerStyle={{ paddingBottom: 90 }}
            onRefresh={() => this.handleLoadMore(true)}
            renderItem={({ item, index }) => (
              <View>
                {
                  item !== "" &&
                  <CardItem
                    item={item}
                    onDelete={() => this.onDelete(index)}
                    onSetDefault={() => this.onSetDefault(index)}
                  />
                }
                {
                  item === "" &&
                  <Button style={{
                    backgroundColor: Colors.LIGHT_GREY,
                    borderRadius: 10,
                    height: 170,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                          onPress={() => {
                            this.props.navigation.navigate("CardRegister");
                          }}
                  >
                    <HorizontalLayout>
                      <ResizedImage source={require("src/assets/images/ic_card.png")}
                                    style={{
                                      height: 40,
                                      width: 40,
                                      position: "absolute",
                                      right: SCREEN_WIDTH / 2 - 30,
                                      top: -10,
                                    }} />
                      <ResizedImage source={require("src/assets/images/ic_card_add.png")}
                                    style={{ height: 80, width: 80 }} />
                    </HorizontalLayout>
                    <Text
                      style={{ fontSize: 23, color: Colors.white, marginTop: 20 }}>{Strings.register_your_card}</Text>
                  </Button>
                }
              </View>
            )}
            refreshing={this.state.isRefreshing}
            onEndReachedThreshold={0.1}
            keyExtractor={(item, index) => `sale-${index.toString()}`}
          />
        </View>
        <AskPopup
          visible={this.state.delConfirmPopup}
          title={Strings.del_card_confirm}
          yes_no={false}
          onCancel={() => this.setState({ delConfirmPopup: false })}
          onConfirm={() => {
            this.setState({
              delConfirmPopup: false,
            }, () => {
              this.doRemove(this.state.delId);
            });
          }}
        />
        <AskPopup
          visible={this.state.setConfirmPopup}
          title={Strings.set_default_confirm}
          yes_no={false}
          onCancel={() => this.setState({ setConfirmPopup: false })}
          onConfirm={() => {
            this.setState({
              setConfirmPopup: false,
            }, () => {
              this.doDefault(this.state.tempId);
            });
          }}
        />
      </View>
    );
  }
}
