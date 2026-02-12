import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { mergeStacks } from './ScreenCollections';

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {mergeStacks.map((screen, index) => (
        <Stack.Screen
          key={index}
          name={screen.name}
          component={screen.component}
        />
      ))}
    </Stack.Navigator>
  );
};

export default RootStack;
