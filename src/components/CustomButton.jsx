import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

// components
import {useAppTheme} from '../../App';

const CustomButton = ({title, selected, onPress}) => {
  const {
    colors: {primary},
  } = useAppTheme();
  return (
    <TouchableOpacity
      style={{
        backgroundColor: selected ? '#1db962' : primary,
        paddingVertical: 3,
        paddingHorizontal: 15,
        borderRadius: 5,
      }}
      onPress={onPress}>
      <Text style={{fontSize: 15, color: '#fff'}}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
