import React from 'react';
import {StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

const tags = [
  {id: '1', name: 'Browser'},
  {id: '2', name: 'App'},
];

const DropDown = ({value, onChangeText}) => {
  return (
    <Dropdown
      style={styles.dropDown}
      placeholderStyle={{color: '#aaafb5'}}
      selectedTextStyle={{color: '#000'}}
      placeholder="Select Category"
      data={tags}
      labelField={'name'}
      valueField={'name'}
      maxHeight={200}
      value={value}
      onChange={onChangeText}
    />
  );
};

export default React.memo(DropDown);

const styles = StyleSheet.create({
  dropDown: {
    width: '100%',
    height: 45,
    borderWidth: 0.5,
    borderColor: '#42224a',
    borderRadius: 10,
    alignSelf: 'center',
    paddingHorizontal: 14,
    fontSize: 16,
  },
});
