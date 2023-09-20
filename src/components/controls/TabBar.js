import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, HorizontalLayout, VerticalLayout } from "./index";
import Colors from "../../constants/Colors";
import { MyStyles } from "../../constants";

export class TabBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        {
          this.props.tab_count < 4 &&
          <HorizontalLayout style={styles.main_area}>
            <Button style={styles.tab_btn} onPress={() => {
              this.props.onClick(0);
            }}>
              <VerticalLayout style={MyStyles.full}>
                <Text
                  style={[{ flex: 1 }, MyStyles.center, this.props.tab_index === 0 ? styles.active_title : styles.title, this.props.textStyle]}>
                  {this.props.titles[0]}
                </Text>
                <View style={this.props.tab_index === 0 ? styles.active_bar : styles.bar} />
              </VerticalLayout>
            </Button>
            <Button style={styles.tab_btn} onPress={() => {
              this.props.onClick(1);
            }}>
              <VerticalLayout style={MyStyles.full}>
                <Text
                  style={[{ flex: 1 }, MyStyles.center, this.props.tab_index === 1 ? styles.active_title : styles.title, this.props.textStyle]}>
                  {this.props.titles[1]}
                </Text>
                <View style={this.props.tab_index === 1 ? styles.active_bar : styles.bar} />
              </VerticalLayout>
            </Button>
            {
              this.props.tab_count > 2 &&
              <Button style={styles.tab_btn} onPress={() => {
                this.props.onClick(2);
              }}>
                <VerticalLayout style={MyStyles.full}>
                  <Text
                    style={[{ flex: 1 }, MyStyles.center, this.props.tab_index === 2 ? styles.active_title : styles.title, this.props.textStyle]}>
                    {this.props.titles[2]}
                  </Text>
                  <View style={this.props.tab_index === 2 ? styles.active_bar : styles.bar} />
                </VerticalLayout>
              </Button>
            }
          </HorizontalLayout>

        }

        {
          this.props.tab_count === 5 &&
          <HorizontalLayout style={styles.main_area}>
            <Button style={styles.tab_btn} onPress={() => {
              this.props.onClick(0);
            }}>
              <VerticalLayout style={MyStyles.full}>
                <Text
                  style={[{ flex: 1 }, MyStyles.center, this.props.tab_index === 0 ? styles.active_title : styles.title, this.props.textStyle]}>
                  {this.props.titles[0]}
                </Text>
                <View style={this.props.tab_index === 0 ? styles.active_bar : styles.bar} />
              </VerticalLayout>
            </Button>
            <Button style={styles.tab_btn} onPress={() => {
              this.props.onClick(1);
            }}>
              <VerticalLayout style={MyStyles.full}>
                <Text
                  style={[{ flex: 1 }, MyStyles.center, this.props.tab_index === 1 ? styles.active_title : styles.title, this.props.textStyle]}>
                  {this.props.titles[1]}
                </Text>
                <View style={this.props.tab_index === 1 ? styles.active_bar : styles.bar} />
              </VerticalLayout>
            </Button>


            <Button style={styles.tab_btn} onPress={() => {
              this.props.onClick(2);
            }}>
              <VerticalLayout style={MyStyles.full}>
                <Text
                  style={[{ flex: 1 }, MyStyles.center, this.props.tab_index === 2 ? styles.active_title : styles.title, this.props.textStyle]}>
                  {this.props.titles[2]}
                </Text>
                <View style={this.props.tab_index === 2 ? styles.active_bar : styles.bar} />
              </VerticalLayout>
            </Button>
            <Button style={styles.tab_btn} onPress={() => {
              this.props.onClick(3);
            }}>
              <VerticalLayout style={MyStyles.full}>
                <Text
                  style={[{ flex: 1 }, MyStyles.center, this.props.tab_index === 3 ? styles.active_title : styles.title, this.props.textStyle]}>
                  {this.props.titles[3]}
                </Text>
                <View style={this.props.tab_index === 3 ? styles.active_bar : styles.bar} />
              </VerticalLayout>
            </Button>
            <Button style={styles.tab_btn} onPress={() => {
              this.props.onClick(4);
            }}>
              <VerticalLayout style={MyStyles.full}>
                <Text
                  style={[{ flex: 1 }, MyStyles.center, this.props.tab_index === 4 ? styles.active_title : styles.title, this.props.textStyle]}>
                  {this.props.titles[4]}
                </Text>
                <View style={this.props.tab_index === 4 ? styles.active_bar : styles.bar} />
              </VerticalLayout>
            </Button>
          </HorizontalLayout>

        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main_area: {
    height: 40,
    marginHorizontal: 30,
    marginTop: 20,
  },

  tab_btn: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: Colors.tab_bar,
    textAlign: "center",
  },
  active_title: {
    color: Colors.primary,
    textAlign: "center",
  },
  bar: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.tab_bar,
  },
  active_bar: {
    width: "100%",
    height: 4,
    backgroundColor: Colors.primary,
  },

});
