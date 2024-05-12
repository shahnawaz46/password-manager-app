import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// components
import {gap} from '../utils/Spacing';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {useAppTheme} from '../routes/Router';
import axiosInstance from '../api/AxiosInstance';

const ForgotPassword = ({navigation}) => {
  const {
    colors: {primary, textPrimary},
  } = useAppTheme();

  const [email, setEmail] = useState(null);

  const handleVerifyEmail = async () => {
    if (email === '' || email === null) {
      return Toast.show({
        type: 'error',
        text1: 'Please enter your registered email',
        topOffset: 25,
      });
    }

    try {
      const res = await axiosInstance.post('/user/resend-otp', {
        email,
        type: 'forgot-password',
      });
      Toast.show({type: 'success', text1: res.data.message});
      setTimeout(() => {
        navigation.navigate('Verify OTP', {email, type: 'forgot-password'});
      }, 500);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err?.response?.data?.error || err.message,
        topOffset: 25,
      });
    }
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
          Verification
        </Text>
      </View>

      <View style={{alignItems: 'center', marginTop: 40, marginHorizontal: 20}}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: '500',
            color: '#333',
            textAlign: 'center',
          }}>
          Please Enter Your Registered Email Address To Receive a Verification
          Code
        </Text>
      </View>

      <View style={{flex: 1, justifyContent: 'center', gap: gap, padding: 20}}>
        <CustomInput
          placeholder={'Enter Your Registered Email'}
          backgroundColor={'#edeef1'}
          value={email}
          onChangeText={setEmail}
        />

        <CustomButton
          title={'Send'}
          height={45}
          fontSize={21}
          onPress={handleVerifyEmail}
        />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  verifyOtpIcon: {
    borderWidth: 2,
    borderColor: '#edeef1',
    borderRadius: 50,
    padding: 15,
  },
});
