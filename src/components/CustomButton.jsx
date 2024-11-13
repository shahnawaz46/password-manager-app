import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

// components
import {useAppTheme} from '../routes/Router';

const CustomButton = ({
  title,
  selected = false,
  onPress,
  height = 30,
  paddingHorizontal = 15,
  borderRadius = 10,
  fontSize = 15,
  disabled = false,
}) => {
  const {
    colors: {primary},
  } = useAppTheme();
  return (
    <TouchableOpacity
      style={{
        backgroundColor: selected ? '#1db962' : primary,
        paddingHorizontal: paddingHorizontal,
        borderRadius: borderRadius,
        height,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      disabled={disabled}
      onPress={onPress}>
      <Text style={{fontSize, color: '#fff', opacity: disabled ? 0.6 : 1}}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
