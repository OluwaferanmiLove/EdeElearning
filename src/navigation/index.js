import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AdminNav from './AdminNav';
import { createStackNavigator } from '@react-navigation/stack';
import StudentNav from './StudentNav';
import { AdminClasses, AdminFee, CourseDetail, DeparmentView, DepartmentAction, Login, OnBoarding, PaymentHistory, Profile, Results, StudentHome, StudentList, SubjectByClassesList, SubjectList, SubjectStudent, TeacherHome, ViewDoc } from '../screens';
import { colors } from '../constants/colors';
import { AppContext } from '../context/AppContext';
import TeacherNav from './TeacherNav';

const MainStack = createStackNavigator()


export default function AUHighSchool() {
  const {state} = useContext(AppContext);

  return (
    <NavigationContainer>
      <MainStack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: {
            backgroundColor: colors.mainBg
          }
        }}>
          {!state.loggedin ? (
            <>
              <MainStack.Screen component={OnBoarding} name={'OnBoarding'} />
              <MainStack.Screen component={Login} name={'Login'} />
            </>
          ) : (
            <>
              {state.user.role === 'admin' && (
                <MainStack.Screen component={AdminNav} name={'AdminNav'} />
              )}
              {state.user.role === 'student' && (
                <MainStack.Screen component={StudentHome} name={'StudentHome'} />
              )}
              {state.user.role === 'lecturer' && (
                // <MainStack.Screen component={TeacherNav} name={'TeacherNav'} />
                <MainStack.Screen component={TeacherHome} name={'TeacherHome'} />
              )}
                <MainStack.Screen component={Profile} name={'Profile'} />
                <MainStack.Screen component={AdminClasses} name={'AdminClasses'} />
                <MainStack.Screen component={DeparmentView} name={'DeparmentView'} />
                <MainStack.Screen component={DepartmentAction} name={'DepartmentAction'} />
                <MainStack.Screen component={CourseDetail} name={'CourseDetail'} />
                <MainStack.Screen component={ViewDoc} name={'ViewDoc'} />
                <MainStack.Screen component={Results} name={'Results'} />
                <MainStack.Screen component={AdminFee} name={'AdminFee'} />
                <MainStack.Screen component={StudentList} name={'StudentList'} />
                <MainStack.Screen component={SubjectStudent} name={'SubjectStudent'} />
                <MainStack.Screen component={SubjectByClassesList} name={'SubjectByClassesList'} />
                <MainStack.Screen component={SubjectList} name={'SubjectList'} />
                <MainStack.Screen component={PaymentHistory} name={'PaymentHistory'} />
            </>
          )}
      </MainStack.Navigator>
    </NavigationContainer>
  );
}
