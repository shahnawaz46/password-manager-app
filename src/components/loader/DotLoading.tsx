import { StyleSheet, View } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const DotLoading = () => {
  const scales = Array.from({ length: 4 }, () => useSharedValue(1));

  useEffect(() => {
    scales.forEach((scale, index) => {
      scale.value = withDelay(
        index * 200,
        withRepeat(
          withSequence(
            withTiming(0.5, {
              duration: 600,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          ),
          -1,
        ),
      );
    });
  }, []);

  return (
    <View style={styles.container}>
      {scales.map((scale, index) => {
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ scale: scale.value }],
          //   opacity: scale.value,
        }));

        return (
          <Animated.View key={index} style={[animatedStyle, styles.dots]} />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },

  dots: {
    width: 14,
    height: 14,
    backgroundColor: 'black',
    borderRadius: 25,
  },
});

export default DotLoading;
