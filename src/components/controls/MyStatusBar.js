// common
import React from 'react';
import { View, StatusBar } from 'react-native';
import Colors from '../../constants/Colors';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export class MyStatusBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    switch (this.props.theme) {
      case "white":
        return (
          <View>
            <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent={true} />
            <View style={{ backgroundColor: Colors.white, height: getStatusBarHeight() }} />
          </View>
        )
      case "primary":
        return (
          <View>
            <StatusBar barStyle="light-content" backgroundColor={'transparent'} translucent={true} />
            <View style={{ backgroundColor: Colors.primary, height: getStatusBarHeight() }} />
          </View>
        )
      case "black":
        return (
          <View>
            <StatusBar barStyle="light-content" backgroundColor={'transparent'} translucent={true} />
            <View style={{ backgroundColor: Colors.black, height: getStatusBarHeight() }} />
          </View>
        )
      case "clear":
        return (
          <View>
            <StatusBar barStyle="light-content" backgroundColor={'transparent'} translucent={true} />
          </View>
        )
      case "trans_blue":
        return (
          <View>
            <StatusBar barStyle="light-content" backgroundColor={'transparent'} translucent={true} />
            <View style={{ backgroundColor: Colors.primary, opacity: 0.9, height: getStatusBarHeight() }} />
          </View>
        )
    }
  }
}