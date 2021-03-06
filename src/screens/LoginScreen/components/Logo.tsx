import React, {memo} from 'react';
import styled from 'styled-components/native';
import DeviceInfo from 'react-native-device-info';
import {fScale, screenLongDimension} from '@/ultils/scale';
import {IC_LOGO} from '@/assets';

const size = DeviceInfo.isTablet()
  ? fScale(128)
  : screenLongDimension <= 120
  ? 108
  : 170;

const SImage = styled.Image`
  width: ${size}px;
  height: ${size}px;
`;

export const Logo = memo(() => {
  return <SImage resizeMode="contain" source={IC_LOGO} />;
});
