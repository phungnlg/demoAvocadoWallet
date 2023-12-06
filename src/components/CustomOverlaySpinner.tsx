import React from 'react';
import {
  ActivityIndicator,
  ColorValue,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

interface ICustomOverlaySpinnerProps {
  visible?: boolean;
  color?: ColorValue;
  overlayColor?: ColorValue;
  text?: string;
  onPress?: () => any;
}

const CustomOverlaySpinner = (props: ICustomOverlaySpinnerProps) => {
  const {
    visible,
    color = '#333',
    overlayColor = '#eeeeee65',
    text,
  } = props;

  if (visible) {
    return (
      <View style={[styles.loadingWrapper, { backgroundColor: overlayColor }]}>
        <ActivityIndicator size={'large'} color={color} />
      </View>
    );
  }
  return <View />;
};

export default CustomOverlaySpinner;

const styles = StyleSheet.create({
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    elevation: Platform.OS === 'ios' ? 100 : 1,
    zIndex: 100,
  },
  backgroundOverlay: {
    flex: 1,
  },
});
