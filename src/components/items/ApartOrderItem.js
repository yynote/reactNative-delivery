import React from "react";
import { Text, View } from "react-native";
import { HorizontalLayout, VerticalLayout } from "../controls";
import { Colors, MyStyles, Strings } from "../../constants";

export class ApartOrderItem extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }
  render() {
    const {item} = this.props;
    return (
      <View style={{height:70, marginTop:0}}>
        <HorizontalLayout>
          <VerticalLayout style={{marginTop:10, flex:1}}>
            <Text style={{fontSize:18, color: Colors.black}}>{item.shop_name}</Text>
            <Text style={{fontSize:12, color: Colors.black, marginTop:5}}>{Strings.rating + " " + item.rate.toString() + " " + Strings.review + " " + item.review_cnt.toString()}</Text>
          </VerticalLayout>
          <HorizontalLayout style={[MyStyles.center, {width: 120, height: 50, borderWidth: 1, borderRadius: 10, borderColor: Colors.primary, marginTop:10}]}>
            <VerticalLayout>
              <Text style={{fontSize: 18, color: Colors.black, alignSelf: "center"}}>
                {`${item.current}`}
              </Text>
              <Text style={{fontSize: 12, color: Colors.black}}>
                {`(${Strings.current})`}
              </Text>
            </VerticalLayout>
            <Text style={{fontSize: 18, color: Colors.black, marginBottom: 18}}>
              {'/'}
            </Text>
            <VerticalLayout style={{marginLeft:10}}>
              <Text style={{fontSize: 18, color: Colors.black, alignSelf: "center"}}>
                {`${item.min}`}
              </Text>
              <Text style={{fontSize: 12, color: Colors.black}}>
                {`(${Strings.min})`}
              </Text>
            </VerticalLayout>
          </HorizontalLayout>
        </HorizontalLayout>
        <View style={[MyStyles.horizontal_divider, {marginTop:5}]}/>
      </View>
    )
  }
}

export default ApartOrderItem;
