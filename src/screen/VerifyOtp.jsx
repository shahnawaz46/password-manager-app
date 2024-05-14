import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Keychain from 'react-native-keychain';

// components
import {gap} from '../utils/Spacing';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {useAppTheme} from '../routes/Router';
import {useDataContext} from '../context/DataContext';
import axiosInstance from '../axios/AxiosInstance';

const VerifyOtp = ({navigation, route}) => {
  const {
    colors: {primary, textPrimary},
  } = useAppTheme();

  const {setAuthDetails} = useDataContext();

  const [otp, setOTP] = useState(null);

  const handleVerifyOTP = async () => {
    if (otp === '' || otp === null) {
      return Toast.show({
        type: 'error',
        text1: 'Please enter OTP',
        topOffset: 25,
      });
    }
    try {
      const res = await axiosInstance.post('/user/otp-verify', {
        otp,
        email: route?.params?.email,
      });
      if (route?.params?.type === 'signup') {
        const {token, _id: id, ...rest} = res.data;
        await Keychain.setGenericPassword(id, token);
        setAuthDetails(prev => ({
          ...prev,
          isLoggedIn: true,
          userDetails: {
            ...rest,
          },
        }));
      } else if (route?.params?.type === 'forgot-password') {
        navigation.navigate('Update Password', {email: res.data?.email});
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err?.response?.data?.error || err.message,
        topOffset: 25,
      });
    }
  };

  const resendOtp = async () => {
    try {
      const res = await axiosInstance.post('/user/resend-otp', {
        email: route?.params?.email,
        type: route?.params?.type,
      });
      Toast.show({type: 'success', text1: res.data.message});
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err?.response?.data?.error || err.message,
        topOffset: 25,
      });

      if (err?.response?.data?.step === 'redirect') {
        navigation.navigate('Signin');
      }
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
          Please Enter The Code Sent To
        </Text>
        <Text
          style={{
            fontSize: 17,
            color: '#333',
            textAlign: 'center',
          }}>
          {secureEmail(route?.params?.email || '')}
        </Text>
      </View>

      <View style={{flex: 1, justifyContent: 'center', gap: gap, padding: 20}}>
        <CustomInput
          placeholder={'Enter OTP'}
          backgroundColor={'#edeef1'}
          type="numeric"
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

        <View style={styles.resendCode}>
          <Text style={{fontSize: 16}}>Didn't get the code or expire? </Text>
          <TouchableOpacity onPress={resendOtp}>
            <Text style={{color: primary, fontWeight: '500', fontSize: 16}}>
              Click to resend
            </Text>
          </TouchableOpacity>
        </View>
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
  resendCode: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
