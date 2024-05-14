import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

// components
import {useDataContext} from '../context/DataContext';
import {useAppTheme} from '../routes/Router';
import {gap} from '../utils/Spacing';
import ProfileItem from '../components/ProfileItem';

const Profile = ({navigation}) => {
  const {
    colors: {primary, textPrimary},
  } = useAppTheme();
  const {authDetails, setAuthDetails, logout} = useDataContext();

  const uploadImage = async () => {
    try {
      const result = await ImagePicker.openPicker({
        cropping: true,
      });
      setAuthDetails(prev => ({
        ...prev,
        userDetails: {...prev.userDetails, image: result.path},
      }));
    } catch (err) {
      if (err?.message === 'User did not grant camera permission.') {
        return Toast.show({
          type: 'error',
          text1: 'Please grant camera permission',
          topOffset: 25,
        });
      }
      Toast.show({
        type: 'error',
        text1: err?.response?.data?.error || err?.message,
        topOffset: 25,
      });
    }
  };

  return (
    <View style={{flex: 1, padding: gap}}>
      {/* top container with name and back icon */}
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.navigate('Home')}>
          <Ionicons name="chevron-back-outline" color={textPrimary} size={22} />
        </TouchableOpacity>

        <Text style={{color: textPrimary, fontSize: 23, textAlign: 'center'}}>
          Profile
        </Text>
      </View>

      {/* profile image/picture container */}
      <View style={styles.profileImageContainer}>
        <Image
          source={{
            uri:
              authDetails.userDetails?.image ||
              'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png',
          }}
          style={styles.profileImage}
        />
      </View>

      {/* user name and email */}
      <View style={styles.userDetails_Container}>
        <Text style={{color: textPrimary, fontSize: 23, fontWeight: 500}}>
          {authDetails.userDetails?.fullName}
        </Text>
        <Text style={{fontSize: 17}}>{authDetails.userDetails?.email}</Text>
      </View>

      {/* bottom container */}
      <View style={styles.bottomContainer}>
        <ProfileItem
          title={'My Account'}
          subTitle={'Changes to your account details'}
          icon={<Ionicons name="person-outline" size={20} color={primary} />}
          onPress={() => navigation.navigate('Personal Details')}
        />

        {/* <ProfileItem
          title={'Change Password'}
          subTitle={'Update your password for better security'}
          icon={
            <MaterialCommunityIcons
              name="lock-outline"
              size={20}
              color={primary}
            />
          }
          onPress={() => navigation.navigate('Forgot Password')}
        /> */}

        <ProfileItem
          title={'Log out'}
          subTitle={'Further secure your account for safety'}
          icon={
            <MaterialCommunityIcons name="logout" size={20} color={primary} />
          }
          onPress={logout}
        />
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap,
    marginTop: 10,
  },
  backIcon: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#edeef1',
    borderRadius: 30,
    padding: 2,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 30,
    position: 'relative',
  },
  profileImage: {
    width: 200,
    height: 200,
    objectFit: 'cover',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#edeef1',
  },
  userDetails_Container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  bottomContainer: {
    borderTopWidth: 2,
    borderColor: '#edeef1',
    paddingVertical: 20,
    marginTop: 30,
    gap: gap,
  },
});
