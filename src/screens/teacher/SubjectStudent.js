import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { hp, wp } from '../../util/dimension';
import { colors } from '../../constants/colors';
import HeaderLite from '../../components/HeaderLite';
import Userlist from '../../components/Userlist';
import Button from '../../components/Button';
import { useToast } from 'react-native-toast-notifications';
import { collection, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import StudentSubjectList from '../../components/StudentSubjectList';
import SubjectScore from './components/SubjectScore';

function SubjectStudent({navigation, route}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [student, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState(null);
  const [studentData, setStudentData] = useState({});
  const [existingData, setExistingData] = useState([]);
  const [scores, setScores] = useState([]);

  const subjectInfo = route.params;
  
  let className = subjectInfo.class.substring(0,3) + ' ' + subjectInfo.class.substring(3,4)
  className = className.toUpperCase();

  const toast = useToast();

  const db = getFirestore();

  const studentRef = query(collection(db, "users"), where("class", "==", className));
  const scoreRef = query(collection(db, "scores"));

  const dataRef = query(collection(db, "scores"));
  // const dataRef = query(collection(db, "scores"), where("class", "===", className));

  useEffect(() => {
    const unsubscribe = onSnapshot(dataRef, (querySnapshot) => {
      const allData = [];
      querySnapshot.forEach((doc) => {
        let singleData = {...doc.data(), id: doc.id};
        allData.push(singleData);
      });
      setLoading(false);
      console.log(allData);
      setScores(allData)
    },
    (error) => {
      console.log(error);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getStudents = async () => {
      let admins = await getDocs(studentRef);
      let allAdmins = admins.docs.map((item) => {
        return item.data();
      })
      setStudents(allAdmins);
    }
  
    getStudents();
  }, []);

  const handleOpenTermModal = (term, studentData, scoreData) => {
    // filterScore(studentData.email)
    console.log('scoreData');
    console.log(scoreData);
    console.log('scoreData');
    setExistingData(scoreData)
    setTerm(term);
    setStudentData(studentData);
    // let userInterval = setInterval(() => {
    //   setIsModalVisible(true);
    //   clearInterval(userInterval);
    // }, 3000);

    setIsModalVisible(true);
  };

  const filterScore = (email, term, subject) => {
    let newList = scores.filter(data => {
      return data?.student?.email === email && data?.term === term && data?.subject === subject;
    });

    return newList;
  };

  return (
    <SafeAreaView style={styles.main}>
      <HeaderLite
        title={`${subjectInfo.subject} - ${className}`}
        onPress={() => navigation.goBack()}
        description={subjectInfo.classDescription}
      />
      <ScrollView style={styles.content}>
        {student.map((item, index) => {
          let firstTerm = filterScore(item.email, '1st', subjectInfo.subject)[0]?.total ? filterScore(item.email, '1st', subjectInfo.subject)[0]?.total : 0
          let secondTerm = filterScore(item.email, '2nd', subjectInfo.subject)[0]?.total ? filterScore(item.email, '2nd', subjectInfo.subject)[0]?.total : 0
          let thirdTerm = filterScore(item.email, '3rd', subjectInfo.subject)[0]?.total ? filterScore(item.email, '3rd', subjectInfo.subject)[0]?.total : 0
          let total = parseInt(firstTerm) + parseInt(secondTerm) + parseInt(thirdTerm);

          return (
          <StudentSubjectList
            key={item.email}
            // onPress={() => navigation.navigate('Profile')}
            image={{ uri: item.image }}
            name={item.firstName + ' ' + item.lastName}
            firstTerm={firstTerm}
            secondTerm={secondTerm}
            thirdTerm={thirdTerm}
            total={total}
            // total={filterScore(item.email, '3rd', subjectInfo.subject)[0]?.total}
            onPressFirstTerm={() => handleOpenTermModal('1st', item, filterScore(item.email, '1st', subjectInfo.subject))}
            onPressSecondTerm={() => handleOpenTermModal('2nd', item, filterScore(item.email, '2nd', subjectInfo.subject))}
            onPressThirdTerm={() => handleOpenTermModal('3rd', item, filterScore(item.email, '3rd', subjectInfo.subject))}
            description={item.role} />
        )})}
        {student.length === 0 && (
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: wp(14), color: colors.primary}}>Student List is empty</Text>
          </View>
        )}
      </ScrollView>
      {loading && (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={'small'} color={colors.primary} />
        </View>
      )}
      <SubjectScore
        key={existingData}
        term={term}
        isVisible={isModalVisible}
        studentData={studentData}
        exsitingData={existingData[0]}
        subject={subjectInfo.subject}
        className={className}
        navigation={navigation}
        onPressCancel={() => {
          setIsModalVisible(false);
          setExistingData([])
        }}
      />
      {/* <View style={styles.buttonContainer}>
        <Button dark title={'Add student to ' + subjectInfo.className} onPress={() => setAddStudentModal(true)} />
      </View> */}
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

export default SubjectStudent;