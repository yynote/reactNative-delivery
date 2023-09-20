import React from 'react';
import {Image} from 'react-native';
import FastImage from 'react-native-fast-image';

export default class ScaledFastImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {source: {uri: this.props.uri}};
    }

    componentDidMount() {
        Image.getSize(this.props.uri, (width, height) => {
            if (this.props.width && !this.props.height) {
                this.setState({width: this.props.width, height: height * (this.props.width / width)});
            } else if (!this.props.width && this.props.height) {
                this.setState({width: width * (this.props.height / height), height: this.props.height});
            } else {
                this.setState({width: width, height: height});
            }
        });
    }

    render() {
        return (
            <FastImage
                source={this.state.source}
                resizeMode={this.props.resizeMode}
                style={[{height: this.state.height, width: this.state.width}, this.props.style]}/>
        );
    }
}
