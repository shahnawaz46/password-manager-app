import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

// components
import {useAppTheme} from '../routes/Router';
import CustomButton from './CustomButton';
import {gap} from '../utils/Spacing';
import Loading from './Loading';
import axiosInstance from '../api/AxiosInstance';
import {useDataContext} from '../context/DataContext';
import {all} from 'axios';

const AllPasswords = ({password, status, category, filterCategory}) => {
  const {
    colors: {textPrimary},
  } = useAppTheme();
  console.log('AllPasswords:', password.length);

  const {setPasswordList} = useDataContext();

  const copyPassword = password => {
    Clipboard.setString(password);
    Toast.show({
      text1: 'Text Copied!',
      type: 'success', // Or 'info' for a neutral message
      position: 'bottom',
      bottomOffset: 25,
    });
  };

  const onDelete = async (id, categoryType) => {
    try {
      const res = await axiosInstance.delete('/password', {data: {id}});
      console.log(res.data);

      // after deleted from the database i am also removing from state
      const category = categoryType.toLowerCase();
      setPasswordList(prev => ({
        ...prev,
        all: {...prev.all, data: prev.all.data.filter(item => item._id !== id)},
        [category]: {
          ...prev[category],
          data: prev[category].data.filter(item => item._id !== id),
        },
        count: {
          ...prev.count,
          all: (prev.count.all -= 1),
          [category]: (prev.count[category] -= 1),
        },
      }));
      Toast.show({type: 'success', text1: res.data.msg});
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err?.response?.data?.error || err?.message,
      });
    }
  };

  return (
    <View style={styles.passwordContainer}>
      <Text style={{fontSize: 18, color: textPrimary}}>All Passwords</Text>
      <View style={styles.passwordCategory}>
        <CustomButton
          title={'All'}
          selected={category === 'All'}
          onPress={() => filterCategory('All')}
        />
        <CustomButton
          title={'App'}
          selected={category === 'App'}
          onPress={() => filterCategory('App')}
        />
        <CustomButton
          title={'Browser'}
          selected={category === 'Browser'}
          onPress={() => filterCategory('Browser')}
        />
      </View>

      {/* list of passwords */}
      {status === 'loading' ? (
        <Loading />
      ) : password?.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 20}}>Not Available</Text>
        </View>
      ) : (
        <View style={{flexGrow: 1}}>
          <FlatList
            data={password}
            contentContainerStyle={styles.passwordCardContainer}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <View style={styles.passwordCard}>
                <View style={{flex: 1}}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 15,
                      color: textPrimary,
                      ...styles.nameAndUserName,
                    }}>
                    {item.name}
                  </Text>
                  <Text numberOfLines={1}>{item.userName}</Text>
                </View>

                {/* icon container with copy and popup icon */}
                <View style={styles.passwordIconContainer}>
                  <TouchableOpacity onPress={() => copyPassword(item.password)}>
                    <Ionicons name="copy-outline" size={22} />
                  </TouchableOpacity>

                  {/* menu for edit and delete password */}
                  <Menu>
                    <MenuTrigger>
                      <MaterialCommunityIcons name="dots-vertical" size={24} />
                    </MenuTrigger>

                    <MenuOptions
                      optionsContainerStyle={{
                        width: 120,
                        borderRadius: 10,
                      }}>
                      <MenuOption
                        onSelect={() => alert(`Delete`)}
                        style={{paddingHorizontal: 10, paddingTop: 10}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: gap,
                          }}>
                          <MaterialCommunityIcons
                            name="square-edit-outline"
                            size={20}
                          />
                          <Text style={{fontSize: 17}}>Edit</Text>
                        </View>
                      </MenuOption>
                      <MenuOption
                        onSelect={() => onDelete(item._id, item.category)}
                        style={{padding: 10}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: gap,
                          }}>
                          <MaterialCommunityIcons name="delete" size={20} />

                          <Text style={{fontSize: 17}}>Delete</Text>
                        </View>
                      </MenuOption>
                    </MenuOptions>
                  </Menu>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default React.memo(AllPasswords);

const styles = StyleSheet.create({
  passwordContainer: {
    flex: 1,
    paddingTop: 20,
  },
  passwordCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap,
    marginTop: 10,
    marginBottom: 15,
  },
  passwordCardContainer: {
    gap: gap,
    flexGrow: 1,
    zIndex: 1,
  },
  passwordCard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 30,
    padding: 10,
    borderRadius: 5,
    borderWidth: 0.2,
    backgroundColor: '#fff',
    position: 'relative',
    zIndex: 10,
  },
  passwordIconContainer: {
    flexDirection: 'row',
    gap: gap,
  },
});
