import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

// components
import { useAppTheme } from '@/hooks/useAppTheme';
import { gap } from '@/utils/Spacing';
import ProfileItem from '@/components/ProfileItem';
import { useAuthContext } from '@/hooks/useAuthContext';

const Profile = ({ navigation }) => {
  const {
    colors: { primary, textPrimary },
  } = useAppTheme();
  const { user, logout } = useAuthContext();

  return (
    <View style={{ flex: 1, padding: gap }}>
      {/* top container with name and back icon */}
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.navigate('HomeScreen')}
        >
          <Ionicons name="chevron-back-outline" color={textPrimary} size={22} />
        </TouchableOpacity>

        <Text style={{ color: textPrimary, fontSize: 23, textAlign: 'center' }}>
          Profile
        </Text>
      </View>

      {/* profile image/picture container */}
      <View style={styles.profileImageContainer}>
        <Image
          source={{
            uri:
              user?.profileImage ||
              'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png',
          }}
          style={styles.profileImage}
        />
      </View>

      {/* user name and email */}
      <View style={styles.userDetails_Container}>
        <Text style={{ color: textPrimary, fontSize: 23, fontWeight: 500 }}>
          {user?.fullName}
        </Text>
        <Text style={{ fontSize: 17 }}>{user?.email}</Text>
      </View>

      {/* bottom container */}
      <View style={styles.bottomContainer}>
        <ProfileItem
          title={'My Account'}
          subTitle={'Changes to your account details'}
          icon={<Ionicons name="person-outline" size={20} color={primary} />}
          onPress={() => navigation.navigate('AccountDetails')}
        />

        {/* <ProfileItem
          title={'Add Fingerprint'}
          subTitle={'Add Finger print for make it more secure'}
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
          icon={<MaterialDesignIcons name="logout" size={20} color={primary} />}
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
