import React from 'react';
import {StyleSheet, View} from 'react-native';
import Loading from './Loading';
import {API_STATUS} from '../utils/Constants';

const LoadingAfterUpdate = ({apiLoading}) => {
  return (
    <>
      {apiLoading === API_STATUS.LOADING && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.2)',
            zIndex: 10,
          }}>
          <Loading />
        </View>
      )}
    </>
  );
};

export default LoadingAfterUpdate;

const styles = StyleSheet.create({});
