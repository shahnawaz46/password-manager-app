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

// src
import { gap } from '@/utils/Spacing';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import { useAppTheme } from '@/hooks/useAppTheme';
import Title from '@/components/Title';
import { singinSchema } from '@/validation/YupValidationSchema';
import LoadingAfterUpdate from '@/components/LoadingAfterUpdate';
import { API_STATUS } from '@/utils/Constants';
import { useAuthContext } from '@/hooks/useAuthContext';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/auth.api';

const Login = ({ navigation }) => {
  const { updateSession } = useAuthContext();
  const {
    colors: { primary, textPrimary },
  } = useAppTheme();

  const [apiLoading, setApiLoading] = useState(API_STATUS.IDLE);

  const { mutateAsync: loginMutateAsync, isPending } = useMutation({
    mutationFn: login,
  });

  const handleLogin = async value => {
    try {
      setApiLoading(API_STATUS.LOADING);
      const res = await loginMutateAsync(value);
      updateSession(res);

      // navigation.navigate('HomeScreen');
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
