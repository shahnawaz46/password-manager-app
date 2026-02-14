import React, { useState } from 'react';
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
import { useAppTheme } from '@/hooks/useAppTheme';
import AllPasswords from '@/components/AllPasswords';
import { gap } from '@/utils/Spacing';
import Title from '@/components/Title';
import { useAuthContext } from '@/hooks/useAuthContext';
import { vaultCount } from '@/api/vault.api';
import { useQuery } from '@tanstack/react-query';
import { vaultKeys } from '@/queries/query-keys';

const Home = ({ navigation }) => {
  const { user } = useAuthContext();
  const {
    colors: { primary, textPrimary },
  } = useAppTheme();
  const [selectedCategory, setSelectedCategory] = useState(vaultKeys.ALL);
  const [searchInput, setSearchInput] = useState('');

  const {
    data: vaultCountData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [vaultKeys.COUNT],
    queryFn: vaultCount,
  });

  // filter category
  const filterCategory = value => {
    if (selectedCategory === value) return;
    setSelectedCategory(value);
  };

  const appVaultCount = vaultCountData?.find(
    item => item.category === 'App',
  )?.count;
  const browserVaultCount = vaultCountData?.find(
    item => item.category === 'Browser',
  )?.count;

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
          onPress={() => navigation.navigate('AddPasswordScreen')}
        />
      </View>

      {/* user details (like image and name with welcome message) */}
      <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
        <View style={styles.userContainer}>
          <Image
            source={{
              uri:
                user?.profileImage ||
                'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png',
            }}
            style={styles.userImage}
          />

          <View>
            <Text style={{ fontSize: 14 }}>Welcome Back,</Text>
            <Text style={{ color: textPrimary, fontSize: 16 }}>
              {user?.fullName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* search bar */}
      <View style={styles.search_container}>
        <Ionicons name="search-outline" size={26} />

        <TextInput
          placeholder="Search by website/App"
          style={{
            padding: 0,
            fontSize: 16,
            width: '100%',
          }}
          onChangeText={setSearchInput}
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
            {appVaultCount + browserVaultCount || 0} Passwords
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
            {browserVaultCount || 0} Passwords
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
          <Text style={{ fontSize: 14 }}>{appVaultCount || 0} Passwords</Text>
        </View>
      </View>

      {/* list of all passwords */}
      <AllPasswords
        selectedCategory={selectedCategory}
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
