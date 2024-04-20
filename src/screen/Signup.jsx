import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// components
import {gap} from '../utils/Spacing';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {useAppTheme} from '../../App';
import Title from '../components/Title';

const Signup = ({navigation}) => {
  const {
    colors: {primary, textPrimary},
  } = useAppTheme();
  return (
    <SafeAreaView style={{flex: 1}}>
      <Title
        style={{
          fontSize: 28,
          fontWeight: '500',
          color: textPrimary,
          textAlign: 'center',
          marginTop: 40,
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
          />
          <CustomInput
            placeholder={'Email'}
            backgroundColor={'#edeef1'}
            icon={<Ionicons name="mail" size={22} color="#000" />}
          />
          <CustomInput
            placeholder={'Password'}
            type="visible-password"
            backgroundColor={'#edeef1'}
            icon={<Ionicons name="lock-closed" size={22} color="#000" />}
          />
          <CustomInput
            placeholder={'Confirm Password'}
            backgroundColor={'#edeef1'}
            icon={<Ionicons name="lock-closed" size={22} color="#000" />}
          />
          <CustomButton title={'Signup'} height={45} fontSize={22} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 50,
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
      </View>
    </SafeAreaView>
  );
};

export default Signup;
