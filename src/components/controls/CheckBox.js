import React from 'react';
import {Image, Text} from 'react-native';
import {Button, HorizontalLayout} from "./index";
import {MyStyles} from "../../constants";

export class CheckBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Button onPress={() => {this.props.onPress()}}>
                <HorizontalLayout style={[this.props.style, {alignItems: "center"}]}>
                    <Image
                        source={
                            this.props.checked
                                ? require('src/assets/images/ic_checkbox_on.png')
                                : require('src/assets/images/ic_checkbox_off.png')}
                        style={{width: 20, height: 20}}
                    />
                    <Text style={[this.props.textStyle, {marginLeft: 10}]}>
                        {this.props.label}
                    </Text>
                </HorizontalLayout>
            </Button>
        )
    }
}
