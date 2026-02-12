import { StyleSheet, View } from 'react-native';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

// src
import PageWrapper from '@/components/wrapper/PageWrapper';
import DotLoading from '@/components/loader/DotLoading';
import { useAuthContext } from '@/hooks/useAuthContext';

const SplashScreen = () => {
  const { isAuthenticated } = useAuthContext();
  const navigation = useNavigation();

  useEffect(() => {
    // bydefault isAuthenticated will be null
    // and only be true or false after getSession
    if (isAuthenticated) {
      return navigation.navigate('HomeScreen');
    }
    if (isAuthenticated === false) {
      return navigation.navigate('LoginScreen');
    }
  }, [isAuthenticated]);

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
