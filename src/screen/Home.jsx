import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';

// components
import { useAppTheme } from '../routes/Router';
import AllPasswords from '../components/AllPasswords';
import { gap } from '../utils/Spacing';
import { useDataContext } from '../context/DataContext';
import Title from '../components/Title';
import { API_STATUS } from '../utils/Constants';
import { initialState, useSearchContext } from '../context/SearchContext';

const Home = ({ navigation }) => {
  const {
    colors: { primary, textPrimary },
  } = useAppTheme();

  // data context where passwords are stored
  const { passwordList, authDetails, fetchPassword } = useDataContext();

  // search context for search/delete/edit search results
  const { searchPasswords, setSearchPasswords, onSearch } = useSearchContext();

  const [category, setCategory] = useState('All');

  // filter category
  const filterCategory = value => {
    setSearchPasswords(initialState);

    if (category === value) return;
    setCategory(value);
  };

  useEffect(() => {
    // Immediately Invoked Function Expressions (IIFEs):
    (async function () {
      category === 'All' &&
        passwordList.all.status === API_STATUS.LOADING &&
        fetchPassword('All');

      category === 'App' &&
        passwordList.app.status === API_STATUS.LOADING &&
        fetchPassword('App');

      category === 'Browser' &&
        passwordList.browser.status === API_STATUS.LOADING &&
        fetchPassword('Browser');
    })();
  }, [category]);

  return (
    <View style={styles.homeContainer}>
      <View style={styles.topContainer}>
        <Title
          style={{ fontSize: 23, fontWeight: '500', color: textPrimary }}
        />

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
                authDetails.userDetails?.profileImage ||
                'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png',
            }}
            style={styles.userImage}
          />

          <View>
            <Text style={{ fontSize: 14 }}>Welcome Back,</Text>
            <Text style={{ color: textPrimary, fontSize: 16 }}>
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
          onChangeText={e => onSearch(e, category)}
        />
      </View>

      {/* three card for show password count */}
      <View style={styles.passwordCategoryContainer}>
        <View style={styles.passwordCategoryCard}>
          <View
            style={{
              ...styles.passwordCategoryIcon,
              borderColor: primary,
            }}
          >
            <Ionicons name="clipboard" color={primary} size={22} />
          </View>
          <Text style={{ fontSize: 16, color: textPrimary }}>All</Text>
          <Text style={{ fontSize: 14 }}>
            {passwordList?.count?.all || 0} Passwords
          </Text>
        </View>
        <View style={styles.passwordCategoryCard}>
          <View
            style={{
              ...styles.passwordCategoryIcon,
              borderColor: primary,
            }}
          >
            <Ionicons name="logo-chrome" color={primary} size={27} />
          </View>
          <Text style={{ fontSize: 16, color: textPrimary }}>Browser</Text>
          <Text style={{ fontSize: 14 }}>
            {passwordList?.count?.browser || 0} Passwords
          </Text>
        </View>

        <View style={styles.passwordCategoryCard}>
          <View
            style={{
              ...styles.passwordCategoryIcon,
              borderColor: primary,
            }}
          >
            <Ionicons name="apps" color={primary} size={20} />
          </View>
          <Text style={{ fontSize: 16, color: textPrimary }}>App</Text>
          <Text style={{ fontSize: 14 }}>
            {passwordList?.count?.app || 0} Passwords
          </Text>
        </View>
      </View>

      {/* list of all passwords */}
      <AllPasswords
        password={
          searchPasswords.searching
            ? searchPasswords.data
            : passwordList[category.toLowerCase()].data
        }
        status={
          searchPasswords.searching
            ? searchPasswords.status
            : passwordList[category.toLowerCase()].status
        }
        category={category}
        filterCategory={filterCategory}
        isShowingSearchResult={searchPasswords.searching}
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
