import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

const CustomInput = ({
  placeholder,
  value,
  icon,
  endIcon,
  onChangeText,
  onBlur,
  backgroundColor,
  type = 'default',
  secureTextEntry = false,
  width = '100%',
  maxLength = 20000,
}) => {
  const conditionalStyle = backgroundColor
    ? {backgroundColor: backgroundColor}
    : {borderColor: '#42224a', borderWidth: 0.5};
  return (
    <View style={{...styles.input, width, ...conditionalStyle}}>
      {icon && icon}
      <TextInput
        placeholder={placeholder}
        style={{fontSize: 16, color: '#000', width: endIcon ? '83%' : '93%'}}
        placeholderTextColor={'#aaafb5'}
        value={value}
        keyboardType={type}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        onBlur={onBlur}
      />
      {endIcon && endIcon}
    </View>
  );
};

export default React.memo(CustomInput);

const styles = StyleSheet.create({
  input: {
    height: 45,
    borderRadius: 10,
    alignSelf: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
});
