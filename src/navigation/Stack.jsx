import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import Home from '../screen/Home';
import Profile from '../screen/Profile';
import AddPassword from '../screen/AddPassword';
import Signin from '../screen/Signin';
import Signup from '../screen/Signup';

const StackNavigation = createNativeStackNavigator();

function Stack() {
  return (
    <StackNavigation.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <StackNavigation.Screen name="Home" component={Home} />
      <StackNavigation.Screen name="Add Password" component={AddPassword} />
      <StackNavigation.Screen name="Profile" component={Profile} />
      <StackNavigation.Screen name="Signin" component={Signin} />
      <StackNavigation.Screen name="Signup" component={Signup} />
    </StackNavigation.Navigator>
  );
}

export default Stack;
