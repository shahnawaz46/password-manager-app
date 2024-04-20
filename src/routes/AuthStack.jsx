import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import Signin from '../screen/Signin';
import Signup from '../screen/Signup';

const StackNavigation = createNativeStackNavigator();

function AuthStack() {
  return (
    <StackNavigation.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <StackNavigation.Screen name="Signin" component={Signin} />
      <StackNavigation.Screen name="Signup" component={Signup} />
    </StackNavigation.Navigator>
  );
}

export default AuthStack;
