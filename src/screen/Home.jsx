import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

// components
import {useAppTheme} from '../routes/Router';
import AllPasswords from '../components/AllPasswords';
import {gap} from '../utils/Spacing';
import {tempPassword, useDataContext} from '../context/DataContext';
import Title from '../components/Title';
import Loading from '../components/Loading';
import axiosInstance from '../api/AxiosInstance';
import {decrypt} from '../utils/EncDec';

const Home = ({navigation}) => {
  const {
    colors: {primary, textPrimary},
  } = useAppTheme();

  // context where passwords are stored
  const {passwordList, authDetails, fetchPassword} = useDataContext();

  // state for store password that i am getting from passwordList(context)
  const [passwords, setPasswords] = useState([]);
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('idle');

  // custom debouce for delay function invocation
  const customDebouce = (cb, timeout) => {
    let timer;

    return (...args) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        cb(args);
      }, timeout);
    };
  };

  // here i am calling customDebouce function and passing callBack function(where logic is written for search) and timeout(for delay)
  const onSearch = customDebouce(async e => {
    const query = e[0];

    if (!query) {
      const newPasswordData = await gettingData(
        passwordList[category.toLocaleLowerCase()].data,
      );
      setPasswords(newPasswordData);
      return;
    }

    setStatus('loading');

    const res = await axiosInstance.get(
      `/password/search?category=${category}&search=${query}`,
    );
    const newPasswordData = await gettingData(res.data);
    setPasswords(newPasswordData);

    setStatus('success');
  }, 600);

  // filter category
  const filterCategory = value => {
    if (category === value) return;

    setStatus('loading');
    setCategory(value);
  };

  // function for getting all the vault by decrypt
  const gettingData = async data => {
    const password = [];
    for (const item of data) {
      const {data, ...rest} = item;
      const result = await decrypt(data);
      result
        ? password.push({...rest, ...JSON.parse(result)})
        : password.push({...rest});
    }

    return password;
  };

  useEffect(() => {
    // Immediately Invoked Function Expressions (IIFEs):
    (async function () {
      if (category === 'All') {
        passwordList.all.status === 'loading' && fetchPassword('All');
        if (passwordList.all.status === 'success') {
          const newPasswordData = await gettingData(passwordList.all.data);
          setPasswords(newPasswordData);
          setStatus('success');
        }
      } else if (category === 'App') {
        passwordList.app.status === 'loading' && fetchPassword('App');
        if (passwordList.app.status === 'success') {
          const newPasswordData = await gettingData(passwordList.app.data);
          setPasswords(newPasswordData);
          setStatus('success');
        }
      } else if (category === 'Browser') {
        passwordList.browser.status === 'loading' && fetchPassword('Browser');
        if (passwordList.browser.status === 'success') {
          const newPasswordData = await gettingData(passwordList.browser.data);
          setPasswords(newPasswordData);
          setStatus('success');
        }
      }
    })();
  }, [passwordList, category]);

  if (passwordList.all.status === 'loading') {
    return <Loading />;
  }

  return (
    <View style={styles.homeContainer}>
      <View style={styles.topContainer}>
        <Title style={{fontSize: 23, fontWeight: '500', color: textPrimary}} />

        <Ionicons
          name="add-outline"
          size={40}
          color={primary}
          onPress={() => navigation.navigate('Add Password')}
        />
      </View>

      {/* user details (like image and name with welcome message) */}
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <View style={styles.userContainer}>
          <Image
            source={{
              uri:
                authDetails.userDetails?.image ||
                'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png',
            }}
            style={styles.userImage}
          />

          <View>
            <Text style={{fontSize: 14}}>Welcome Back,</Text>
            <Text style={{color: textPrimary, fontSize: 16}}>
              {authDetails.userDetails?.fullName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* search bar */}
      <View style={styles.search_container}>
        <Ionicons name="search-outline" size={26} />

        <TextInput
          placeholder="Search Password"
          style={{
            padding: 0,
            fontSize: 16,
            width: '100%',
          }}
          onChangeText={onSearch}
        />
      </View>

      {/* three card for show password count */}
      <View style={styles.passwordCategoryContainer}>
        <View style={styles.passwordCategoryCard}>
          <View
            style={{
              ...styles.passwordCategoryIcon,
              borderColor: primary,
            }}>
            <Ionicons name="clipboard" color={primary} size={22} />
          </View>
          <Text style={{fontSize: 16, color: textPrimary}}>All</Text>
          <Text style={{fontSize: 14}}>
            {passwordList?.count?.all || 0} Passwords
          </Text>
        </View>
        <View style={styles.passwordCategoryCard}>
          <View
            style={{
              ...styles.passwordCategoryIcon,
              borderColor: primary,
            }}>
            <Ionicons name="logo-chrome" color={primary} size={27} />
          </View>
          <Text style={{fontSize: 16, color: textPrimary}}>Browser</Text>
          <Text style={{fontSize: 14}}>
            {passwordList?.count?.browser || 0} Passwords
          </Text>
        </View>

        <View style={styles.passwordCategoryCard}>
          <View
            style={{
              ...styles.passwordCategoryIcon,
              borderColor: primary,
            }}>
            <FontAwesome name="mobile" color={primary} size={31} />
          </View>
          <Text style={{fontSize: 16, color: textPrimary}}>App</Text>
          <Text style={{fontSize: 14}}>
            {passwordList?.count?.app || 0} Passwords
          </Text>
        </View>
      </View>

      {/* list of all passwords */}
      <AllPasswords
        password={passwords}
        status={status}
        category={category}
        filterCategory={filterCategory}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  homeContainer: {
    padding: gap,
    flex: 1,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
    objectFit: 'cover',
  },
  search_container: {
    backgroundColor: '#eeeff1',
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 20,
    marginBottom: 25,
    overflow: 'hidden',
  },
  passwordCategoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: gap,
  },
  passwordCategoryCard: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e7f9f2',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  passwordCategoryIcon: {
    borderRadius: 30,
    borderWidth: 1,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
});
