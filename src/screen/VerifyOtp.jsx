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
import LoadingAfterUpdate from '../components/LoadingAfterUpdate';
import {API_STATUS, LOGIN_PROCESS} from '../utils/Constants';

const VerifyOtp = ({navigation, route}) => {
  const {
    colors: {primary, textPrimary},
  } = useAppTheme();

  const {setAuthDetails} = useDataContext();

  const [otp, setOTP] = useState(null);
  const [apiLoading, setApiLoading] = useState(API_STATUS.IDLE);

  const handleVerifyOTP = async () => {
    if (otp === '' || otp === null) {
      return Toast.show({
        type: 'error',
        text1: 'Please enter OTP',
        topOffset: 25,
      });
    }
    try {
      setApiLoading(API_STATUS.LOADING);
      const res = await axiosInstance.post('/user/otp-verify', {
        otp,
        email: route?.params?.email,
      });
      if (route?.params?.type === 'signup') {
        const {token, _id: id} = res.data;
        await Keychain.setGenericPassword(id, token);
        setAuthDetails(prev => ({...prev, isLoggedIn: LOGIN_PROCESS.START}));
      } else if (route?.params?.type === 'forgot-password') {
        navigation.navigate('Update Password', {email: res.data?.email});
      }
    } catch (err) {
      setApiLoading(API_STATUS.FAILED);
      Toast.show({
        type: 'error',
        text1: err?.response?.data?.error || err.message,
        topOffset: 25,
      });
    }
  };

  const resendOtp = async () => {
    try {
      setApiLoading(API_STATUS.LOADING);
      const res = await axiosInstance.post('/user/resend-otp', {
        email: route?.params?.email,
        type: route?.params?.type,
      });
      Toast.show({type: 'success', text1: res.data.message});
      setApiLoading(API_STATUS.SUCCESS);
    } catch (err) {
      setApiLoading(API_STATUS.FAILED);
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
      {/* for show loading screen after verifyotp/resend otp */}
      <LoadingAfterUpdate apiLoading={apiLoading} />

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
