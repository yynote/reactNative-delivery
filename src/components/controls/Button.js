import React from 'react';
import { TouchableOpacity } from 'react-native';
import debounce from 'lodash.debounce';

export class Button extends React.Component {
  debouncedOnPress = () => {
    this.props.onPress && this.props.onPress();
  }

  onPress = debounce(this.debouncedOnPress, 300, { leading: true, trailing: false });

  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;
    const opacity = 0.8; // default is 0.2
    return (
        <TouchableOpacity activeOpacity={opacity}  {...props} onPress={this.onPress}/>
    )
  }
}
