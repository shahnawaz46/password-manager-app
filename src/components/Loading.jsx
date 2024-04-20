import React from 'react';
import {Image, View} from 'react-native';

const Loading = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Image
        source={require('../assets/loading.gif')}
        style={{
          width: 80,
          height: 80,
        }}
      />
    </View>
  );
};

export default Loading;
