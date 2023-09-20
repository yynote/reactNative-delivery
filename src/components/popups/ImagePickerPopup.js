import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import {Colors, MyStyles, Strings, TextStyles} from '../../constants';
import { Button, HorizontalLayout, ResizedImage, VerticalLayout } from '../controls';
import Modal from 'react-native-modal';

class ImagePickerPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  render() {
    return (
      <Modal
          transparent={true}
          isVisible={this.props.visible}
          statusBarTranslucent={true}
          backdropOpacity={0.8}
          style={{margin: 0}}
          coverScreen={true}
          onBackButtonPress={() => this.onCancel()}
          onModalShow={() => this.onShow()}>
        <SafeAreaView>
          <Button
            opacity={1}
            onPress={() => this.onCancel()}>
            <View>
              <VerticalLayout style={{padding: 10, backgroundColor: Colors.white, borderRadius: 3, marginHorizontal: 26}}>
                <View>
                  <HorizontalLayout style={{height: 48, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#dcdcdc'}}>
                    <Text style={[TextStyles.TEXT_STYLE_16]}>{Strings.select_photo}</Text>
                    <Button onPress={() => this.onCancel()}>
                      <ResizedImage source={require('src/assets/images/ic_input_del.png')}
                        style={{width: 30}}
                      />
                    </Button>
                  </HorizontalLayout>
                </View>
                <View>
                  <VerticalLayout style={{marginVertical: 20, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <Button style={[{width: 200, height: 50, backgroundColor: Colors.grey2, marginTop: 20}, MyStyles.center]}
                        onPress={() => this.props.onCamera()}>
                      <Text style={[TextStyles.TEXT_STYLE_14, TextStyles.TEXT_STYLE_Center]}>{Strings.camera}</Text>
                    </Button>
                    <Button style={[{width: 200, height: 50, backgroundColor: Colors.primary, marginTop: 20}, MyStyles.center]}
                        onPress={() => this.props.onGallery()}>
                      <Text style={[TextStyles.TEXT_STYLE_14, TextStyles.TEXT_STYLE_Center, {color: Colors.white}]}>{Strings.gallery}</Text>
                    </Button>
                  </VerticalLayout>
                </View>

              </VerticalLayout>
            </View>
          </Button>
        </SafeAreaView>
      </Modal>
    );
  }
}

ImagePickerPopup.defaultProps = {
  onCancel: () => {
  },
  onCamera: () => {
  },
  onGallery: () => {
  }
};

export default ImagePickerPopup;
