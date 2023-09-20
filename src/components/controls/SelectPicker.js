import { observer } from 'mobx-react';
import React from 'react';
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';
import MyStyles from '../../constants/MyStyles';
import TextStyles from '../../constants/TextStyles';
import Strings from '../../constants/Strings';
import { Button } from './Button';
import Colors from '../../constants/Colors';

@observer
export class SelectPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <Modal
        animationType="none"
        onRequestClose={() => { this.props.onCancel() }}
        transparent={true}
        style={MyStyles.container}
        visible={this.props.visible}>

        <TouchableWithoutFeedback onPress={() => { this.props.onCancel() }}>
          <View style={[MyStyles.modal_bg, { paddingHorizontal: 25 }]}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: Colors.white, borderRadius: 5, paddingHorizontal: 25 }}>
                {
                  this.props.title ?
                    <Text style={[TextStyles.TEXT_STYLE_44, { fontWeight: 'bold', marginTop: 20, marginBottom: 15, }]}>{this.props.title}</Text>
                    : null
                }
                {
                  this.props.data.map((item, index) => {
                    return (
                      <Button key={index} style={{ height: 55, justifyContent: 'center' }} onPress={() => {
                        if (this.props.onItemClick) {
                          this.props.onItemClick(item, index)
                        }
                      }}>
                        <Text style={[TextStyles.TEXT_STYLE_44, { fontWeight: 'normal', fontSize: 18 }]}>{item}</Text>
                      </Button>
                    )
                  })
                }
                {
                  this.props.cancel ?
                    <Button style={{ alignSelf: 'flex-end', marginTop: 10, marginBottom: 15 }} onPress={() => this.props.onCancel()}>
                      <Text style={[TextStyles.TEXT_STYLE_44, { fontWeight: 'normal', fontSize: 14 }]}>{this.props.cancel}</Text>
                    </Button>
                    : null
                }
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}
