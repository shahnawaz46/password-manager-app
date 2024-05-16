import React from 'react';
import {Text} from 'react-native';

const Title = ({style}) => {
  return (
    <Text style={style}>
      Guard <Text style={{color: '#1db962'}}>Vault</Text>
    </Text>
  );
};

export default Title;
