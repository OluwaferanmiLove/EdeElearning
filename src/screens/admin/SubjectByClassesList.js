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
import AddClassModal from './components/AddClassModal';
import ClassSubjectCard from '../../components/ClassSubjectCard';

function SubjectByClassesList({navigation}) {
  const [addClassModal, setAddAdminModal] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allSubjects, setAllSubjects] = useState([]);

  const toast = useToast();

  const db = getFirestore();

  const dataRef = query(collection(db, "subjects"));

  useEffect(() => {
    const q = query(dataRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allData = [];
      querySnapshot.forEach((doc) => {
        allData.push(doc.data());
      });
      setData(data);
      let jss1Subjects = allData.filter(data => {
        return data.class.toLowerCase() === 'jss1';
      });

      let jss2Subjects = allData.filter(data => {
        return data.class.toLowerCase() === 'jss2';
      });

      let jss3Subjects = allData.filter(data => {
        return data.class.toLowerCase() === 'jss3';
      });

      let sss1Subjects = allData.filter(data => {
        return data.class.toLowerCase() === 'sss1';
      });

      let sss2Subjects = allData.filter(data => {
        return data.class.toLowerCase() === 'sss2';
      });

      let sss3Subjects = allData.filter(data => {
        return data.class.toLowerCase() === 'sss3';
      });

      let allSubjects = [
        {
          className: 'JSS 1',
          name: 'jss1',
          subjects: jss1Subjects,
          numberOfSubject: jss1Subjects.length,
        },
        {
          className: 'JSS 2',
          name: 'jss2',
          subjects: jss2Subjects,
          numberOfSubject: jss2Subjects.length,
        },
        {
          className: 'JSS 3',
          name: 'jss3',
          subjects: jss3Subjects,
          numberOfSubject: jss3Subjects.length,
        },
        {
          className: 'SSS 1',
          name: 'sss1',
          subjects: sss1Subjects,
          numberOfSubject: sss1Subjects.length,
        },
        {
          className: 'SSS 2',
          name: 'sss2',
          subjects: sss2Subjects,
          numberOfSubject: sss2Subjects.length,
        },
        {
          className: 'SSS 3',
          name: 'sss3',
          subjects: sss3Subjects,
          numberOfSubject: sss3Subjects.length,
        },
      ]

      setAllSubjects(allSubjects);
      setLoading(false);
    },
    (error) => {
      console.log(error.message);
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.main}>
      <HeaderLite title={'Subjects By Classes'} onPress={() => navigation.goBack()} />
      {/* <View style={styles.searchContainer}>
        <Input height={hp(48)} placeholder={'Search the list'} />
      </View> */}
      <ScrollView style={styles.content}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
          {allSubjects.map((item, index) => (
            <ClassSubjectCard 
              key={item.className}
              title={item.className}
              value={item.numberOfSubject}
              onPress={() => navigation.navigate('SubjectList', item)}
              marginTop={index !== 0 && index !== 1 ? hp(25) : 0}
            />
          ))}
        </View>
        {loading && (
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={'small'} color={colors.primary} />
          </View>
        )}
      </ScrollView>
      {/* <View style={styles.buttonContainer}>
        <Button dark title={'Add new class'} onPress={() => setAddAdminModal(true)} />
      </View> */}
      <AddClassModal isVisible={addClassModal} onPressCancel={() => setAddAdminModal(false)} />
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
    // flexDirection: 'row',
    // justifyContent: 'space-between',
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

export default SubjectByClassesList;