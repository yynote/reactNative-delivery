import React from "react";
import { Text, View } from "react-native";
import { Button, HorizontalLayout, ResizedImage } from "../controls";
import { Colors } from "../../constants";
import Common from "../../utils/Common";
import { autoWidthImagesScript, tableBordered } from "../controls/autoHeightWebView/config";
import AutoHeightWebView from "../controls/autoHeightWebView";

export class FaqItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };
  }

  componentDidMount() {
  }

  render() {
    const { item, index } = this.props;

    return (
      <View>
        <Button
          style={{ marginBottom: 10, backgroundColor: Colors.white }}
          onPress={() => {
            this.setState({ show: !this.state.show });
          }}>
          <HorizontalLayout style={{
            paddingHorizontal: 20,
            alignItems: "center",
            height: 50,
            borderBottomColor: Colors.white_two,
            borderBottomWidth: 1,
          }}>
            <Text style={{ fontSize: 12, color: Colors.primary }}>{Common.get_styled_number(index + 1)}</Text>
            <Text style={{ fontSize: 12, color: Colors.black, paddingLeft: 10, flex: 1 }}>{item.title}</Text>
            <ResizedImage source={
              !this.state.show ?
                require("src/assets/images/ic_down_colored.png")
                : require("src/assets/images/ic_top_up.png")} />
          </HorizontalLayout>
        </Button>
        {this.state.show &&
        <AutoHeightWebView
          customStyle={tableBordered}
          customScript={autoWidthImagesScript}
          style={{ marginHorizontal: 20, marginTop: 20 }}
          source={{ html: item.content }}
        />
        }

      </View>

    );
  }


}

export default FaqItem;
