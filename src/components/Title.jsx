import React from 'react';
import {Text} from 'react-native';

const Title = ({style}) => {
  return (
    <Text style={style}>
      Password <Text style={{color: '#1db962'}}>Manager</Text>
    </Text>
  );
};

export default Title;
