/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { firebase } from '@react-native-firebase/messaging';
import { observer } from 'mobx-react';
import React from 'react';
import { ActivityIndicator, Alert, LogBox, Platform, Text, View } from "react-native";
import DeviceInfo from 'react-native-device-info';
import { setJSExceptionHandler, setNativeExceptionHandler } from "react-native-exception-handler";
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';
import { Button } from './src/components/controls/Button';
import C, { IS_DEV_MODE } from './src/constants/AppConstants';
import Strings from './src/constants/Strings';
import GlobalState from './src/mobx/GlobalState';
import AppNavigator from './src/navigation/AppNavigator';
import Geolocation from '@react-native-community/geolocation';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import EventBus from 'react-native-event-bus';


const reporter = error => {
  // Logic for reporting to devs
  // Example : Log issues to github issues using github apis.
  console.log(error); // sample
};

const errorHandler = (e, isFatal) => {
  if (isFatal) {
    reporter(e);
    Alert.alert(
      Strings.app_error_title,
      `
        Error: ${isFatal ? "Fatal:" : ""} ${e.name} ${e.message}

        ${Strings.app_error_msg}
        `,
      [
        {
          text: Strings.ok,
          onPress: () => {
          }
        }
      ]
    );
  } else {
    console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};

setJSExceptionHandler(errorHandler);

setNativeExceptionHandler((errorString) => {
  //You can do something like call an api to report to dev team here
  // When you call setNativeExceptionHandler, react-native-exception-handler sets a
  // Native Exception Handler popup which supports restart on error in case of android.
  // In case of iOS, it is not possible to restart the app programmatically, so we just show an error popup and close the app.
  // To customize the popup screen take a look at CUSTOMIZATION section.
});


@observer
class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loadedMetaData: false,
      introTimeOver: false,
    }
    LogBox.ignoreAllLogs(true)
  }

  componentDidMount() {
    if (!GlobalState.applicationCreated) {
      GlobalState.applicationCreated = true;

      if (!C.IS_OFFLINE_MODE) {
        // firebase
        this.checkPermission();
        this.createNotificationListeners();

        // GPS
        Geolocation.getCurrentPosition(info => {
          console.log(info)
          GlobalState.myLatitude = info.coords.latitude;
          GlobalState.myLongitude = info.coords.longitude;
          this.getCurrentAddress();
        }, error => {
          console.log(error)
        });

        // DynmicLinks
        this.unsubscribeLinking = dynamicLinks().onLink((link) => { // When app is in the foreground
          this.handleDynamicLink(link)
        })
        dynamicLinks()
          .getInitialLink()
          .then(link => { // When app is in a background
            this.handleDynamicLink(link)
          });
      }
    }
  }

  componentWillUnmount() {
    if (!C.IS_OFFLINE_MODE) {
      if (this.unsubscribeMessaging) {
        this.unsubscribeMessaging()
      }
    }
  }

  getCurrentAddress = () => {
    fetch('https://dapi.kakao.com/v2/local/geo/coord2address.json?y=' + GlobalState.myLatitude + '&x=' + GlobalState.myLongitude, {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'KakaoAK ' + C.KAKAO_REST_API_KEY
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      const data = responseJson.documents[0];
      var address = '';
      if (data.road_address != null) {
        address = data.road_address.address_name;
      } else if (data.address != null) {
        address = data.address.address_name;
      }
      GlobalState.myAddress = address
    })
  }

  handleDynamicLink = (link) => {
    try {
      var url = decodeURIComponent(link.url);
      var queryParams = url.split("?")[1]
      var paramList = queryParams.split("&")
      var designerId = "";
      if (paramList.find(it => it.includes(C.SHARE_LINK_PARAMS.DESIGNER_ID) != undefined)) {
        designerId = paramList.find(it => it.includes(C.SHARE_LINK_PARAMS.DESIGNER_ID)).split("=")[1]
      }
      if (designerId != "") {
        setTimeout(() => {
          EventBus.getInstance().fireEvent(C.EVENT_PARAMS.GO_DESIGNER_DETAIL, { designerId: designerId })
        }, 0.5);
      }
    } catch (error) {
      console.log(error)
    }
  }

  async getToken() {
    GlobalState.dev_token = await firebase.messaging().getToken();
    GlobalState.dev_type = Platform.OS;
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled > 0) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      console.log('permission rejected');
    }
  }

  async createNotificationListeners() {

    this.unsubscribeMessaging = firebase.messaging().onMessage(message => {
      console.log('FCM Message Data:', message.data);
      if (GlobalState.unread_count.activity_count > 0) {
      } else {
        GlobalState.unread_count.activity_count = 1
      }
      const type = Number(message.data.type);
      if (type === 0) { 

      } else if (type == 1) { 

      } else if (type === 3) { 

      }
    });
  }

  render() {
    return (
      <RootSiblingParent>
        <View style={{ width: "100%", height: "100%" }}>
          <AppNavigator />
          {GlobalState.isLoading ?
            <View style={{ position: "absolute", width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "transparent" }}>
              <ActivityIndicator style={{ backgroundColor: "transparent" }} size="large" color="#0000ff" />
            </View>
            : null}
          {IS_DEV_MODE &&
            <Button style={{ position: "absolute", top: 20, right: 10, }} onPress={() => {
              Toast.show("Version: " + DeviceInfo.getVersion() + " VersionCode: " + DeviceInfo.getBuildNumber())
            }}>
              <View style={{ backgroundColor: "red", opacity: 0.5, borderRadius: 10, paddingHorizontal: 3 }}>
                <Text style={{ color: "white" }}>DEV</Text>
              </View>
            </Button>
          }
        </View>
      </RootSiblingParent>
    )
  }
}

export default App;
