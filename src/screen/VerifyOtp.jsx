import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// components
import {gap} from '../utils/Spacing';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {useAppTheme} from '../routes/Router';
import {useDataContext} from '../context/DataContext';

const VerifyOtp = ({navigation}) => {
  const {
    colors: {primary, textPrimary},
  } = useAppTheme();

  const {authDetails, setAuthDetails} = useDataContext();

  const [otp, setOTP] = useState(null);

  const handleVerifyOTP = async () => {
    if (otp === '' || otp === null) {
      return Toast.show({type: 'error', text1: 'Please enter OTP'});
    }

    try {
      // const res = await
      const token = '123456789';
      await AsyncStorage.setItem('__ut_', token);
      setAuthDetails(prev => ({
        ...prev,
        isLoggedIn: true,
        token: token,
      }));
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err.message,
      });
    }
  };

  const secureEmail = email => {
    const [name, domain] = email.split('@');
    return `${name[0]}${new Array(name.length).join('*')}@${domain}`;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{alignItems: 'center', marginTop: 30}}>
        <TouchableOpacity
          style={{...styles.verifyOtpIcon, backgroundColor: primary}}
          onPress={() => navigation.navigate('Home')}>
          <MaterialIcons name="verified-user" color={'#fff'} size={50} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 24,
            color: textPrimary,
            marginTop: 5,
            fontWeight: 500,
          }}>
          OTP Verification
        </Text>
      </View>

      <View style={{alignItems: 'center', marginTop: 40}}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: '500',
            color: '#333',
            textAlign: 'center',
          }}>
          Please enter the code sent to
        </Text>
        <Text
          style={{
            fontSize: 17,
            color: '#333',
            textAlign: 'center',
          }}>
          {secureEmail(
            authDetails.userDetails?.email || 'shahnawaz9887@gmail.com',
          )}
        </Text>
      </View>

      <View style={{flex: 1, justifyContent: 'center', gap: gap, padding: 40}}>
        <CustomInput
          placeholder={'Enter OTP'}
          backgroundColor={'#edeef1'}
          value={otp}
          onChangeText={setOTP}
          maxLength={6}
        />

        <CustomButton
          title={'Verify'}
          height={45}
          fontSize={21}
          onPress={handleVerifyOTP}
        />
      </View>
    </SafeAreaView>
  );
};

export default VerifyOtp;

const styles = StyleSheet.create({
  verifyOtpIcon: {
    borderWidth: 2,
    borderColor: '#edeef1',
    borderRadius: 50,
    padding: 15,
  },
});
