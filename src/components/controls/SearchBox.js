import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {Button, HorizontalLayout, ResizedImage} from "./index";
import {MyStyles, Strings, TextStyles} from "../../constants";
import Colors from "../../constants/Colors";

export class SearchBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <HorizontalLayout style={[styles.search_box, MyStyles.center, this.props.style]}>
                <TextInput
                    value={this.props.keyword}
                    style={[TextStyles.TEXT_STYLE_14, {
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        flex: 1
                    }]}
                    onChangeText={text => {
                        this.props.onChangeKeyword(text);
                    }}
                    placeholder={this.props.hint}
                    placeholderTextColor={Colors.LIGHT_GREY}
                    returnKeyType="search"
                    onSubmitEditing={() => {
                        this.props.onSearch();
                    }}
                />
                <Button style={[styles.action_btn, MyStyles.center]} onPress={() => {
                    this.props.onDelete()
                }}>
                    <ResizedImage
                        source={require("src/assets/images/ic_input_del.png")}
                        style={{width: 25}}/>
                </Button>
                <Button style={[styles.action_btn, MyStyles.center]} onPress={() => {
                    this.props.onSearch()
                }}>
                    <ResizedImage
                        source={require("src/assets/images/ic_input_search.png")}
                        style={{width: 25}}/>
                </Button>
            </HorizontalLayout>
        )
    }
}

const styles = StyleSheet.create({
    search_box: {
        marginHorizontal: 20,
        height: 50,
        borderRadius: 30,
        backgroundColor: Colors.white_two
    },

    action_btn: {
        height: 50,
        marginRight: 15
    }
})
