import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { useNavigation } from '@react-navigation/native';

// components
import { useAppTheme } from '@/hooks/useAppTheme';
import CustomButton from './CustomButton';
import { gap } from '../utils/Spacing';
import Loading from './Loading';
import { API_STATUS } from '../utils/Constants';
import LoadingAfterUpdate from './LoadingAfterUpdate';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { deleteVaultItem, getVaultItems } from '@/api/vault.api';
import { vaultKeys } from '@/queries/query-keys';
import {
  deleteVaultItemFromInfiteQuery,
  updateVaultCount,
} from '@/queries/vault-queries';

const AllPasswords = ({ selectedCategory, filterCategory }) => {
  const {
    colors: { textPrimary },
  } = useAppTheme();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [apiLoading, setApiLoading] = useState(API_STATUS.IDLE);
  const [modalVisible, setModalVisible] = useState({
    show: false,
    id: null,
    category: '',
  });

  const {
    data: vaultItem,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  } = useInfiniteQuery({
    queryKey: [selectedCategory],
    queryFn: getVaultItems,
    initialPageParam: `/password?category=${selectedCategory}`,
    getNextPageParam: lastPage => lastPage.next ?? undefined,
  });

  // delete mutation
  const { mutateAsync: deleteVaultItemMutateAsync } = useMutation({
    mutationFn: ({ id, category }) => deleteVaultItem(id, category),
    onSuccess: res => {
      Toast.show({ type: 'success', text1: res?.data?.msg, topOffset: 25 });

      // delete vault item from category(APP or Browser)
      queryClient.setQueryData([res.category], oldData =>
        deleteVaultItemFromInfiteQuery(oldData, res.id),
      );

      // delete vault item from category(All)
      queryClient.setQueryData([vaultKeys.ALL], oldData =>
        deleteVaultItemFromInfiteQuery(oldData, res.id),
      );

      // update vault count
      queryClient.setQueryData([vaultKeys.COUNT], oldData =>
        updateVaultCount(oldData, res.category, 'SUB'),
      );
    },
    onError: err => {
      Toast.show({
        type: 'error',
        text1: err?.response?.data?.error || err?.message,
        topOffset: 25,
      });
    },
  });

  const flatListArray = useMemo(() => {
    const flattedArray = [];
    vaultItem?.pages?.forEach(item =>
      flattedArray.push(...(item?.password || [])),
    ) ?? [];
    return flattedArray;
  }, [vaultItem]);

  const copyPassword = password => {
    Clipboard.setString(password);
    Toast.show({
      text1: 'Text Copied!',
      type: 'success', // Or 'info' for a neutral message
      position: 'bottom',
      bottomOffset: 25,
    });
  };

  const editVault = item => {
    navigation.navigate('AddPasswordScreen', item);
  };

  return (
    <>
      {/* for show loading screen after delete the password/vault */}
      <LoadingAfterUpdate
        apiLoading={apiLoading}
        backgroundColor={'rgba(0,0,0,0.5)'}
      />

      <View style={styles.passwordContainer}>
        <Text style={{ fontSize: 18, color: textPrimary }}>All Passwords</Text>
        <View style={styles.passwordCategory}>
          <CustomButton
            title={vaultKeys.ALL}
            selected={selectedCategory === vaultKeys.ALL}
            onPress={() => filterCategory(vaultKeys.ALL)}
          />
          <CustomButton
            title={vaultKeys.APP}
            selected={selectedCategory === vaultKeys.APP}
            onPress={() => filterCategory(vaultKeys.APP)}
          />
          <CustomButton
            title={vaultKeys.BROWSER}
            selected={selectedCategory === vaultKeys.BROWSER}
            onPress={() => filterCategory(vaultKeys.BROWSER)}
          />
        </View>

        {/* list of passwords */}
        {isLoading ? (
          <Loading />
        ) : (
          <View style={{ flex: 1, flexGrow: 1 }}>
            <FlatList
              data={flatListArray}
              contentContainerStyle={styles.passwordCardContainer}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <View style={styles.passwordCard}>
                  <View style={{ flex: 1 }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 15,
                        color: textPrimary,
                        ...styles.nameAndUserName,
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text numberOfLines={1}>{item.userName}</Text>
                  </View>

                  {/* icon container with copy and popup icon */}
                  <View style={styles.passwordIconContainer}>
                    <TouchableOpacity
                      onPress={() => copyPassword(item.password)}
                    >
                      <Ionicons name="copy-outline" size={22} />
                    </TouchableOpacity>

                    {/* menu for edit and delete password */}
                    <Menu>
                      <MenuTrigger>
                        <Ionicons name="ellipsis-vertical" size={24} />
                      </MenuTrigger>

                      <MenuOptions
                        optionsContainerStyle={{
                          width: 120,
                          borderRadius: 10,
                        }}
                      >
                        <MenuOption
                          onSelect={() => editVault(item)}
                          style={{ paddingHorizontal: 10, paddingTop: 10 }}
                        >
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: gap,
                            }}
                          >
                            <MaterialDesignIcons
                              name="square-edit-outline"
                              size={20}
                            />
                            <Text style={{ fontSize: 17 }}>Edit</Text>
                          </View>
                        </MenuOption>
                        <MenuOption
                          onSelect={() =>
                            setModalVisible({
                              show: true,
                              id: item._id,
                              category: item.category,
                            })
                          }
                          style={{ padding: 10 }}
                        >
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: gap,
                            }}
                          >
                            <MaterialDesignIcons name="delete" size={20} />

                            <Text style={{ fontSize: 17 }}>Delete</Text>
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
                  }}
                >
                  <Text style={{ fontSize: 20 }}>Not Data Available</Text>
                </View>
              )}
              onEndReached={() => hasNextPage && !isFetching && fetchNextPage()}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() =>
                hasNextPage && <ActivityIndicator size={38} color={'#6FD09A'} />
              }
            />
          </View>
        )}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible.show}
        onRequestClose={() => {
          setModalVisible({ show: false, id: null, category: '' });
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this password? This action cannot
              be undone.
            </Text>

            <View style={styles.passwordCategory}>
              <CustomButton
                title={'Confirm'}
                paddingHorizontal={25}
                fontSize={16}
                borderRadius={8}
                onPress={() => {
                  deleteVaultItemMutateAsync({
                    id: modalVisible.id,
                    category: modalVisible.category,
                  });
                  setModalVisible({ show: false, id: null, category: '' });
                }}
              />
              <CustomButton
                title={'Cancel'}
                paddingHorizontal={25}
                fontSize={16}
                borderRadius={8}
                onPress={() =>
                  setModalVisible({ show: false, id: null, category: '' })
                }
              />
            </View>
          </View>
        </View>
      </Modal>
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

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000',
    marginBottom: 6,
    textAlign: 'center',
  },
});
