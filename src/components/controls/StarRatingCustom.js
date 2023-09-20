import React from "react";
import { View } from "react-native";
import { Button, HorizontalLayout, ResizedImage } from "./index";

export class StarRatingCustom extends React.Component {
  constructor(props) {
    super(props);

  }

  onStarClick(index) {
    if (!this.props.disabled) {
      this.props.onClick(index);
    }
  }

  onDrawStar(index, val) {
    let starLeft = Math.round(val * 2) / 2;
    starLeft -= index - 1;
    if (starLeft >= 1) {
      return this.props.fullStar;
    } else if (starLeft === 0.5) {
      return this.props.halfStar;
    } else {
      return this.props.emptyStar;
    }
  }

  render() {

    return (
      <HorizontalLayout>
        <Button onPress={() => this.onStarClick(1)}>
          <View style={this.props.buttonStyle}>
            <ResizedImage source={this.onDrawStar(1, this.props.starCnt)}
                          style={{ width: this.props.size, height: this.props.size }} />
          </View>
        </Button>
        <Button onPress={() => this.onStarClick(2)}>
          <View style={this.props.buttonStyle}>
            <ResizedImage source={this.onDrawStar(2, this.props.starCnt)}
                          style={{ width: this.props.size, height: this.props.size }} />
          </View>
        </Button>
        <Button onPress={() => this.onStarClick(3)}>
          <View style={this.props.buttonStyle}>
            <ResizedImage source={this.onDrawStar(3, this.props.starCnt)}
                          style={{ width: this.props.size, height: this.props.size }} />
          </View>
        </Button>
        <Button onPress={() => this.onStarClick(4)}>
          <View style={this.props.buttonStyle}>
            <ResizedImage source={this.onDrawStar(4, this.props.starCnt)}
                          style={{ width: this.props.size, height: this.props.size }} />
          </View>
        </Button>
        <Button onPress={() => this.onStarClick(5)}>
          <View style={this.props.buttonStyle}>
            <ResizedImage source={this.onDrawStar(5, this.props.starCnt)}
                          style={{ width: this.props.size, height: this.props.size }} />
          </View>
        </Button>
      </HorizontalLayout>
    );
  }
}
