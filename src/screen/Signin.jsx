import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

// components
import {gap} from '../utils/Spacing';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {useAppTheme} from '../routes/Router';
import Title from '../components/Title';
import {formValidation} from '../utils/Validation';
import {useDataContext} from '../context/DataContext';

const Signin = ({navigation}) => {
  const {
    colors: {primary, textPrimary},
  } = useAppTheme();

  const {setAuthDetails} = useDataContext();

  const [userDetails, setUserDetails] = useState({email: '', password: ''});

  const handleSignin = async () => {
    const result = formValidation(userDetails);
    if (!result.status) {
      return Toast.show({type: 'error', text1: result.msg});
    }

    try {
      // const res = await
      const token = '123456789';
      await AsyncStorage.setItem('__ut_', token);
      setAuthDetails({
        isLoggedIn: true,
        token: token,
        userDetails: {
          fullName: 'Mohammad Shahnawaz',
          email: 'shahanwaz@gamil.com',
          image: '',
        },
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err.message,
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

      <View style={{flex: 1, justifyContent: 'center', padding: gap}}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: '500',
            color: '#333',
            marginVertical: 15,
          }}>
          Welcome!
        </Text>

        {/* form part */}
        <View style={{gap: gap}}>
          <CustomInput
            placeholder={'Email'}
            backgroundColor={'#edeef1'}
            icon={<Ionicons name="mail" size={22} color="#000" />}
            value={userDetails.email}
            onChangeText={e => setUserDetails(prev => ({...prev, email: e}))}
          />
          <CustomInput
            placeholder={'Password'}
            backgroundColor={'#edeef1'}
            icon={<Ionicons name="lock-closed" size={22} color="#000" />}
            value={userDetails.password}
            onChangeText={e => setUserDetails(prev => ({...prev, password: e}))}
          />

          {/* <TouchableOpacity>
            <Text>Forgot Password?</Text>
          </TouchableOpacity> */}

          <CustomButton
            title={'Login'}
            height={45}
            fontSize={21}
            onPress={handleSignin}
          />
        </View>
      </View>

      {/* bottom part for redirect to signin */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 20,
          marginTop: 10,
        }}>
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
  );
};

export default Signin;
