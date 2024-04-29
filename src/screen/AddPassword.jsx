import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import Toast from 'react-native-toast-message';

// for use nanoid in react native we have to install react-native-get-random-values
import 'react-native-get-random-values';
import {nanoid} from 'nanoid';

// components
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {gap} from '../utils/Spacing';
import DropDown from '../components/DropDown';

const AddPassword = () => {
  const [passwordDetails, setPasswordDetails] = useState({
    name: '',
    userName: '',
    password: '',
    tag: '',
  });

  // generating password with the help of nanoid
  const generatePassword = () => {
    const randomPassword = nanoid();
    setPasswordDetails(prev => ({...prev, password: randomPassword}));
  };

  const handlePassword = () => {
    if (
      passwordDetails.name === '' ||
      passwordDetails.userName ||
      passwordDetails.password ||
      passwordDetails.tag
    )
      return Toast.show({
        type: 'error',
        text1: 'Please Fill All The Fields',
        topOffset: 25,
      });
    console.log(passwordDetails);
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.formContainer}>
          <Text style={styles.formHeading}>Add New Password</Text>
          <View style={styles.form}>
            <CustomInput
              value={passwordDetails.name}
              placeholder={'Enter Website/App Name'}
              onChangeText={txt =>
                setPasswordDetails(prev => ({...prev, name: txt}))
              }
            />

            <CustomInput
              value={passwordDetails.userName}
              placeholder={'Enter Email/UserName'}
              onChangeText={txt =>
                setPasswordDetails(prev => ({...prev, userName: txt}))
              }
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <CustomInput
                value={passwordDetails.password}
                placeholder={'Enter/Generate Password'}
                onChangeText={txt =>
                  setPasswordDetails(prev => ({...prev, password: txt}))
                }
                width="70%"
              />
              <CustomButton
                title={'Generate'}
                height={44}
                fontSize={16}
                onPress={generatePassword}
              />
            </View>
            <DropDown
              value={''}
              onChangeText={tag =>
                setPasswordDetails(prev => ({...prev, tag: tag.name}))
              }
            />

            <CustomButton
              title={'ADD'}
              height={45}
              fontSize={18}
              onPress={handlePassword}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default AddPassword;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: gap + 6,
  },
  formHeading: {
    fontSize: 23,
    fontWeight: '600',
    color: '#000',
    marginTop: 40,
    marginBottom: 10,
  },
  form: {
    gap: 15,
    width: '100%',
  },
});
