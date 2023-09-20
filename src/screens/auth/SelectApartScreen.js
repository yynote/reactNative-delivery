import React, { Component } from "react";
import { FlatList, KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import { MyStatusBar } from "../../components/controls/MyStatusBar";
import { MyStyles, Strings, TextStyles } from "../../constants";
import { Button, HorizontalLayout, ResizedImage, SearchBox, TopBar, VerticalLayout } from "../../components/controls";
import C, { API_RES_CODE, SCREEN_WIDTH } from "../../constants/AppConstants";
import { Net, requestPost } from "../../utils/APIUtils";
import Toast from "react-native-root-toast";
import EventBus from "react-native-event-bus";
import GlobalState from "../../mobx/GlobalState";

export default class SelectApartScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: "",
      apartList: [],
      showPicker: false,
      pickerType: 3,
      areaList: [],
      areaShowList: [],
      parent: "",
      showEmptyUI: false,
      seng: "",
      hyang: "",
      si: "",
      sengId: "",
      hyangId: "",
      siId: "",
      selApart: -1,
      selectedApartUid: -1,
    };
  }

  componentDidMount() {
    this.loadAreaList();
  }

  componentWillUnmount() {
  }

  onBack() {
    this.props.navigation.goBack();
  }

  onNext() {
    if (this.state.selectedApartUid !== -1) {
      requestPost(Net.home.set_apart, {
        access_token: GlobalState.access_token,
        apart_uid: this.state.apartList[this.state.selectedApartUid].uid,
      }).then(response => {
        if (response.result === API_RES_CODE.SUCCESS) {
          Toast.show(Strings.set_apart_success);
          GlobalState.me.apart = this.state.apartList[this.state.selectedApartUid];
          EventBus.getInstance().fireEvent(C.EVENT_PARAMS.APT_SELECT, {});
          this.props.navigation.goBack();
        } else {
          Toast.show(response.msg);
        }
      });
    } else {
      Toast.show(Strings.sel_apart_alert);
    }
  }

  loadAreaList() {
    requestPost(Net.home.area_list, {}).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        this.setState({
          areaList: response.data.list,
        }, () => {
          let [sengId, seng] = this.getChildFromParent("0");
          let [hyangId, hyang] = this.getChildFromParent(sengId);
          let [siId, si] = this.getChildFromParent(hyangId);
          if (sengId === 0) return;
          this.setState({ sengId: sengId, hyangId: hyangId, siId: siId, seng: seng, hyang: hyang, si: si });
        });
      } else {
        Toast.show(response.msg);
      }
    });
  }

  getChildFromParent(parent) {
    let areaList = this.state.areaList;
    for (let i = 0; i < areaList.length; i++) {
      if (areaList[i].parent === parent) {
        return [areaList[i].uid, areaList[i].name];
      }
    }
    return [0, 0];
  }

  onSearch = (area_id, keyword) => {
    requestPost(Net.home.apart_list, { area_id: area_id, keyword: keyword }).then(response => {
      if (response.result === API_RES_CODE.SUCCESS) {
        let list = [];
        let ret_list = response.data.list;
        for (let i = 0; i < ret_list.length; i++) {
          list.push({
            uid: Number(ret_list[i].uid),
            name: ret_list[i].name,
            selected: false,
          });
        }

        this.setState({
          apartList: list,
        });
      } else {
        Toast.show(response.msg);
      }
    });
  };

  dummyData() {
    let list = [];
    for (let i = 0; i < 10; i++) {
      list.push({
        uid: i,
        name: `${this.state.keyword}Apart${i}`,
        seng: this.state.seng,
        hyang: this.state.hyang,
        si: this.state.si,
        selected: false,
      });
    }
    this.setState({
      apartList: list,
    });
  }

  onRemove = () => {
    this.setState({ keyword: "" });
  };

  onSelectApart(id) {
    let { apartList } = this.state;
    let apart = apartList[id];
    if (this.state.selApart !== -1) {
      if (id !== this.state.selApart) {
        let apart_old = apartList[this.state.selApart];
        apart_old = { ...apart_old, selected: !apart_old.selected };
        apartList[this.state.selApart] = apart_old;
        apart = { ...apart, selected: !apart.selected };
        apartList[id] = apart;
        this.setState({ apartList: apartList, selectedApartUid: id, selApart: id });
      } else {
        apart = { ...apart, selected: !apart.selected };
        apartList[id] = apart;
        this.setState({ apartList: apartList, selectedApartUid: -1, selApart: -1 });
      }
    } else {
      apart = { ...apart, selected: !apart.selected };
      apartList[id] = apart;
      this.setState({ apartList: apartList, selectedApartUid: id, selApart: id });
    }
  }

  onSelectArea(parent, name) {
    let { pickerType } = this.state;
    if (pickerType === 1) {
      this.setState({
        pickerType: 2,
        parent: parent,
        sengId: parent,
        seng: name,
        hyang: "",
        si: "",
        selApart: -1,
        selectedApartUid: -1,
      });
    } else if (pickerType === 2) {
      this.setState({
        pickerType: 3,
        parent: parent,
        hyangId: parent,
        hyang: name,
        si: "",
        selApart: -1,
        selectedApartUid: -1,
      });
    } else {
      this.setState({
        si: name,
        siId: parent,
        pickerType: 1,
        showPicker: false,
        selApart: -1,
        selectedApartUid: -1,
      }, () => this.onSearch(parent, ""));
    }
  }

  onClickAreaTitle(id) {
    if (id > 2) {
      this.setState({
        showPicker: true,
        pickerType: id,
      }, () => {
        if (id === 1) {
          this.setState({
            parent: 0,
          });
        } else if (id === 2) {
          this.setState({
            parent: this.state.sengId,
          });
        } else {
          this.setState({
            parent: this.state.hyangId,
          }, () => {
            let list = [];
            for (let i = 0; i < this.state.areaList.length; i++) {
              if (this.state.areaList[i].parent === this.state.parent) {
                list.push(this.state.areaList[i]);
              }
            }
            this.setState({
              areaShowList: list,
            });
          });
        }
      });
    }
  }

  onViewAll() {
    this.setState({
      showPicker: false,
    }, () => this.onSearch(0, ""));
  }

  render() {
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}>
        <MyStatusBar theme="white" />
        <TopBar
          theme={"white"}
          title={Strings.select_apart}
          rightLabel={Strings.skip}
          onBackPress={() => {
            this.onBack();
          }}
          onRightPress={() => {
            this.onBack();
          }}
        />
        <KeyboardAvoidingView style={{ width: "100%", flex: 1, backgroundColor: Colors.white }}
                              behavior={Platform.OS === "ios" ? "padding" : ""}>
          <View style={styles.horizontal_divider} />
          <HorizontalLayout style={[{ marginTop: 20 }, MyStyles.padding_h_20, MyStyles.center]}>
            <Button onPress={() => this.onClickAreaTitle(1)}
                    style={[MyStyles.primary_btn, MyStyles.center, { flex: 1 }]}>
              <Text style={styles.top_text}>{this.state.seng}</Text>
            </Button>
            <ResizedImage
              source={require("src/assets/images/ic_next.png")}
              style={{ width: 30, height: 20 }} />
            <Button onPress={() => this.onClickAreaTitle(2)}
                    style={[MyStyles.primary_btn, MyStyles.center, { flex: 1 }]}>
              <Text style={styles.top_text}>{this.state.hyang}</Text>
            </Button>
            <ResizedImage
              source={require("src/assets/images/ic_next.png")}
              style={{ width: 30, height: 20 }} />
            <Button onPress={() => this.onClickAreaTitle(3)}
                    style={[MyStyles.primary_btn, MyStyles.center, { flex: 1 }]}>
              <Text style={styles.top_text}>{this.state.si}</Text>
            </Button>
          </HorizontalLayout>
          {
            !this.state.showPicker &&
            <SearchBox
              style={{ marginTop: 20 }}
              keyword={this.state.keyword}
              hint={Strings.enter_search_word}
              onChangeKeyword={(text) => {
                this.setState({ keyword: text });
              }}
              onSearch={() => {
                this.onSearch(this.state.siId, this.state.keyword);
              }}
              onDelete={() => {
                this.onRemove();
              }}
            />
          }
          {
            this.state.showPicker &&
            <VerticalLayout style={MyStyles.padding_h_20}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state.areaShowList}
                style={{ marginTop: 20 }}
                numColumns={3}
                renderItem={({ item, index }) => (
                  <View style={{width: (SCREEN_WIDTH - 40) / 3}}>
                    <Button onPress={() => this.onSelectArea(item.uid, item.name)}
                            style={[styles.area_btn, MyStyles.center]}>
                      <Text style={styles.item_text}>
                        {item.name}
                      </Text>
                    </Button>
                  </View>

                )}
                onEndReachedThreshold={0.1}
                ListEmptyComponent={(<View />)}
                keyExtractor={(item, index) => index.toString()}
              />
              <Button onPress={() => this.onViewAll()}
                      style={[MyStyles.primary_btn, { borderRadius: 0 }]}>
                {
                  this.state.pickerType === 1 &&
                  <Text style={styles.top_text}>
                    {Strings.view_all}
                  </Text>
                }
                {
                  this.state.pickerType === 2 &&
                  <Text style={styles.top_text}>
                    {Strings.view_all}
                  </Text>
                }
                {
                  this.state.pickerType === 3 &&
                  <Text style={styles.top_text}>
                    {Strings.view_all}
                  </Text>
                }
              </Button>
            </VerticalLayout>
          }
          <FlatList
            showsVerticalScrollIndicator={false}
            data={this.state.apartList}
            style={{ flex: 1, marginTop: 20 }}
            numColumns={1}
            renderItem={({ item, index }) => (
              <VerticalLayout style={MyStyles.padding_h_20}>
                <Button style={item.selected ? styles.apart_bg_active : styles.apart_bg}
                        onPress={() => {
                          this.onSelectApart(index);
                        }}>
                  <Text style={styles.item_text}>{item.name}</Text>
                  <Text
                    style={[styles.item_text, { marginTop: 5 }]}>{`${this.state.seng} ${this.state.hyang} ${this.state.si}`}</Text>
                </Button>
                <View style={styles.horizontal_divider} />
              </VerticalLayout>
            )}
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
            keyExtractor={(item, index) => index.toString()}
          />
          <Button
            style={[MyStyles.bottom_btn, { marginBottom: 0 }]}
            onPress={() => {
              this.onNext();
            }}
          >
            <Text style={styles.top_text}>
              {Strings.select_complete}
            </Text>
          </Button>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  horizontal_divider: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.divider,
  },
  top_text: {
    color: Colors.white,
    fontSize: 16,
  },

  apart_bg_active: {
    height: 70,
    backgroundColor: Colors.apart,
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  apart_bg: {
    height: 70,
    width: "100%",
    backgroundColor: Colors.white,
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  item_text: {
    color: Colors.black,
    fontSize: 16,
  },

  area_btn: {
    height: 40,
    backgroundColor: Colors.white_two,
    borderWidth: 0.5,
    borderColor: Colors.area_border,
  },

});
