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
import AddStudentModal from './components/AddStudentModal';

function StudentList({navigation, route}) {
  const [addStudentModal, setAddStudentModal] = useState(false);
  const [student, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const classInfo = route.params;

  console.log(classInfo);

  const toast = useToast();

  const db = getFirestore();

  const studentRef = query(collection(db, "users"), where("department.name", "==", classInfo?.department?.name), where("studentClass.shortName", "==", classInfo?.class?.shortName));

  useEffect(() => {
    // const getStudents = async () => {
    //   let admins = await getDocs(studentRef);
    //   let allAdmins = admins.docs.map((item) => {
    //     return item.data();
    //   })
    //   setStudents(allAdmins);
    //   console.log(allAdmins);
    // }
  
    // getStudents();

    const unsubscribe = onSnapshot(studentRef, (querySnapshot) => {
      const allData = [];
      querySnapshot.forEach((doc) => {
        allData.push(doc.data());
      });
      console.log(allData);
      setStudents(allData);
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
        title={classInfo.class.shortName}
        onPress={() => navigation.goBack()}
        description={classInfo?.department?.name}
      />
      {/* <View style={styles.searchContainer}>
        <Input height={hp(48)} placeholder={'Search the list'} />
      </View> */}
      <ScrollView style={styles.content}>
        {student.map((item, index) => (
          <Userlist
            key={item.id}
            onPress={() => navigation.navigate('Profile', item)}
            image={{ uri: item.image }}
            name={item.firstName + ' ' + item.lastName}
            description={item.role} />
        ))}
        {student.length === 0 && (
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: wp(14), color: colors.primary}}>Student List is empty</Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button dark title={'Add student to ' + classInfo.className} onPress={() => setAddStudentModal(true)} />
      </View>
      <AddStudentModal
        isVisible={addStudentModal}
        onPressCancel={() => setAddStudentModal(false)}
        department={classInfo.department}
        studentClass={classInfo.class} />
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

export default StudentList;