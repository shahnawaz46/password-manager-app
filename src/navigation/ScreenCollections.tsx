import Splash from '@/screen/SplashScreen';

// auth screens
import Login from '@/screen/auth/Login';
import Signup from '@/screen/auth/Signup';
import VerifyOtp from '@/screen/auth/VerifyOtp';
import ForgotPassword from '@/screen/auth/ForgotPassword';
import UpdatePassword from '@/screen/auth/UpdatePassword';

// app screens
import Home from '@/screen/app/Home';
import AddPassword from '@/screen/app/AddPassword';
import Profile from '@/screen/app/Profile';
import AccountDetails from '@/screen/app/AccountDetails';

export const splashStack = [{ name: 'SplashScreen', component: Splash }];

export const authStacks = [
  { name: 'LoginScreen', component: Login },
  { name: 'SignupScreen', component: Signup },
  { name: 'VerifyOtpScreen', component: VerifyOtp },
  { name: 'ForgotPasswordScreen', component: ForgotPassword },
  { name: 'UpdatePasswordScreen', component: UpdatePassword },
];

export const appStacks = [
  { name: 'HomeScreen', component: Home },
  { name: 'AddPasswordScreen', component: AddPassword },
  { name: 'ProfileScreen', component: Profile },
  { name: 'AccountDetails', component: AccountDetails },
];

export const mergeStacks = [...splashStack, ...authStacks, ...appStacks];
