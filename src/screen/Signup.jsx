import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

// components
import {gap} from '../utils/Spacing';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {useAppTheme} from '../routes/Router';
import Title from '../components/Title';
import {useDataContext} from '../context/DataContext';
import {formValidation} from '../utils/Validation';
import axiosInstance from '../api/AxiosInstance';
import {Formik} from 'formik';
import {singupSchema} from '../validation/YupValidationSchema';

const Signup = ({navigation}) => {
  const {
    colors: {primary, textPrimary},
  } = useAppTheme();

  const {setAuthDetails} = useDataContext();

  const [userDetails, setUserDetails] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [secureField, setSecureField] = useState(true);

  const handleSignup = async value => {
    try {
      await axiosInstance.post('/user/register', value);
      navigation.navigate('Verify OTP', {email: value.email});
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err?.response?.data?.error || err.message,
      });
    }
  };

  return (
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
        <Text style={styles.formHeading}>Registration</Text>

        <Formik
          initialValues={{
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={singupSchema}
          onSubmit={value => handleSignup(value)}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            isSubmitting,
          }) => (
            <View style={{gap: gap}}>
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
                  icon={<Ionicons name="lock-closed" size={22} color="#000" />}
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
                  icon={<Ionicons name="lock-closed" size={22} color="#000" />}
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

      {/* bottom part for redirect to signin */}
      <View style={styles.alreadyAccount}>
        <Text style={{fontSize: 15}}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
          <Text
            style={{
              color: primary,
              fontWeight: '700',
              marginLeft: 2,
              fontSize: 15,
            }}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  formContainer: {flex: 1, justifyContent: 'center', padding: gap},
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
