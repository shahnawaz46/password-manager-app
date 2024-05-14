import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

const CustomInput2 = ({
  placeholder,
  value,
  onChangeText,
  maxLength = 200000,
  keyboardType = 'default',
}) => {
  return (
    <TextInput
      placeholder={placeholder}
      maxLength={maxLength}
      keyboardType={keyboardType}
      style={styles.inputStyle}
      placeholderTextColor={'#aaafb5'}
      value={value}
      onChangeText={onChangeText}
    />
  );
};

export default CustomInput2;

const styles = StyleSheet.create({
  inputStyle: {
    borderBottomWidth: 1.5,
    borderColor: '#edeef1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
  },
});
