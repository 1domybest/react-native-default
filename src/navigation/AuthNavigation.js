import React from 'react'
import { ThemeProvider, createTheme } from '@rneui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IndexScreen from '../screens/auth/IndexScreen'
import {ROUTES} from '../constants/routes'
import MainNavigation from './MainNavigation'
const Stack = createNativeStackNavigator();

const theme = createTheme({
  lightColors: {
    primary: '#899656',
    error: 'rgb(255, 25, 12)',
    white: 'white'
  },
  darkColors: {
    primary: '#344512',
    error: 'rgb(255, 25, 12)',
    white: 'white'
  },
  mode: 'light',
});



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
    headerShown: false,
    headerShown: true,
    headerBackTitleVisible: false,
    headerTintColor: 'black',
    gestureEnabled: true,
    transitionSpec: {
      open: config,
      close: config,
    },
}

let initialRouteName = ROUTES.INDEX

const AuthNavigation = () => {
  return (
    <ThemeProvider theme={theme}>
        <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRouteName} screenOptions={screenOption}>
                 <Stack.Screen name={ROUTES.INDEX} component={IndexScreen} options={{headerShown: false}}/>
                 <Stack.Screen name={ROUTES.MAIN} component={MainNavigation} options={{headerShown: false}} />
            </Stack.Navigator>
        </NavigationContainer>
  </ThemeProvider>
  )
}

export default AuthNavigation