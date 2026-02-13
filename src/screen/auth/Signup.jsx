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

// components
import { gap } from '@/utils/Spacing';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import { useAppTheme } from '@/hooks/useAppTheme';
import Title from '@/components/Title';
import axiosInstance from '@/api/axiosInstance';
import { singupSchema } from '@/validation/YupValidationSchema';
import LoadingAfterUpdate from '@/components/LoadingAfterUpdate';
import { API_STATUS } from '@/utils/Constants';

const Signup = ({ navigation }) => {
  const {
    colors: { primary, textPrimary },
  } = useAppTheme();

  // for show/hide password by click on icon
  const [secureField, setSecureField] = useState(true);
  const [apiLoading, setApiLoading] = useState(API_STATUS.IDLE);

  const handleSignup = async value => {
    try {
      setApiLoading(API_STATUS.LOADING);
      await axiosInstance.post('/user/register', value);
      navigation.navigate('VerifyOtpScreen', {
        email: value.email,
        type: 'signup',
      });
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
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps={'always'}
    >
      {/* for show loading screen after Signup */}
      <LoadingAfterUpdate apiLoading={apiLoading} />

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
          <Text style={styles.formHeading}>Registration</Text>

          <Formik
            initialValues={{
              fullName: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={singupSchema}
            onSubmit={value => handleSignup(value)}
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <View style={{ gap: gap }}>
                <View>
                  <CustomInput
                    placeholder={'Full Name'}
                    backgroundColor={'#edeef1'}
                    icon={<Ionicons name="person" size={22} color="#000" />}
                    value={values.fullName}
                    onChangeText={handleChange('fullName')}
                  />
                  {touched.fullName && errors.fullName && (
                    <Text style={styles.error}>{errors.fullName}</Text>
                  )}
                </View>
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
                    endIcon={
                      <Ionicons
                        name={secureField ? 'eye-off' : 'eye'}
                        size={22}
                        color="#000"
                        onPress={() => setSecureField(prev => !prev)}
                      />
                    }
                    value={values.password}
                    onChangeText={handleChange('password')}
                    secureTextEntry={secureField}
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                  )}
                </View>

                <View>
                  <CustomInput
                    placeholder={'Confirm Password'}
                    backgroundColor={'#edeef1'}
                    icon={
                      <Ionicons name="lock-closed" size={22} color="#000" />
                    }
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    secureTextEntry={true}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.error}>{errors.confirmPassword}</Text>
                  )}
                </View>
                <CustomButton
                  title={'Signup'}
                  height={45}
                  fontSize={21}
                  onPress={handleSubmit}
                />
              </View>
            )}
          </Formik>
        </View>

        {/* bottom part for redirect to Login */}
        <View style={styles.alreadyAccount}>
          <Text style={{ fontSize: 15 }}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text
              style={{
                color: primary,
                fontWeight: '700',
                marginLeft: 2,
                fontSize: 15,
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Signup;

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
  alreadyAccount: {
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
