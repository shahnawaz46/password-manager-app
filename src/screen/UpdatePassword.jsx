import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Formik} from 'formik';

// components
import {gap} from '../utils/Spacing';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {useAppTheme} from '../routes/Router';
import axiosInstance from '../api/AxiosInstance';
import {forgotPasswordSchema} from '../validation/YupValidationSchema';

const UpdatePassword = ({navigation, route}) => {
  const {
    colors: {primary, textPrimary},
  } = useAppTheme();

  // for show/hide password by click on icon
  const [secureField, setSecureField] = useState(true);

  const handleUpdatePassword = async values => {
    try {
      const res = await axiosInstance.post('/user/update-password', {
        ...values,
        email: route?.params?.email,
      });
      Toast.show({type: 'success', text1: res.data.message});

      setTimeout(() => {
        navigation.navigate('Signin');
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
          <Ionicons name="lock-closed" size={50} color="#fff" />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 24,
            color: textPrimary,
            marginTop: 5,
            fontWeight: 500,
          }}>
          Update Password
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
          Set the new password for your account so you can login and access all
          the features
        </Text>
      </View>

      <View style={{flex: 1, justifyContent: 'center', gap: gap, padding: 20}}>
        <Formik
          initialValues={{password: '', confirmPassword: ''}}
          validationSchema={forgotPasswordSchema}
          onSubmit={(values, {resetForm}) => {
            handleUpdatePassword(values);
            // resetForm();
          }}>
          {({
            values,
            touched,
            errors,
            handleChange,
            handleSubmit,
            handleReset,
          }) => (
            <View style={{gap: gap}}>
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
                title={'Reset Password'}
                height={45}
                fontSize={21}
                onPress={handleSubmit}
              />
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default UpdatePassword;

const styles = StyleSheet.create({
  verifyOtpIcon: {
    borderWidth: 2,
    borderColor: '#edeef1',
    borderRadius: 50,
    padding: 15,
  },
  error: {
    color: 'red',
    marginTop: 0.5,
  },
});
