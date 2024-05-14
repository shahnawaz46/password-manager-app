import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import Home from '../screen/Home';
import Profile from '../screen/Profile';
import AddPassword from '../screen/AddPassword';
import AccountDetails from '../screen/AccountDetails';

const StackNavigation = createNativeStackNavigator();

function AppStack() {
  return (
    <StackNavigation.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <StackNavigation.Screen name="Home" component={Home} />
      <StackNavigation.Screen name="Add Password" component={AddPassword} />
      <StackNavigation.Screen name="Profile" component={Profile} />
      <StackNavigation.Screen
        name="Personal Details"
        component={AccountDetails}
      />
    </StackNavigation.Navigator>
  );
}

export default AppStack;
