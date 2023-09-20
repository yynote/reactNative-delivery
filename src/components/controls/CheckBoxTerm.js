import React from 'react';
import {Image, StyleSheet, Text} from 'react-native';
import {Button, HorizontalLayout} from "./index";
import Colors from "../../constants/Colors";
import {Strings} from "../../constants";

export class CheckBoxTerm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <HorizontalLayout style={{marginTop: 20, alignItems: "center"}}>
                <Button onPress={() => {this.props.onPress()}} style={{flex: 1}}>
                    <HorizontalLayout>
                        <Image
                            source={
                                this.props.checked
                                    ? require('src/assets/images/ic_checkbox_on.png')
                                    : require('src/assets/images/ic_checkbox_off.png')}
                            style={{width: 20, height: 20}}
                        />
                        <Text style={this.props.require ? styles.require : styles.normal}>
                            {this.props.require ? Strings.required : `[${Strings.optional}]`}
                        </Text>
                        <Text style={styles.normal}>
                            {this.props.label}
                        </Text>
                    </HorizontalLayout>
                </Button>
                <Button onPress={() => {this.props.onView()}} >
                    <HorizontalLayout>
                        <Text style={styles.view}>{Strings.view_full}</Text>
                        <Image
                            source={require('src/assets/images/ic_left.png')}
                            style={{width: 15, height: 10, alignSelf: "center"}}
                        />
                    </HorizontalLayout>
                </Button>
            </HorizontalLayout>
        )
    }
}

const styles = StyleSheet.create({
    require: {
        fontSize: 13,
        color: Colors.primary,
        marginLeft: 10,
        alignSelf: "center"
    },

    normal: {
        fontSize: 13,
        color: Colors.black,
        marginLeft: 10,
        alignSelf: "center"
    },

    view: {
        fontSize: 13,
        color: Colors.LIGHT_GREY,
        marginLeft: 10,
        alignSelf: "center"
    }
});
