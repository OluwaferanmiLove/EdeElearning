import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { hp, wp } from '../../util/dimension';
import { colors } from '../../constants/colors';
import Input from '../../components/Input';
import HeaderLite from '../../components/HeaderLite';
import Userlist from '../../components/Userlist';
import { users } from '../../constants/mockData';
import Button from '../../components/Button';
import AddAdminModal from './components/AddAdminModal';
import { useToast } from 'react-native-toast-notifications';
import { collection, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import AddTeacherModal from './components/AddTeacherModal';
import AddStudentModal from './components/AddStudentModal';
import ClassSubjectCard from '../../components/ClassSubjectCard';
import ActionCards from './components/ActionCards';

function DepartmentAction({navigation, route}) {
  const departmentInfo = route.params;

  return (
    <SafeAreaView style={styles.main}>
      <HeaderLite
        description={'Department Action'}
        title={departmentInfo.name}
        onPress={() => navigation.goBack()} />
      {/* <View style={styles.searchContainer}>
        <Input height={hp(48)} placeholder={'Search the list'} />
      </View> */}
      <ScrollView style={styles.content}>
        <View style={{paddingBottom: hp(20), flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between'}}>
          <ActionCards
            marginTop={hp(15)}
            onPress={() => navigation.navigate('DeparmentView', {...departmentInfo, action: 'student'})}
            iconName={'people-outline'}
            title={'Department'}
            value={'Students'}
          />
          <ActionCards
            // color={'#3d164d'}
            marginTop={hp(15)}
            onPress={() => navigation.navigate('DeparmentView', {...departmentInfo, action: 'course'})}
            iconName={'people-outline'}
            title={'Department'}
            value={'Courses'}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // marginHorizontal: wp(20),
  },
  searchContainer: {
    marginTop: hp(20),
    marginHorizontal: wp(20),
  },
  content: {
    marginTop: hp(20),
    paddingHorizontal: wp(20),
  },
  buttonContainer: {
    // position: 'absolute',
    paddingHorizontal: wp(20),
    paddingTop: hp(10),
    marginBottom: hp(25),
  },
})

export default DepartmentAction;