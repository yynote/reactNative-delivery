import React from "react";
import { Text, View } from "react-native";
import Modal from "react-native-modal";
import Colors from "../../constants/Colors";
import { Button, RadioButton, VerticalLayout } from "../controls";
import Strings from "../../constants/Strings";
import { SCREEN_WIDTH } from "../../constants/AppConstants";
import { MyStyles } from "../../constants";

class PayChangePopup extends React.Component {

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
        <VerticalLayout style={[{ height: "100%" }, MyStyles.center]}>
          <View style={{
            width: 2 * SCREEN_WIDTH / 3,
            height: 200,
            backgroundColor: Colors.white,
            padding: 20,
            borderRadius: 10,
          }}>
            <RadioButton
              onPress={() => {
                this.props.onCard();
              }}
              selected={this.props.payMethod === 1}
              title={Strings.credit_card_pay}
              fontSize={14}
            />
            <RadioButton
              onPress={() => {
                this.props.onAccount();
              }}
              selected={this.props.payMethod === 2}
              title={Strings.account_transfer_pay}
              fontSize={14}
            />
            <View style={{ width: "100%", alignItems: "center" }}>
              <Button
                style={[{
                  width: 100,
                  height: 40,
                  backgroundColor: Colors.primary,
                  marginTop: 40,
                  borderRadius: 5,
                }, MyStyles.center]}
                onPress={() => this.props.onOk()}
              >
                <Text style={{ fontSize: 16, color: Colors.white }}>{Strings.ok}</Text>
              </Button>
            </View>

          </View>
        </VerticalLayout>
      </Modal>
    );
  }

}

export default PayChangePopup;
