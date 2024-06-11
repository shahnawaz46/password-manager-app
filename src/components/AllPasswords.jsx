import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
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
import {useNavigation} from '@react-navigation/native';

// components
import {useAppTheme} from '../routes/Router';
import CustomButton from './CustomButton';
import {gap} from '../utils/Spacing';
import Loading from './Loading';
import axiosInstance from '../axios/AxiosInstance';
import {useDataContext} from '../context/DataContext';
import {API_STATUS} from '../utils/Constants';
import LoadingAfterUpdate from './LoadingAfterUpdate';
import {useSearchContext} from '../context/SearchContext';

const AllPasswords = ({
  password,
  status,
  category,
  filterCategory,
  isShowingSearchResult,
}) => {
  const {
    colors: {textPrimary},
  } = useAppTheme();

  const {next, vault} = password;

  // data context where passwords are stored
  const {setPasswordList, fetchPassword} = useDataContext();

  // search context for search/delete/edit search results
  const {deleteSearchResult, fetchMoreSearchData} = useSearchContext();

  const navigation = useNavigation();
  const [apiLoading, setApiLoading] = useState(API_STATUS.IDLE);
  const [paginating, setPaginating] = useState(false);

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
      setApiLoading(API_STATUS.LOADING);
      const res = await axiosInstance.delete('/password', {data: {id}});

      // after deleted from the database i am also removing from state
      const category = categoryType.toLowerCase();
      setPasswordList(prev => ({
        ...prev,
        all: {
          ...prev.all,
          data: {
            ...prev.all.data,
            vault: prev.all.data.vault.filter(item => item._id !== id),
          },
        },
        [category]: {
          ...prev[category],
          data: {
            ...prev[category].data,
            vault: prev[category].data.vault.filter(item => item._id !== id),
          },
        },
        count: {
          ...prev.count,
          all: (prev.count.all -= 1),
          [category]: (prev.count[category] -= 1),
        },
      }));

      // if user search any vault/password and then delete search result then i also have to edit data from search result state
      if (isShowingSearchResult) {
        deleteSearchResult(id);
      }

      setApiLoading(API_STATUS.SUCCESS);
      Toast.show({type: 'success', text1: res.data.msg, topOffset: 25});
    } catch (err) {
      setApiLoading(API_STATUS.FAILED);
      Toast.show({
        type: 'error',
        text1: err?.response?.data?.error || err?.message,
        topOffset: 25,
      });
    }
  };

  const editVault = item => {
    navigation.navigate('Add Password', item);
  };

  // pagination
  const fetchMoreData = async () => {
    if (paginating) return;

    setPaginating(prev => !prev);
    if (isShowingSearchResult && status === API_STATUS.SUCCESS) {
      await fetchMoreSearchData(next);
      setPaginating(prev => !prev);
    } else if (status === API_STATUS.SUCCESS) {
      await fetchPassword(category, next);
      setPaginating(prev => !prev);
    }
  };

  return (
    <>
      {/* for show loading screen after delete the password/vault */}
      <LoadingAfterUpdate apiLoading={apiLoading} />

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
        {status === API_STATUS.LOADING ? (
          <Loading />
        ) : (
          <View style={{flex: 1, flexGrow: 1}}>
            <FlatList
              data={vault}
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
                    <TouchableOpacity
                      onPress={() => copyPassword(item.password)}>
                      <Ionicons name="copy-outline" size={22} />
                    </TouchableOpacity>

                    {/* menu for edit and delete password */}
                    <Menu>
                      <MenuTrigger>
                        <MaterialCommunityIcons
                          name="dots-vertical"
                          size={24}
                        />
                      </MenuTrigger>

                      <MenuOptions
                        optionsContainerStyle={{
                          width: 120,
                          borderRadius: 10,
                        }}>
                        <MenuOption
                          onSelect={() => editVault(item)}
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
              ListEmptyComponent={() => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 20}}>Not Data Available</Text>
                </View>
              )}
              onEndReached={() => next && fetchMoreData()}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() =>
                next && <ActivityIndicator size={38} color={'#6FD09A'} />
              }
              // debug={true}
            />
          </View>
        )}
      </View>
    </>
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
