// common
import React from 'react';
import { Image } from 'react-native';


export class ResizedImage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      < Image
        resizeMode={this.props.resizeMode ? this.props.resizeMode : "contain"}
        source={this.props.source}
        style={this.props.style}
      />
    )
  }
}