import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import {Formik} from 'formik';
import * as Keychain from 'react-native-keychain';

// components
import {gap} from '../utils/Spacing';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {useAppTheme} from '../routes/Router';
import Title from '../components/Title';
import {useDataContext} from '../context/DataContext';
import axiosInstance from '../axios/AxiosInstance';
import {singinSchema} from '../validation/YupValidationSchema';

const Signin = ({navigation}) => {
  const {
    colors: {primary, textPrimary},
  } = useAppTheme();

  const {setAuthDetails} = useDataContext();

  const handleSignin = async value => {
    try {
      const res = await axiosInstance.post('/user/login', value);

      // using Keychain instead of asyncLocalStorage because Keychain is secure
      // and Keychain store username and password so here username will be id and password will be token
      const {token, _id: id, ...rest} = res.data;
      await Keychain.setGenericPassword(id, token);
      setAuthDetails(prev => ({
        ...prev,
        isLoggedIn: true,
        userDetails: {
          ...rest,
        },
      }));
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err?.response?.data?.error || err.message,
        topOffset: 25,
      });

      if (err?.response?.data?.error === 'User not verified, Please verify') {
        navigation.navigate('Verify OTP', {email: value.email});
      }
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps={'always'}>
      <SafeAreaView style={{flex: 1}}>
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
            initialValues={{email: '', password: ''}}
            validationSchema={singinSchema}
            onSubmit={value => handleSignin(value)}>
            {({values, errors, touched, handleChange, handleSubmit}) => (
              <View style={{gap: gap}}>
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
                  onPress={() => navigation.navigate('Forgot Password')}>
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

        {/* bottom part for redirect to signin */}
        <View style={styles.createNewAccount}>
          <Text style={{fontSize: 15}}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text
              style={{
                color: primary,
                fontWeight: '700',
                marginLeft: 5,
                fontSize: 15,
              }}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Signin;

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
