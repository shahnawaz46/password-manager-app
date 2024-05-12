import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import Signin from '../screen/Signin';
import Signup from '../screen/Signup';
import VerifyOtp from '../screen/VerifyOtp';
import ForgotPassword from '../screen/ForgotPassword';
import UpdatePassword from '../screen/UpdatePassword';

const StackNavigation = createNativeStackNavigator();

function AuthStack() {
  return (
    <StackNavigation.Navigator
      initialRouteName="Signin"
      screenOptions={{headerShown: false}}>
      <StackNavigation.Screen name="Signin" component={Signin} />
      <StackNavigation.Screen name="Signup" component={Signup} />
      <StackNavigation.Screen name="Verify OTP" component={VerifyOtp} />
      <StackNavigation.Screen
        name="Forgot Password"
        component={ForgotPassword}
      />
      <StackNavigation.Screen
        name="Update Password"
        component={UpdatePassword}
      />
    </StackNavigation.Navigator>
  );
}

export default AuthStack;
