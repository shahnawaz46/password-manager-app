import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

// components
import {useAppTheme} from '../../App';

const CustomButton = ({
  title,
  selected = false,
  onPress,
  height = 30,
  fontSize = 15,
}) => {
  const {
    colors: {primary},
  } = useAppTheme();
  return (
    <TouchableOpacity
      style={{
        backgroundColor: selected ? '#1db962' : primary,
        paddingHorizontal: 15,
        borderRadius: 5,
        height,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={onPress}>
      <Text style={{fontSize, color: '#fff'}}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
