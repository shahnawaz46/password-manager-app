import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// components
import CustomButton from '../components/CustomButton';
import {useDataContext} from '../context/DataContext';
import Toast from 'react-native-toast-message';
import {useAppTheme} from '../routes/Router';
import {gap} from '../utils/Spacing';

const Profile = ({navigation}) => {
  const {
    colors: {textPrimary},
  } = useAppTheme();
  const {authDetails, setAuthDetails, logout} = useDataContext();
  console.log('Profile: ', authDetails.userDetails);

  const uploadImage = async () => {
    try {
      const result = await ImagePicker.openPicker({
        cropping: true,
      });
      console.log(result);
      setAuthDetails(prev => ({
        ...prev,
        userDetails: {...prev.userDetails, image: result.path},
      }));
    } catch (err) {
      if (err?.message === 'User did not grant camera permission.') {
        return Toast.show({
          type: 'error',
          text1: 'Please grant camera permission',
        });
      }
      console.log(err.message);
    }
  };

  const downloadAllPassword = () => {
    console.log('downloadAllPassword');
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
        <Ionicons
          name="camera"
          size={26}
          color={'#000'}
          style={{position: 'absolute', bottom: 8}}
          onPress={uploadImage}
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
        <TouchableOpacity
          style={styles.bottomIcon_Container}
          onPress={downloadAllPassword}>
          <MaterialCommunityIcons
            name="folder-download-outline"
            size={22}
            color={textPrimary}
          />
          <Text style={{fontSize: 17, color: textPrimary}}>
            Export All Password
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomIcon_Container}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={25}
            color={textPrimary}
          />
          <Text style={{fontSize: 17, color: textPrimary}}>
            Change Password
          </Text>
        </TouchableOpacity>

        <CustomButton
          title={'Logout'}
          onPress={logout}
          fontSize={20}
          height={42}
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
    marginTop: 20,
  },
  bottomContainer: {
    borderTopWidth: 2,
    borderColor: '#edeef1',
    paddingVertical: 20,
    marginTop: 30,
    gap: gap,
  },
  bottomIcon_Container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap,
  },
});
