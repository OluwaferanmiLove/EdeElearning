import React, { useState, useEffect, useContext } from 'react';
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
import AddStudyMaterial from './components/AddStudyMaterial';
import { AppContext } from '../../context/AppContext';

function CourseDetail({ navigation, route }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [student, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [term, setTerm] = useState(null);
  const [studentData, setStudentData] = useState({});
  const [existingData, setExistingData] = useState([]);
  const [data, setData] = useState([]);
  const [selectedPill, setSelectedPill] = useState('bookmarks');

  const { state } = useContext(AppContext);

  const subjectInfo = route.params;

  const toast = useToast();

  const db = getFirestore();

  // const studentRef = query(collection(db, "users"), where("class", "==", className));
  // const scoreRef = query(collection(db, "scores"));

  // const dataRef = query(collection(db, "scores"));
  const dataRef = query(collection(db, "materials"), where("class.shortName", "==", subjectInfo?.class?.shortName), where("course.courseTitle", "==", subjectInfo?.courseTitle),
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(dataRef, (querySnapshot) => {
      const allData = [];
      querySnapshot.forEach((doc) => {
        let singleData = { ...doc.data(), id: doc.id };
        allData.push(singleData);
      });
      setLoading(false);
      console.log(allData);
      setData(allData)
    },
      (error) => {
        console.log(error);
      });

    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   const getStudents = async () => {
  //     let admins = await getDocs(studentRef);
  //     let allAdmins = admins.docs.map((item) => {
  //       return item.data();
  //     })
  //     setStudents(allAdmins);
  //   }

  //   getStudents();
  // }, []);

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
        title={`${subjectInfo.courseTitle}`}
        onPress={() => navigation.goBack()}
        description={subjectInfo.classDescription}
      />
      <ScrollView style={styles.content}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{
            fontSize: wp(22),
            fontWeight: 'bold',
            color: '#555'
          }}>{subjectInfo.courseTitle} ({subjectInfo.courseCode})</Text>
          <Text style={{
            fontSize: wp(20),
            fontWeight: 'bold',
            marginTop: hp(8),
            color: '#999',
          }}>{subjectInfo.class.name}</Text>
        </View>
        <View style={{ marginTop: hp(25) }}>
          <View style={styles.paginationTop}>
            <TouchableOpacity
              style={[
                styles.pill,
                { backgroundColor: selectedPill === 'bookmarks' ? '#ffffff' : '#ffffff00' }
              ]}
              onPress={() => setSelectedPill('bookmarks')}>
              <Text style={styles.pillTitle}>Material</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={[
                styles.pill,
                { backgroundColor: selectedPill === 'myBooks' ? '#ffffff' : '#ffffff00' }
              ]}
              onPress={() => setSelectedPill('myBooks')}>
              <Text style={styles.pillTitle}>Comments</Text>
            </TouchableOpacity> */}
          </View>
          {selectedPill === 'bookmarks' && (
            // <View style={{marginTop: hp(25)}}>
            //   <Text style={{ fontSize: wp(18), fontWeight: 'bold' }}>Study materials</Text>
            // </View>
            <>
              {data.map((item, index) => (
                <View key={item.materialTitle} style={styles.materialCard}>
                  <View style={{ flex: 0.8 }}>
                    <Text style={{ fontSize: wp(18) }}>{item.materialTitle} (PDF)</Text>
                    <Text style={{ fontSize: wp(14), color: '#555' }}>{item.course.courseTitle} ({item.course.courseCode})</Text>
                    <Text style={{ fontSize: wp(14), color: '#333', marginTop: hp(8) }}>{item.description}</Text>
                  </View>
                  {state.user.role === 'student' && (
                    <View>
                      <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={() => navigation.navigate('ViewDoc', item)}
                      >
                        {/* <Ionicons name={'download-outline'} size={wp(20)} color={colors.primary} /> */}
                        <Ionicons name={'eye-outline'} size={wp(20)} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
      {state.user.role !== 'student' && (
        <View style={{
          marginTop: hp(20),
          width: '100%',
          alignItems: 'center',
          position: 'absolute',
          bottom: hp(25),
        }}>
          <Button
            dark
            title={'Create new study'}
            onPress={() => setIsModalVisible(true)}
          />
        </View>
      )}
      {loading && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size={'small'} color={colors.primary} />
        </View>
      )}
      <AddStudyMaterial
        isVisible={isModalVisible}
        navigation={navigation}
        className={subjectInfo.class}
        course={subjectInfo}
        department={subjectInfo.department}
        onPressCancel={() => {
          setIsModalVisible(false);
          setExistingData([])
        }}
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
  paginationTop: {
    flexDirection: 'row',
    marginTop: hp(25),
    width: '100%',
    height: hp(55),
    paddingVertical: hp(10),
    paddingHorizontal: wp(4),
    backgroundColor: colors.primary + '20',
    borderRadius: 999999,
  },
  pill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    backgroundColor: '#ffffff',
    marginHorizontal: hp(10),
  },
  pillTitle: {
    fontSize: hp(16),
    fontWeight: '700',
    color: colors.primary,
  },
  content: {
    flex: 1,
    marginTop: hp(20),
    paddingHorizontal: wp(20),
  },
  materialCard: {
    width: '100%',
    // height: hp(120),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: wp(8),
    borderWidth: wp(1.5),
    borderColor: '#eee',
    marginTop: hp(15),
    paddingHorizontal: wp(15),
    paddingVertical: hp(15),
    paddingBottom: hp(20),
    backgroundColor: colors.primary + '05'
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(45),
    height: wp(45),
    borderRadius: 7,
    backgroundColor: colors.primary + '10',
  },
  buttonContainer: {
    // position: 'absolute',
    paddingHorizontal: wp(20),
    paddingTop: hp(10),
    marginBottom: hp(25),
  },
})

export default CourseDetail;