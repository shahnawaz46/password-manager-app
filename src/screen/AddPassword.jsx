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
import axiosInstance from '../axios/AxiosInstance';
import {useDataContext} from '../context/DataContext';
import {encrypt} from '../utils/EncDec';
import LoadingAfterUpdate from '../components/LoadingAfterUpdate';
import {API_STATUS} from '../utils/Constants';
import {useSearchContext} from '../context/SearchContext';

const AddPassword = ({route}) => {
  // data context where passwords are stored
  const {passwordList, setPasswordList} = useDataContext();

  // search context for search/delete/edit search results
  const {
    searchPasswords: {searching},
    editSearchResult,
  } = useSearchContext();

  const [initialState, setInitialState] = useState({
    name: '',
    userName: '',
    password: '',
    category: '',
  });
  const idRef = useRef(null);
  const [apiLoading, setApiLoading] = useState(API_STATUS.IDLE);

  const handlePassword = async (values, resetFormCB) => {
    setApiLoading(API_STATUS.LOADING);

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
      const {_id} = res.data;

      // after password added to the database then updating the state
      setPasswordList(prev => ({
        ...prev,
        all: {
          ...prev.all,
          data: {
            ...prev.all.data,
            vault: [{_id, ...values}, ...prev.all.data.vault],
          },
        },
        [category]: {
          ...prev[category],
          data: {
            ...prev[category].data,
            vault: [{_id, ...values}, ...prev[category].data.vault],
          },
        },
        count: {
          ...prev.count,
          all: (prev.count.all += 1),
          [category]: (prev.count[category] += 1),
        },
      }));

      // calling resetForm callback function after data updated on server and state
      resetFormCB();

      setApiLoading(API_STATUS.SUCCESS);
      Toast.show({type: 'success', text1: 'Successfully Added', topOffset: 25});
    } catch (err) {
      setApiLoading(API_STATUS.FAILED);
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
    setApiLoading(API_STATUS.LOADING);

    //  after editing any field I am again encrypting the username and password
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

      const {_id} = res.data;
      const oldCategory = initialState.category.toLowerCase();
      const updatedCategory = res.data.category.toLowerCase();

      // after password updated in database then updating the state
      const all = {
        ...passwordList.all,
        data: {
          ...passwordList.all.data,
          vault: passwordList.all.data.vault.map(item =>
            item._id === idRef.current ? {_id, ...values} : item,
          ),
        },
      };

      // if category is also updated then i have to remove edited data from old category and add into new category same for count
      let updated = {};
      if (updatedValues?.category) {
        updated = {
          [oldCategory]: {
            ...passwordList[oldCategory],
            data: {
              ...passwordList[oldCategory].data,
              vault: passwordList[oldCategory].data.vault.filter(
                item => item._id !== idRef.current,
              ),
            },
          },
          [updatedCategory]: {
            ...passwordList[updatedCategory],
            data: {
              ...passwordList[updatedCategory].data,
              vault: [
                {_id, ...values},
                ...passwordList[updatedCategory].data.vault,
              ],
            },
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
            data: {
              ...passwordList[oldCategory].data,
              vault: passwordList[oldCategory].data.vault.map(item =>
                item._id === idRef.current ? {_id, ...values} : item,
              ),
            },
          },
        };
      }

      setPasswordList(prev => ({...prev, all, ...updated}));

      // if user search any vault/password and then edit search result then i also have to edit data from search result state
      if (searching) {
        editSearchResult({_id, ...values});
      }

      // here i am not calling resetForm callback function like i am doing inside handlePassword
      // because in the case of edit password/vault i am updating initialState value inside useEffect
      // so resetForm function will make no effect because initial value is filled not empty like in handlePassword
      // thats why here i am calling setInitialState after data updated on server and state
      setInitialState({
        category: '',
        name: '',
        password: '',
        userName: '',
      });

      setApiLoading(API_STATUS.SUCCESS);
      Toast.show({
        type: 'success',
        text1: 'Successfully Updated',
        topOffset: 25,
      });
    } catch (err) {
      setApiLoading(API_STATUS.FAILED);
      Toast.show({
        type: 'error',
        text1: err?.response?.data?.error || err?.message,
        topOffset: 25,
      });
    }
  };

  // if route have params that means user is editing the vault
  // so i have updating the initialState with value that i am getting from route.param
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
      {/* for show loading screen after add new password/details */}
      <LoadingAfterUpdate apiLoading={apiLoading} />

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
              } else {
                handlePassword(values, resetForm);
              }
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
                      placeholder={'Enter Password'}
                      onChangeText={handleChange('password')}
                      width="100%"
                    />

                    {/* <CustomButton
                      title={'Generate'}
                      height={44}
                      fontSize={16}
                      onPress={() => setFieldValue('password', nanoid())}
                    /> */}
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
