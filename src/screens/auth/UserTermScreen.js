import React, { Component } from "react";
import { TabBar, TopBar } from "../../components/controls";
import Colors from "../../constants/Colors";
import { View } from "react-native";
import { MyStatusBar } from "../../components/controls/MyStatusBar";
import { Strings } from "../../constants";
import GlobalState from "../../mobx/GlobalState";
import { autoWidthImagesScript, tableBordered } from "../../components/controls/autoHeightWebView/config";
import AutoHeightWebView from "../../components/controls/autoHeightWebView";

export default class UserTermScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab_index: this.props.navigation.getParam("item") ? this.props.navigation.getParam("item") : 0,
    };

  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onBack() {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: Colors.white }}>
        <MyStatusBar theme="white" />
        <TopBar
          theme={"white"}
          title={Strings.user_term}
          onBackPress={() => {
            this.onBack();
          }} />
        <TabBar
          tab_index={this.state.tab_index}
          tab_count={3}
          textStyle={{ fontSize: 14 }}
          titles={[Strings.user_rule, Strings.privacy_policy, Strings.location_service]}
          onClick={(id) => {
            this.setState({
              tab_index: id,
            });
          }}
        />
        {
          this.state.tab_index === 0 &&
          <AutoHeightWebView
            customStyle={tableBordered}
            customScript={autoWidthImagesScript}
            style={{ marginHorizontal: 20, marginTop: 20 }}
            source={{ html: GlobalState.term[1].content }}
          />
        }
        {
          this.state.tab_index === 1 &&
          <AutoHeightWebView
            customStyle={tableBordered}
            customScript={autoWidthImagesScript}
            style={{ marginHorizontal: 20, marginTop: 20 }}
            source={{ html: GlobalState.term[0].content }}
          />
        }
        {
          this.state.tab_index === 2 &&
          <AutoHeightWebView
            customStyle={tableBordered}
            customScript={autoWidthImagesScript}
            style={{ marginHorizontal: 20, marginTop: 20 }}
            source={{ html: GlobalState.term[2].content }}
          />
        }
      </View>
    );
  }
}
