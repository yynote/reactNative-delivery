// common
import React from "react";
import { Text, TouchableHighlight, TouchableWithoutFeedback, View } from "react-native";
import Colors from "../../constants/Colors";
import TextStyles from "../../constants/TextStyles";
import ModalDropdown from "./ModalDropdown";
import { ResizedImage } from "./ResizedImage";

// rowData : {code:"", value:""} 
export class CustomDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
  }

  clear() {
    this.setState({
      active: false,
    });

    this.dropdown.select(-1);
  }

  select(idx) {
    if (idx >= 0) {
      this.setState({
        active: true,
      });
    } else {
      this.setState({
        active: false,
      });
    }
    this.dropdown.select(idx);
  }

  componentDidMount() {
    if (this.props.defaultIndex >= 0) {
      this.setState({
        active: true,
      });
    } else {
      this.setState({
        active: false,
      });
    }

    this.dropdown.select(this.props.defaultIndex);
  }

  render() {
    return (
      <View style={[{ justifyContent: "center" }, this.props.style]}>
        <ModalDropdown ref={c => {
          this.dropdown = c;
        }}
                       style={this.state.active ? styles.dropdown_active : styles.dropdown}
                       textStyle={this.state.active ? styles.dropdown_text_active : styles.dropdown_text}
                       dropdownStyle={[styles.dropdown_dropdown, this.props.arrowUp ? { marginTop: -23 } : { marginTop: 6 }]}
                       options={this.props.options}
                       defaultIndex={this.props.defaultIndex}
                       defaultValue={this.props.defaultValue}
                       renderButtonText={(rowData) => {
                         if (rowData.code === 0) {
                           this.setState({ active: false });
                         } else {
                           this.setState({ active: true });
                         }

                         if (this.props.renderButtonText != null) {
                           this.props.renderButtonText(rowData);
                         } else {
                           return rowData.value;
                         }
                       }}
                       renderRow={this._dropdown_renderRow.bind(this)}
                       renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                       onSelect={(rowData, idx) => {
                         if (this.props.onSelect != null) {
                           this.props.onSelect(rowData, idx);
                         }
                       }}
        >
        </ModalDropdown>

        <TouchableWithoutFeedback onPress={() => {
          this.dropdown._onButtonPress();
        }}>

          <ResizedImage
            source={require("src/assets/images/ic_down.png")}
            style={{ position: "absolute", right: 10, top: 15, alignSelf: "center" }} />
        </TouchableWithoutFeedback>
      </View>
    );
  }

  _dropdown_renderButtonText(rowData) {
    return (
      <Text style={{ width: "100%", alignItems: "center", flexDirection: "row", justifyContent: "center" }}>
        <Text style={[TextStyles.TEXT_STYLE_12]}>{rowData.value} </Text>
        <ResizedImage source={require("src/assets/images/ic_down.png")} style={{ alignSelf: "center" }} />
      </Text>
    );
  }

  _dropdown_renderRow(rowData, rowID, highlighted) {
    return (
      <TouchableHighlight underlayColor="cornflowerblue" onPress={() => {
        this.dropdown._onRowPress(rowData, rowID);
      }}>
        <View style={[styles.dropdown_row]}>
          <Text style={[styles.dropdown_row_text, highlighted && { color: Colors.primary }]}>
            {`${rowData.value}`}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  _dropdown_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    if (rowID === this.props.options.length - 1) return;
    let key = `spr_${rowID}`;
    return (<View style={styles.dropdown_separator}
                  key={key}
    />);
  }
}

const styles = {
  dropdown: {
    height: 50,
    justifyContent: "center",
    borderRadius: 4,
    backgroundColor: Colors.white,
    borderStyle: "solid",
    borderBottomWidth: 0,
    borderColor: Colors.LIGHT_GREY,
  },
  dropdown_active: {
    height: 50,
    borderRadius: 4,
    backgroundColor: Colors.white_two,
    borderStyle: "solid",
    borderBottomWidth: 0,
    borderColor: Colors.LIGHT_GREY,
  },
  dropdown_text: {
    paddingHorizontal: 20,
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 46,
    letterSpacing: 0,
    color: Colors.LIGHT_GREY,
    marginRight:15
  },
  dropdown_text_active: {
    paddingHorizontal: 20,
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 46,
    letterSpacing: 0,
    color: Colors.LIGHT_GREY,
  },
  dropdown_dropdown: {
    width: "100%",
  },
  dropdown_row: {
    flexDirection: "row",
    paddingHorizontal: 20,
    height: 50,
    alignItems: "center",
  },
  dropdown_row_text: {
    fontSize: 12,
    color: Colors.LIGHT_GREY,
  },
  dropdown_separator: {
    height: 1,
    backgroundColor: Colors.white_two,
  },
  ic_dropdown: {
    width: 8.73,
    height: 4.36,
  },
};
