import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Strings from '../../constants/Strings';

export function Loading() {
  const { container } = styles;
  return (
    <View style={container}>
      <Text>{Strings.please_wait}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Loading;