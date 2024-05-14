import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import {Dropdown} from 'react-native-element-dropdown';
import {Formik} from 'formik';

// components
import {useDataContext} from '../context/DataContext';
import {useAppTheme} from '../routes/Router';
import {gap} from '../utils/Spacing';
import CustomInput2 from '../components/CustomInput2';
import CustomButton from '../components/CustomButton';
import axiosInstance from '../axios/AxiosInstance';
import {accountUpdateSchema} from '../validation/YupValidationSchema';

const data = [
  {label: 'Male', value: 'Male'},
  {label: 'Female', value: 'Female'},
  {label: 'Others', value: 'Others'},
];

const AccountDetails = ({navigation}) => {
  const {
    colors: {textPrimary},
  } = useAppTheme();

  const {authDetails, setAuthDetails} = useDataContext();

  const [accountDetails, setAccountDetails] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  const uploadImage = async () => {
    try {
      const result = await ImagePicker.openPicker({
        cropping: true,
      });
      setProfileImage(result.path);
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
        text1: err?.message,
        topOffset: 25,
      });
    }
  };

  const handleUpdateProfile = async values => {
    const updatedValues = {};
    // here i am checking which value is edited/changed because i am using patch so i will pass only the updated value
    Object.entries(values).forEach(([key, value]) => {
      if (accountDetails[key] !== value) {
        updatedValues[key] = value;
      }
    });

    // if (accountDetails.image !== profileImage) {
    //   updatedValues['image'] = profileImage;
    // }

    if (Object.keys(updatedValues).length === 0) return null;

    try {
      const res = await axiosInstance.patch(
        '/user/update-profile',
        updatedValues,
      );
      setAuthDetails({isLoggedIn: true, userDetails: res.data});
      Toast.show({
        type: 'success',
        text1: 'Account Updated Successfully',
        topOffset: 25,
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err?.response?.data?.error || err?.message,
        topOffset: 25,
      });
    }
  };

  useEffect(() => {
    setAccountDetails({...authDetails.userDetails});
  }, [authDetails]);

  return (
    <View style={{flex: 1, padding: gap}}>
      {/* top container with name and back icon */}
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="chevron-back-outline" color={textPrimary} size={22} />
        </TouchableOpacity>

        <Text style={{color: textPrimary, fontSize: 23, textAlign: 'center'}}>
          Account Details
        </Text>
      </View>

      {/* profile image/picture container */}
      <View style={styles.profileImageContainer}>
        <Image
          source={{
            uri:
              profileImage ||
              accountDetails?.image ||
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

      <Formik
        initialValues={accountDetails}
        enableReinitialize
        validationSchema={accountUpdateSchema}
        onSubmit={values => handleUpdateProfile(values)}>
        {({
          values,
          touched,
          errors,
          handleChange,
          setFieldValue,
          handleSubmit,
        }) => (
          <View style={styles.bottomContainer}>
            <View>
              <CustomInput2
                placeholder={'Your Full Name'}
                value={values.fullName}
                onChangeText={handleChange('fullName')}
              />
              {touched.fullName && errors.fullName && (
                <Text style={styles.error}>{errors.fullName}</Text>
              )}
            </View>

            <View>
              <CustomInput2
                placeholder={'Phone Number'}
                maxLength={10}
                value={values.phoneNo}
                keyboardType={'phone-pad'}
                onChangeText={handleChange('phoneNo')}
              />
              {touched.phoneNo && errors.phoneNo && (
                <Text style={styles.error}>{errors.phoneNo}</Text>
              )}
            </View>

            <View>
              <Dropdown
                data={data}
                style={{
                  borderBottomWidth: 1.5,
                  borderColor: '#edeef1',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  fontSize: 16,
                }}
                placeholderStyle={{
                  fontSize: 16,
                  color: '#aaafb5',
                }}
                selectedTextStyle={{color: '#000'}}
                labelField={'label'}
                valueField={'value'}
                placeholder="Select Gender"
                value={values.gender}
                onChange={item => {
                  setFieldValue('gender', item.value);
                }}
              />
              {touched.gender && errors.gender && (
                <Text style={styles.error}>{errors.gender}</Text>
              )}
            </View>

            <CustomButton
              title={'Update'}
              fontSize={20}
              height={45}
              onPress={handleSubmit}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

export default AccountDetails;

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
  bottomContainer: {
    paddingVertical: 20,
    marginTop: 30,
    gap: gap + 10,
  },
  error: {
    color: 'red',
    marginTop: 0.5,
  },
});
