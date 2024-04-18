import React, {useState} from 'react';
import {
  FlatList,
  Image,
  Platform,
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
import {useAppTheme} from '../../App';
import CustomButton from './CustomButton';
import {gap} from '../utils/Spacing';

const AllPasswords = ({password, status, category, filterCategory}) => {
  const {
    colors: {primary, textPrimary},
  } = useAppTheme();

  const copyPassword = password => {
    Clipboard.setString(password);
    Toast.show({
      text1: 'Text Copied!',
      type: 'success', // Or 'info' for a neutral message
      position: 'bottom',
    });
  };

  const onDelete = id => {
    console.log(id);
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
        <View style={styles.loading}>
          <Image
            source={require('../assets/loading.gif')}
            style={{
              width: 80,
              height: 80,
            }}
          />
        </View>
      ) : password?.length === 0 ? (
        <View style={styles.loading}>
          <Text style={{fontSize: 20}}>Not Available</Text>
        </View>
      ) : (
        <View style={{flexGrow: 1}}>
          <FlatList
            data={password}
            contentContainerStyle={styles.passwordCardContainer}
            keyExtractor={item => item.id}
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
                        onSelect={() => onDelete(item.id)}
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

  loading: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});