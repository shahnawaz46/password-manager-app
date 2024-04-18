import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

// components
import {useAppTheme} from '../../App';
import AllPasswords from '../components/AllPasswords';
import {gap} from '../utils/Spacing';

const tempPassword = [
  {
    id: 1,
    name: 'GitHub',
    userName:
      'shahnawaz123@gmail.comshahnawaz123@gmail.comshahnawaz123@gmail.com',
    password: 'GitHub123456',
    category: 'Browser',
  },
  {
    id: 2,
    name: 'Figmashahnawaz123456789000000000',
    userName: 'shahnawaz123@gmail.com',
    password: 'Figma123456',
    category: 'Browser',
  },
  {
    id: 3,
    name: 'Linkedin',
    userName: 'shahnawaz123@gmail.com',
    password: 'Linkedin123456',
    category: 'App',
  },
  {
    id: 4,
    name: 'GitHub',
    userName:
      'shahnawaz123@gmail.comshahnawaz123@gmail.comshahnawaz123@gmail.com',
    password: '123456',
    category: 'Browser',
  },
  {
    id: 5,
    name: 'Figmashahnawaz123456789000000000',
    userName: 'shahnawaz123@gmail.com',
    password: '123456',
    category: 'Browser',
  },
  {
    id: 6,
    name: 'Linkedin',
    userName: 'shahnawaz123@gmail.com',
    password: '123456',
    category: 'App',
  },
  {
    id: 7,
    name: 'GitHub',
    userName:
      'shahnawaz123@gmail.comshahnawaz123@gmail.comshahnawaz123@gmail.com',
    password: '123456',
    category: 'Browser',
  },
  {
    id: 8,
    name: 'Figmashahnawaz123456789000000000',
    userName: 'shahnawaz123@gmail.com',
    password: '123456',
    category: 'Browser',
  },
  {
    id: 9,
    name: 'Linkedin',
    userName: 'shahnawaz123@gmail.com',
    password: '123456',
    category: 'App',
  },
  {
    id: 10,
    name: 'GitHub',
    userName:
      'shahnawaz123@gmail.comshahnawaz123@gmail.comshahnawaz123@gmail.com',
    password: '123456',
    category: 'Browser',
  },
  {
    id: 11,
    name: 'Figmashahnawaz123456789000000000',
    userName: 'shahnawaz123@gmail.com',
    password: '123456',
    category: 'Browser',
  },
  {
    id: 12,
    name: 'Linkedin',
    userName: 'shahnawaz123@gmail.com',
    password: '123456',
    category: 'App',
  },
];

const Home = ({navigation}) => {
  const {
    colors: {primary, textPrimary},
  } = useAppTheme();

  const [passwordList, setPasswordList] = useState({
    status: 'loading',
    count: {},
    password: [],
  });

  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('idle');
  const prevPasswordListRef = useRef([]);

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
  const onSearch = customDebouce(e => {
    const query = e[0];

    if (!query) {
      setPasswordList(prev => ({
        ...prev,
        password: prevPasswordListRef.current,
      }));
      return;
    }

    setStatus('loading');

    const result = passwordList.password.filter(item => {
      if (category === 'App' || category === 'Browser')
        return (
          item.name.toUpperCase().includes(query.toUpperCase()) &&
          item.category === category
        );

      return item.name.toUpperCase().includes(query.toUpperCase());
    });
    setPasswordList(prev => ({...prev, password: result}));

    setStatus('success');
  }, 600);

  // filter category
  const filterCategory = value => {
    if (category === value) return;

    setStatus('loading');
    setCategory(value);

    if (value === 'All') {
      setPasswordList(prev => ({...prev, password: tempPassword}));
      prevPasswordListRef.current = tempPassword;
    } else {
      const result = tempPassword.filter(item => item.category === value);
      setPasswordList(prev => ({...prev, password: result}));
      prevPasswordListRef.current = result;
    }
    setStatus('success');
  };

  useEffect(() => {
    setTimeout(() => {
      prevPasswordListRef.current = tempPassword;
      setPasswordList({
        status: 'success',
        count: {all: 20, browser: 8, app: 12},
        password: tempPassword,
      });
    }, 1000);
  }, []);

  if (passwordList.status === 'loading') {
    return (
      <View style={styles.loading}>
        <Image
          source={require('../assets/loading.gif')}
          style={{
            width: 80,
            height: 80,
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.homeContainer}>
      <View style={styles.topContainer}>
        <Text style={{...styles.heading, color: textPrimary}}>
          Password <Text style={{color: '#1db962'}}>Manager</Text>
        </Text>

        <AntDesign
          name="plus"
          size={32}
          color={primary}
          onPress={() => navigation.navigate('Add Password')}
        />
      </View>

      {/* user details (like image and name with welcome message) */}
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <View style={styles.userContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1466112928291-0903b80a9466?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
            }}
            style={styles.userImage}
          />

          <View>
            <Text style={{fontSize: 14}}>Welcome Back,</Text>
            <Text style={{color: textPrimary, fontSize: 16}}>
              Mohammad Shahnawaz Siddiqui
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* search bar */}
      <View style={styles.search_container}>
        <AntDesign name="search1" size={22} />
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
            <AntDesign name="chrome" color={primary} size={22} />
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
        password={passwordList.password}
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
  heading: {
    fontSize: 23,
    fontWeight: '500',
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

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
