import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

// components
import { gap } from '@/utils/Spacing';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import { useAppTheme } from '@/hooks/useAppTheme';
import LoadingAfterUpdate from '@/components/LoadingAfterUpdate';
import { API_STATUS } from '@/utils/Constants';
import { useMutation } from '@tanstack/react-query';
import { resentOTP } from '@/api/auth.api';

const ForgotPassword = ({ navigation }) => {
  const {
    colors: { primary, textPrimary },
  } = useAppTheme();
  const [email, setEmail] = useState(null);
  const [apiLoading, setApiLoading] = useState(API_STATUS.IDLE);

  const { mutateAsync: resentOTPMutateAsync } = useMutation({
    mutationFn: resentOTP,
  });

  const handleVerifyEmail = async () => {
    if (email === '' || email === null) {
      return Toast.show({
        type: 'error',
        text1: 'Please enter your registered email',
        topOffset: 25,
      });
    }

    try {
      setApiLoading(API_STATUS.LOADING);
      const res = await resentOTPMutateAsync({
        email,
        type: 'forgot-password',
      });

      Toast.show({ type: 'success', text1: res.message });
      setApiLoading(API_STATUS.SUCCESS);
      setTimeout(() => {
        navigation.navigate('VerifyOtpScreen', {
          email,
          type: 'forgot-password',
        });
      }, 500);
    } catch (err) {
      setApiLoading(API_STATUS.FAILED);
      Toast.show({
        type: 'error',
        text1: err?.response?.data?.error || err.message,
        topOffset: 25,
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* for show loading screen after submit email */}
      <LoadingAfterUpdate apiLoading={apiLoading} />

      <View style={{ alignItems: 'center', marginTop: 30 }}>
        <TouchableOpacity
          style={{ ...styles.verifyOtpIcon, backgroundColor: primary }}
          onPress={() => navigation.navigate('HomeScreen')}
        >
          <MaterialDesignIcons name="verified-user" color={'#fff'} size={50} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 24,
            color: textPrimary,
            marginTop: 5,
            fontWeight: 500,
          }}
        >
          Verification
        </Text>
      </View>

      <View
        style={{ alignItems: 'center', marginTop: 40, marginHorizontal: 20 }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: '500',
            color: '#333',
            textAlign: 'center',
          }}
        >
          Please Enter Your Registered Email Address To Receive a Verification
          Code
        </Text>
      </View>

      <View
        style={{ flex: 1, justifyContent: 'center', gap: gap, padding: 20 }}
      >
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
