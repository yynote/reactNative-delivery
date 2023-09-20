import React from "react";
import { View } from "react-native";

import { Button } from "./Button";
import { ResizedImage } from "./ResizedImage";
import { MyDropdown } from "./MyDropdown";
import { CheckBox } from "./CheckBox";
import { TopBar } from "./TopBar";
import { SearchBox } from "./SearchBox";
import { CheckBoxTerm } from "./CheckBoxTerm";
import { TabBar } from "./TabBar";
import { MainTopBar } from "./MainTopBar";
import { CustomDropdown } from "./CustomDropdown";
import { AdjustQuantity } from "./AdjustQuantity";
import { RadioButton } from "./RadioButton";
import { StarRatingCustom } from "./StarRatingCustom";

class HorizontalLayout extends React.Component {
  render() {
    return <View {...this.props} style={[this.props.style, { flexDirection: "row" }]} />;
  }
}

class VerticalLayout extends React.Component {
  render() {
    return <View {...this.props} style={[this.props.style, { flexDirection: "column" }]} />;
  }
}

export {
  Button,
  ResizedImage,
  HorizontalLayout,
  VerticalLayout,
  MyDropdown,
  CheckBox,
  TopBar,
  SearchBox,
  CheckBoxTerm,
  TabBar,
  MainTopBar,
  CustomDropdown,
  AdjustQuantity,
  RadioButton,
  StarRatingCustom
};
