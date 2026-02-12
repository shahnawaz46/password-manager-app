import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import Toast from 'react-native-toast-message';
import { Formik } from 'formik';
import * as Keychain from 'react-native-keychain';

// components
import { gap } from '@/utils/Spacing';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import { useAppTheme } from '@/routes/Router';
import Title from '@/components/Title';
import { useDataContext } from '@/context/DataContext';
import axiosInstance from '@/axios/AxiosInstance';
import { singinSchema } from '@/validation/YupValidationSchema';
import LoadingAfterUpdate from '@/components/LoadingAfterUpdate';
import { API_STATUS, LOGIN_PROCESS } from '@/utils/Constants';
import { NavigationState, useNavigation } from '@react-navigation/native';
import { useAuthContext } from '@/hooks/useAuthContext';

const Login = ({ navigation }) => {
  const {
    colors: { primary, textPrimary },
  } = useAppTheme();
  // const navigation = useNavigation();

  const { setAuthDetails } = useDataContext();
  const { userLogin } = useAuthContext();
  const [apiLoading, setApiLoading] = useState(API_STATUS.IDLE);

  const handleLogin = async value => {
    try {
      console.log('value:', value);
      setApiLoading(API_STATUS.LOADING);
      // const res = await axiosInstance.post('/user/login', value);
      // console.log('handleLogin: ', res.data);

      // // using Keychain instead of asyncLocalStorage because Keychain is secure
      // // and Keychain store username and password so here username will be id and password will be token
      // const { token, _id: id } = res.data;
      // await Keychain.setGenericPassword(id, token);
      // setAuthDetails(prev => ({ ...prev, isLoggedIn: LOGIN_PROCESS.START }));

      await userLogin(value);

      navigation.navigate('HomeScreen');
    } catch (err) {
      setApiLoading(API_STATUS.FAILED);
      Toast.show({
        type: 'error',
        text1: err?.response?.data?.error || err.message,
        topOffset: 25,
      });

      if (err?.response?.data?.error === 'User not verified, Please verify') {
        navigation.navigate('VerifyOtpScreen', { email: value.email });
      }
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps={'always'}
    >
      {/* for show loading screen after Login */}
      <LoadingAfterUpdate apiLoading={apiLoading} backgroundColor="#fff" />

      <SafeAreaView style={{ flex: 1 }}>
        <Title
          style={{
            fontSize: 28,
            fontWeight: '500',
            color: textPrimary,
            textAlign: 'center',
            marginTop: 30,
          }}
        />

        <View style={styles.formContainer}>
          <Text style={styles.formHeading}>Welcome!</Text>

          {/* form part */}
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={singinSchema}
            onSubmit={value => handleLogin(value)}
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <View style={{ gap: gap }}>
                <View>
                  <CustomInput
                    placeholder={'Email'}
                    backgroundColor={'#edeef1'}
                    icon={<Ionicons name="mail" size={22} color="#000" />}
                    value={values.email}
                    onChangeText={handleChange('email')}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.error}>{errors.email}</Text>
                  )}
                </View>

                <View>
                  <CustomInput
                    placeholder={'Password'}
                    backgroundColor={'#edeef1'}
                    icon={
                      <Ionicons name="lock-closed" size={22} color="#000" />
                    }
                    value={values.password}
                    onChangeText={handleChange('password')}
                    secureTextEntry={true}
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPasswordScreen')}
                >
                  <Text>Forgot Password?</Text>
                </TouchableOpacity>

                <CustomButton
                  title={'Login'}
                  height={45}
                  fontSize={21}
                  onPress={handleSubmit}
                />
              </View>
            )}
          </Formik>
        </View>

        {/* bottom part for redirect to Login */}
        <View style={styles.createNewAccount}>
          <Text style={{ fontSize: 15 }}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
            <Text
              style={{
                color: primary,
                fontWeight: '700',
                marginLeft: 5,
                fontSize: 15,
              }}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: gap,
  },
  formHeading: {
    fontSize: 25,
    fontWeight: '500',
    color: '#333',
    marginVertical: 15,
  },
  createNewAccount: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginTop: 0.5,
  },
});
