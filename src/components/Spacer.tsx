import React from 'react';
import {DimensionValue, View} from 'react-native';

type SpacerProps = {
  width?: DimensionValue;
  height?: DimensionValue;
};

const Spacer: React.FC<SpacerProps> = ({width, height}) => {

  return <View style={{width: width, height: height}} />;
};

export default Spacer;
