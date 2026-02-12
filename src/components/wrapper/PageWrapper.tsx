import { StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

// types/interface
import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

interface IPageWrapperProps {
  children: ReactNode;
  containerStyle?: ViewStyle;
}

const PageWrapper = ({ children, containerStyle }: IPageWrapperProps) => {
  return (
    <SafeAreaView
      style={[styles.container, containerStyle]}
      edges={['top', 'left', 'right']}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

export default PageWrapper;
