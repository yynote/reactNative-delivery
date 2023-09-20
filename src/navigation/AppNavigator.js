import {createAppContainer} from 'react-navigation';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import {Transition} from 'react-native-reanimated';
import AuthStackNavigator from './AuthStackNavigator';
import React from "react";


export default createAppContainer(createAnimatedSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Auth: AuthStackNavigator,
},
{
  transition: (
    <Transition.Together>
      <Transition.Out
        type="slide-left"
        durationMs={250}
        interpolation="linear"
      />
      <Transition.In 
        type="slide-right" 
        durationMs={250} 
        interpolation="linear"
      />
    </Transition.Together>
  ),
}));