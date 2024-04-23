import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
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

const Signup = ({navigation}) => {
  const {
    colors: {primary, textPrimary},
  } = useAppTheme();

  const {setAuthDetails} = useDataContext();

  const [userDetails, setUserDetails] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [secureField, setSecureField] = useState(true);

  const handleSignup = async () => {
    const result = formValidation(userDetails);
    if (!result.status) {
      return Toast.show({type: 'error', text1: result.msg});
    }

    try {
      // const res = await
      setAuthDetails(prev => ({
        ...prev,
        userDetails: {
          fullName: 'Mohammad Shahnawaz',
          email: 'shahanwaz@gamil.com',
          image: '',
        },
      }));
      navigation.navigate('Verify OTP');
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
          Registration
        </Text>

        <View style={{gap: gap}}>
          <CustomInput
            placeholder={'Full Name'}
            backgroundColor={'#edeef1'}
            icon={<Ionicons name="person" size={22} color="#000" />}
            onChangeText={e =>
              setUserDetails(prev => ({...prev, full_name: e}))
            }
          />
          <CustomInput
            placeholder={'Email'}
            backgroundColor={'#edeef1'}
            icon={<Ionicons name="mail" size={22} color="#000" />}
            onChangeText={e => setUserDetails(prev => ({...prev, email: e}))}
          />
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
            onChangeText={e => setUserDetails(prev => ({...prev, password: e}))}
            secureTextEntry={secureField}
          />
          <CustomInput
            placeholder={'Confirm Password'}
            backgroundColor={'#edeef1'}
            icon={<Ionicons name="lock-closed" size={22} color="#000" />}
            onChangeText={e =>
              setUserDetails(prev => ({...prev, confirm_password: e}))
            }
            secureTextEntry={true}
          />
          <CustomButton
            title={'Signup'}
            height={45}
            fontSize={21}
            onPress={handleSignup}
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
