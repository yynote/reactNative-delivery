import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, HorizontalLayout, VerticalLayout} from '../controls';
import {Colors, MyStyles, Strings} from '../../constants';

export class InquiryItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
  }

  render() {
    const {item} = this.props;

    return (
      <Button onPress={() => {
        this.props.onPress();
      }}>
        <HorizontalLayout style={[MyStyles.padding_h_20, {paddingTop: 25}]}>
          <VerticalLayout style={{flex: 1}}>
            <HorizontalLayout
              style={[{width: "100%"}]}>
              <Text style={[styles.category_text]}>
                {`[${item.category}]`}
              </Text>
              <Text style={styles.title_text} numberOfLines={1}>
                {item.title}
              </Text>
            </HorizontalLayout>
            <Text style={styles.more_text}>
              {item.reg_dt}
            </Text>
          </VerticalLayout>
          <Button style={item.answer === null || item.answer === '' ? styles.reception_btn : styles.completed_btn}>
            <Text style={item.answer === null || item.answer === '' ? styles.reception_text : styles.completed_text}>
              {item.answer === null || item.answer === '' ? Strings.reception : Strings.completed}
            </Text>
          </Button>
        </HorizontalLayout>
      </Button>
    )
  }
}

const styles = StyleSheet.create({

  title_text: {
    marginLeft: 5,
    fontSize: 14,
    color: Colors.black,
    flex: 1
  },

  category_text: {
    fontSize: 14,
    color: Colors.primary,
  },

  more_text: {
    marginTop: 10,
    fontSize: 12,
    color: Colors.LIGHT_GREY,
  },

  horizontal_divider: {
    marginTop: 20,
    width: '100%',
    height: 1,
    backgroundColor: Colors.white_two,
  },

  reception_btn: {
    width: 90,
    height: 35,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    alignSelf: "center"
  },

  reception_text: {
    fontSize: 13,
    color: Colors.LIGHT_GREY
  },

  completed_btn: {
    width: 90,
    height: 35,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    alignSelf: "center"
  },

  completed_text: {
    fontSize: 13,
    color: Colors.primary
  }
})

export default InquiryItem;


