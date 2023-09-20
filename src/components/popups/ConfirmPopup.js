import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import Colors from "../../constants/Colors";
import { Button, VerticalLayout } from "../controls";
import Strings from "../../constants/Strings";

class ConfirmPopup extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        transparent={true}
        isVisible={this.props.visible}
        statusBarTranslucent={true}
        backdropOpacity={0.8}
        style={{ margin: 0 }}
        coverScreen={true}
        onBackButtonPress={() => this.props.onCancel()}
        onModalShow={() => this.onShow()}>
        <VerticalLayout style={{ height: "100%" }}>
          <View style={{ flex: 1 }} />
          <Button
            opacity={1}
            onPress={() => this.props.onCancel()}>
            <VerticalLayout style={styles.container}>
              <Text style={styles.title_text}>
                {this.props.title}
              </Text>
              <Button
                style={{
                  width: "100%",
                  height: 50,
                  backgroundColor: Colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  this.props.onConfirm();
                }}>
                <Text style={{ fontSize: 16, color: Colors.white }}>{Strings.confirm}</Text>
              </Button>
            </VerticalLayout>
          </Button>
        </VerticalLayout>
      </Modal>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: Colors.white,
  },
  title_text: {
    fontSize: 16,
    color: Colors.black,
    paddingVertical: 40,
    textAlign: "center",
    alignSelf: "center",
    marginHorizontal: 20,
    lineHeight: 25,
  },
});

export default ConfirmPopup;
