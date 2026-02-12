import PageWrapper from '@/components/wrapper/PageWrapper';
import DotLoading from '@/components/loader/DotLoading';
import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import * as Keychain from 'react-native-keychain';
import { useDataContext } from '@/context/DataContext';
import { LOGIN_PROCESS } from '@/utils/Constants';
import axiosInstance from '@/axios/AxiosInstance';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const {
    authDetails: { isLoggedIn },
    setAuthDetails,
    setPasswordList,
    logout,
  } = useDataContext();

  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const getUserDetails = async () => {
    try {
      // logout();
      const isToken = await Keychain.getGenericPassword();

      if (!isToken) {
        return navigation.navigate('LoginScreen');
      }

      if (isToken?.password) {
        const [profileRes, countRes] = await Promise.all([
          axiosInstance.get('/user/profile'),
          axiosInstance.get('/count'),
        ]);

        setAuthDetails({
          isLoggedIn: LOGIN_PROCESS.COMPLETE,
          userDetails: profileRes.data,
        });

        setPasswordList(prev => ({
          ...prev,
          count: countRes.data,
        }));
      }

      navigation.navigate('HomeScreen');
    } catch (err) {
      console.log(err?.response?.data?.error || err?.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    // if isLoggedin value is 'COMPLETE' then it means i have already fetched the data so i am not calling getUserDetails() function again.
    isLoggedIn !== LOGIN_PROCESS.COMPLETE && getUserDetails();
  }, [isLoggedIn]);

  return (
    <PageWrapper>
      <View style={styles.container}>
        <DotLoading />
      </View>
    </PageWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
