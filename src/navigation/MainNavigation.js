import { View, Text } from 'react-native'
import React from 'react'
import { makeStyles } from '@rneui/themed';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {ROUTES} from '../constants/routes'
import HomeScreen from '../screens/main/HomeScreen'
import CommuntiyScreen from '../screens/main/CommuntiyScreen'
import CameraScreen from '../screens/main/Camera'
import ActivityScreen from '../screens/main/ActivityScreen'
import ProfileScreen from '../screens/main/ProfileScreen'
const Tab = createBottomTabNavigator();

const MainNavigation = () => {
  return (
    <Tab.Navigator initialRouteName={ROUTES.HOME}
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        borderTopWidth: 1,
        borderTopColor: '#61616236',
        height: 90,    
        padding: 10,
        backgroundColor: "white",
    },
    tabBarInactiveTintColor:'#80808036',
    tabBarActiveTintColor: 'black',
      tabBarIcon: ({color, size, focused}) => {
        let tab = {
          icon: '',
          name: ''
        };
        if (route.name === ROUTES.HOME) {
          tab.icon = focused ? "home-variant" : "home-variant-outline";
          tab.name = '홈'
          return (
            <>
            <MaterialCommunityIcons name={tab.icon} size={28} color={color}/>
            <Text style={{color: color, marginTop: 3,}}>{tab.name}</Text>
            </>
          )
        } else if (route.name === ROUTES.COMMUNITY) {
          tab.icon = focused ? "md-grid" : "md-grid";
          tab.name = '커뮤니티'
          return (
            <>
            <Ionicons name={tab.icon} size={28} color={color}/>
            <Text style={{color: color, marginTop: 3,}}>{tab.name}</Text>
            </>
          )
        } else if (route.name === ROUTES.CAMERA) {
          tab.icon = focused ? "radio-button-on" : "radio-button-on";
          tab.name = ''
          return (
            <>
            <Ionicons name={tab.icon} size={50} color={"red"}/>
            <Text style={{color: color, marginTop: 3,}}>{tab.name}</Text>
            </>
          )
        } else if (route.name === ROUTES.ACTIVITY) {
          tab.icon = focused ? "md-chatbox-ellipses" : "md-chatbox-ellipses";
          tab.name = '활동'
          return (
            <>
            <Ionicons name={tab.icon} size={28} color={color}/>
            <Text style={{color: color, marginTop: 3,}}>{tab.name}</Text>
            </>
          )
        } else if (route.name === ROUTES.PROFILE) {
          tab.icon = focused ? "person" : "person";
          tab.name = '프로필'
          return (
            <>
            <Ionicons name={tab.icon} size={28} color={color}/>
            <Text style={{color: color, marginTop: 3,}}>{tab.name}</Text>
            </>
          )
        }
      }
    })}>
      <Tab.Screen name={ROUTES.HOME} component={HomeScreen} ></Tab.Screen>
      <Tab.Screen name={ROUTES.COMMUNITY} component={CommuntiyScreen} ></Tab.Screen>
      <Tab.Screen name={ROUTES.CAMERA} component={CameraScreen} options={{tabBarStyle: {display: 'none'}}}></Tab.Screen>
      <Tab.Screen name={ROUTES.ACTIVITY} component={ActivityScreen} ></Tab.Screen>
      <Tab.Screen name={ROUTES.PROFILE} component={ProfileScreen} ></Tab.Screen>
    </Tab.Navigator>
  )
}

export default MainNavigation

const useStyles = makeStyles((theme, props) => ({
}));