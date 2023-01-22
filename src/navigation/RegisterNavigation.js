import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {ROUTES} from '../constants/routes'
import RegisterEmailAuthScreen from '../screens/auth/register/RegisterEmailAuthScreen'
import RegisterBirthDayScreen from '../screens/auth/register/RegisterBirthDayScreen'
import TestScreen from '../screens/auth/TestScreen'
import RegisterEmailAuthValidationScreen from '../screens/auth/register/RegisterEmailAuthValidationScreen'
import RegisterPasswordScreen from '../screens/auth/register/RegisterPasswordScreen'
import RegisterUserNameScreen from '../screens/auth/register/RegisterUserNameScreen'
import RegisterNickNameScreen from '../screens/auth/register/RegisterNickNameScreen'
import RegisterProfileImage from '../screens/auth/register/RegisterProfileImage'
const Stack = createNativeStackNavigator();

const config = {
  animation: 'spring',
  config: {
    stiffness: 11000,
    damping: 1500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const screenOption = {
    headerBackTitleVisible: false,
    headerTintColor: 'black',
    gestureEnabled: true,
    transitionSpec: {
      open: config,
      close: config,
    },
}

let initialRouteName = ROUTES.REGISTERBIRTHDAY

const AuthNavigation = () => {
  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={screenOption}>
                 <Stack.Screen name={ROUTES.REGISTERBIRTHDAY} component={RegisterBirthDayScreen}  options={{headerShown: true, headerTitle: '',}} />
                 <Stack.Screen name={ROUTES.REGISTEREMAILAUTH} component={RegisterEmailAuthScreen}  options={{headerShown: true, headerTitle: '',}} />
                 <Stack.Screen name={ROUTES.REGISTEREMAILAUTHVALIDATION} component={RegisterEmailAuthValidationScreen}  options={{headerShown: true, headerTitle: '',}} />
                 <Stack.Screen name={ROUTES.REGISTERPASSWORD} component={RegisterPasswordScreen}  options={{headerShown: true, headerTitle: '',}} />
                 <Stack.Screen name={ROUTES.REGISTERNICKNAME} component={RegisterNickNameScreen}  options={{headerShown: true, headerTitle: '',}} />
                 <Stack.Screen name={ROUTES.REGISTERUSERNAME} component={RegisterUserNameScreen}  options={{headerShown: true, headerTitle: '',}} />
                 <Stack.Screen name={ROUTES.REGISTERPROFILEIMAGE} component={RegisterProfileImage}  options={{headerShown: true, headerTitle: '',}} />
                 <Stack.Screen name={ROUTES.TEST} component={TestScreen}  options={{headerShown: true, headerTitle: '',}} />
    </Stack.Navigator>
  )
}

export default AuthNavigation