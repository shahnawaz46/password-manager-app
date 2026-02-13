import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// components
import { useAppTheme } from '@/hooks/useAppTheme';
import { gap } from '../utils/Spacing';

const ProfileItem = ({ title, subTitle, icon, onPress }) => {
  const {
    colors: { textPrimary },
  } = useAppTheme();

  return (
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center', gap: gap }}
      onPress={onPress}
    >
      <View
        style={{
          backgroundColor: '#eafaf4',
          borderRadius: 50,
          padding: 12,
        }}
      >
        {icon}
      </View>
      <View>
        <Text style={{ fontSize: 16, color: textPrimary }}>{title}</Text>
        <Text style={{ fontSize: 13 }}>{subTitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileItem;
