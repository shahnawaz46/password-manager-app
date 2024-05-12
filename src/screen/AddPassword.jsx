import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {Formik} from 'formik';

// for use nanoid in react native we have to install react-native-get-random-values
import 'react-native-get-random-values';
import {nanoid} from 'nanoid';

// components
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {gap} from '../utils/Spacing';
import DropDown from '../components/DropDown';
import {vaultSchema} from '../validation/YupValidationSchema';
import axiosInstance from '../api/AxiosInstance';
import {useDataContext} from '../context/DataContext';
import {encrypt} from '../utils/EncDec';

const AddPassword = ({route}) => {
  const {passwordList, setPasswordList} = useDataContext();
  const [initialState, setInitialState] = useState({
    name: '',
    userName: '',
    password: '',
    category: '',
  });
  const idRef = useRef(null);

  const handlePassword = async values => {
    // encrypting userName and password of vault
    const encrypted = await encrypt({
      userName: values.userName,
      password: values.password,
    });

    const newvalues = {
      data: encrypted,
      name: values.name,
      category: values.category,
    };

    try {
      const res = await axiosInstance.post('/password', newvalues);
      const category = res.data.category.toLowerCase();

      // after password added to the database then updating the state
      setPasswordList(prev => ({
        ...prev,
        all: {...prev.all, data: [res.data, ...prev.all.data]},
        [category]: {
          ...prev[category],
          data: [res.data, ...prev[category].data],
        },
        count: {
          ...prev.count,
          all: (prev.count.all += 1),
          [category]: (prev.count[category] += 1),
        },
      }));
      Toast.show({type: 'success', text1: 'Successfully Added', topOffset: 25});
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err?.response?.data?.error || err?.message,
        topOffset: 25,
      });
    }
  };

  const handlePasswordEdit = async values => {
    const updatedValues = {};
    // here i am checking which value is edited/changed because i am using patch so i will pass only the updated value
    Object.entries(values).forEach(([key, value]) => {
      if (initialState[key] !== value) {
        updatedValues[key] = value;
      }
    });

    if (Object.keys(updatedValues).length === 0) return null;

    //  here after editing any field I am encrypting the username and password again
    const encrypted = await encrypt({
      userName: values.userName,
      password: values.password,
    });

    // if userName or password is edited then i am removing it from the object because i am not passing plain userName or password
    updatedValues?.userName && delete updatedValues.userName;
    updatedValues?.password && delete updatedValues.password;

    const newvalues = {
      data: encrypted,
      ...updatedValues,
    };

    try {
      const res = await axiosInstance.patch('/password', {
        _id: idRef.current,
        ...newvalues,
      });

      const oldCategory = initialState.category.toLowerCase();
      const updatedCategory = res.data.category.toLowerCase();

      // after password updated in database then updating the state
      const all = {
        ...passwordList.all,
        data: passwordList.all.data.map(item =>
          item._id === idRef.current ? res.data : item,
        ),
      };

      // if category is also updated then i have to remove edited data from old category and add into new category same for count
      let updated = {};
      if (updatedValues?.category) {
        updated = {
          [oldCategory]: {
            ...passwordList[oldCategory],
            data: passwordList[oldCategory].data.filter(
              item => item._id !== idRef.current,
            ),
          },
          [updatedCategory]: {
            ...passwordList[updatedCategory],
            data: [res.data, ...passwordList[updatedCategory].data],
          },
          count: {
            ...passwordList.count,
            [oldCategory]: (passwordList.count[oldCategory] -= 1),
            [updatedCategory]: (passwordList.count[updatedCategory] += 1),
          },
        };
      } else {
        updated = {
          [oldCategory]: {
            ...passwordList[oldCategory],
            data: passwordList[oldCategory].data.map(item =>
              item._id === idRef.current ? res.data : item,
            ),
          },
        };
      }

      setPasswordList(prev => ({...prev, all, ...updated}));

      Toast.show({
        type: 'success',
        text1: 'Successfully Updated',
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
    if (route?.params) {
      const {_id, ...rest} = route.params;
      idRef.current = _id;
      setInitialState(rest);
    }
  }, [route]);

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps={'always'}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.formContainer}>
          <Text style={styles.formHeading}>Add New Password</Text>

          <Formik
            initialValues={initialState}
            enableReinitialize
            validationSchema={vaultSchema}
            onSubmit={(values, {resetForm}) => {
              if (idRef.current) {
                handlePasswordEdit(values);
                setInitialState({
                  name: '',
                  password: '',
                  userName: '',
                  category: '',
                });
              } else {
                handlePassword(values);
              }
              resetForm(initialState);
            }}>
            {({
              values,
              errors,
              touched,
              handleChange,
              setFieldValue,
              handleSubmit,
            }) => (
              <View style={styles.form}>
                <View>
                  <CustomInput
                    value={values.name}
                    placeholder={'Enter Website/App Name'}
                    onChangeText={handleChange('name')}
                  />
                  {touched.name && errors.name && (
                    <Text style={styles.error}>{errors.name}</Text>
                  )}
                </View>

                <View>
                  <CustomInput
                    placeholder={'Enter Email/UserName'}
                    value={values.userName}
                    onChangeText={handleChange('userName')}
                  />
                  {touched.userName && errors.userName && (
                    <Text style={styles.error}>{errors.userName}</Text>
                  )}
                </View>

                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <CustomInput
                      value={values.password}
                      placeholder={'Enter/Generate Password'}
                      onChangeText={handleChange('password')}
                      width="70%"
                    />

                    <CustomButton
                      title={'Generate'}
                      height={44}
                      fontSize={16}
                      onPress={() => setFieldValue('password', nanoid())}
                    />
                  </View>

                  {touched.password && errors.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                  )}
                </View>

                <View>
                  <DropDown
                    value={values.category}
                    onChangeText={item => setFieldValue('category', item?.name)}
                  />
                  {touched.category && errors.category && (
                    <Text style={styles.error}>{errors.category}</Text>
                  )}
                </View>

                <CustomButton
                  title={'ADD'}
                  height={45}
                  fontSize={18}
                  onPress={handleSubmit}
                />
              </View>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default AddPassword;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: gap + 6,
  },
  formHeading: {
    fontSize: 23,
    fontWeight: '600',
    color: '#000',
    marginTop: 40,
    marginBottom: 10,
  },
  form: {
    gap: 15,
    width: '100%',
  },
  error: {
    color: 'red',
    marginTop: 0.5,
  },
});
