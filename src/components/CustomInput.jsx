import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  type = 'default',
  width = '100%',
}) => {
  return (
    <View style={{...styles.input, width}}>
      <TextInput
        placeholder={placeholder}
        style={{fontSize: 16, color: '#000', width: '93%'}}
        placeholderTextColor={'#aaafb5'}
        value={value}
        onChangeText={onChangeText}
        keyboardType={type}
      />
    </View>
  );
};

export default React.memo(CustomInput);

const styles = StyleSheet.create({
  input: {
    height: 45,
    borderWidth: 0.5,
    borderColor: '#42224a',
    borderRadius: 10,
    alignSelf: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
});
