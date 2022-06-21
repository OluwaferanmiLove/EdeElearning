import React, { useContext } from 'react';
import {Platform, Text} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  StudentHome,
} from '../screens';
import { AntDesign, Foundation, Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { fontFamily } from '../constants/fontFamily';
import { hp, wp } from '../util/dimension';
import AdminNav from './AdminNav';
import { AppContext } from '../context/AppContext';

const StudentTab = createBottomTabNavigator();
const StudentStack = createStackNavigator();

export default function StudentNav () {
  return (
    <StudentStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: {
        backgroundColor: colors.mainBg
      }
    }}>
      <StudentStack.Screen component={TeacherHome} name={'TeacherHome'} />
    </StudentStack.Navigator>
    // <StudentTab.Navigator
    //   screenOptions={{
    //     headerShown: false,
    //     tabBarShowLabel: false,
    //     tabBarLabel: ({focused, color}) => (
    //       <Text>Test</Text>
    //     ),
    //     tabBarLabelStyle: {
    //       fontFamily: fontFamily.ApparelDisplayBold,
    //       fontSize: hp(14)
    //     },
    //     tabBarStyle: {
    //       // position: 'absolute',
    //       // paddingBottom: hp(0),
    //       // marginBottom: hp(20),
    //       // borderRadius: wp(30),
    //       // marginHorizontal: wp(15),
    //       backgroundColor: colors.mainBg,
    //       borderTopRightRadius: wp(30),
    //       borderTopLeftRadius: wp(30),
    //       height: Platform.select({android: hp(65), ios: hp(78)}),
    //       // paddingTop: hp(10),
    //       shadowColor: colors.secondaryDarker,
    //       shadowOffset: {
    //         width: 0,
    //         height: 1,
    //       },
    //       borderTopWidth: 0,
    //       shadowOpacity: 0.5,
    //       shadowRadius: 5,
    //       elevation: 9,
    //     }
    //   }}>
    //   <StudentTab.Screen component={StudentHome} name={'StudentHome'} options={{
    //     tabBarIcon: ({focused, color, size}) => {
    //       if (focused) {
    //         return <Foundation name={'home'} size={28} color={colors.primary} />
    //       } else {
    //         return <AntDesign name={'home'} size={28} color={colors.secondary} />
    //       }
    //     },
    //     tabBarActiveTintColor: colors.primary,
    //     tabBarInactiveTintColor: colors.secondary,
    //   }} />
    // </StudentTab.Navigator>
  )
}
