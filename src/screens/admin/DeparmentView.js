import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
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

function DeparmentView({ navigation, route }) {
  const [addAdminModal, setAddStudentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);

  let department = route.params

  const toast = useToast();

  const db = getFirestore();

  useEffect(() => {
    const classesRef = query(collection(db, "classes"));
    const q = query(classesRef);

    // const getTeacher = async () => {
    //   let teacher = await getDocs(classesRef);
    //   let allAdmins = teacher.docs.map((item) => {
    //     return item.data();
    //   })
    //   setData(allAdmins);
    //   // console.log(allAdmins);
    // }

    // getTeacher();

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allData = [];
      querySnapshot.forEach((doc) => {
        allData.push(doc.data());
      });
      console.log(data);
      setData(allData);
      setLoading(false);
    },
      (error) => {
        console.log(error.message);
      });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.main}>
      <HeaderLite
        title={department.name}
        description={department?.school?.schoolName}
        onPress={() => navigation.goBack()} />
      {/* <View style={styles.searchContainer}>
        <Input height={hp(48)} placeholder={'Search the list'} />
      </View> */}
      <ScrollView style={styles.content}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {data.map((item, index) => (
            <ClassSubjectCard
              key={item.name + item.type}
              title={item.shortName}
              iconName={department.action === 'course' ? 'book-outline' : 'people-outline'}
              value={department.action === 'course' ? 'View Courses' : 'View Students'}
              onPress={() => {
                if(department.action === 'course') {
                  navigation.navigate('SubjectList', {class: item, department: department})
                } else {
                  navigation.navigate('StudentList', {class: item, department: department})

                }
              }}
              marginTop={index !== 0 && index !== 1 ? hp(25) : 0}
            />
          ))}
        </View>
        {loading && (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size={'small'} color={colors.primary} />
          </View>
        )}
      </ScrollView>
      <AddStudentModal
        isVisible={addAdminModal}
        onPressCancel={() => setAddStudentModal(false)}
      // className={classInfo.name}
      // studentNumber={classInfo.numberStudents}
      // studentClass={classInfo.className}
      />
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

export default DeparmentView;