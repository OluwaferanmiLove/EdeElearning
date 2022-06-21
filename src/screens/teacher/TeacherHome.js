import React, { useContext, useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { colors } from '../../constants/colors';
import { hp, wp } from '../../util/dimension';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppContext } from '../../context/AppContext';
import { generateColor } from '../../util/randomColor';
import ImageView from '../../components/ImageView';
import { deleteFromStorage } from '../../util/storageUtil';
import { logout } from '../../context/action';
import { useToast } from 'react-native-toast-notifications';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import ClassSubjectCard from '../../components/ClassSubjectCard';
import TeacherSubject from '../../components/TeacherSubject';

function TeacherHome({ navigation }) {
  const { state, dispatch } = useContext(AppContext);

  const [allSubjects, setAllSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const db = getFirestore();

  const adminsRef = query(collection(db, "courses"), where("lecturer.email", "==", state.user.email));

  useEffect(() => {
    const getAdmins = async () => {
      let admins = await getDocs(adminsRef);
      let allAdmins = admins.docs.map((item) => {
        return item.data();
      })
      setAllSubjects(allAdmins);
      console.log(allAdmins);
    }

    getAdmins();
  }, []);

  const handleLogOut = () => {
    deleteFromStorage('userData')
      .then((response) => {
        dispatch(logout());
        // dispatch(resetState())
      })
  }

  return (
    <SafeAreaView style={styles.main}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#ffffff'} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          {/* <ImageView
            image={{uri: 'https://randomuser.me/api/portraits/women/8.jpg'}}
            width={wp(55)}
            height={wp(55)}
            /> */}
          <View style={styles.userInfoContainer}>
            <Text style={styles.name}>{state.user.firstName} {state.user.lastName}</Text>
            <Text style={styles.description}>{state.user.role}</Text>
          </View>
          <TouchableOpacity onPress={handleLogOut}>
            <View style={styles.iconContainer}>
              <Ionicons name={'log-out-outline'} size={wp(20)} color={colors.secondaryDarker} />
            </View>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>
            Total school fee paid
          </Text>
          <Text style={styles.infoValue}>
            N 1, 500, 000
          </Text>
        </View> */}
        {/* <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Actions</Text>
        </View> */}
        <View style={{
          paddingBottom: hp(20),
          marginTop: hp(20),
          flexWrap: 'wrap',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          {/* <ClassSubjectCard /> */}
          {allSubjects.map((item, index) => (
            <TeacherSubject
              key={item.class.shortName}
              title={item.courseTitle}
              subject={item.courseCode}
              onPress={() => navigation.navigate('CourseDetail', item)}
              marginTop={index !== 0 && index !== 1 ? hp(25) : 0}
            />
          ))}
        </View>
        {allSubjects.length < 1 && (
          <View style={[styles.sectionTitleContainer, {alignItems: 'center', flex: 1, height: hp(800)}]}>
            <Text style={[styles.sectionTitle, {fontWeight: 'normal', fontSize: wp(18)}]}>You have no subject assign to you yet</Text>
            <Text style={[styles.sectionTitle, {fontWeight: 'normal', fontSize: wp(18)}]}>Contact your admin to asign course for you.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginHorizontal: wp(20),
  },
  header: {
    marginTop: hp(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoContainer: {
    flex: 1,
    // marginLeft: wp(10)
  },
  name: {
    fontSize: wp(20),
    fontWeight: '500',
    color: colors.primary
  },
  description: {
    fontSize: wp(16),
    textTransform: 'capitalize',
    fontWeight: '300',
    color: colors.secondaryDarker
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(35),
    height: wp(35),
    borderRadius: 7,
    backgroundColor: colors.secondaryLighter + '30',
  },
  infoContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: hp(20),
    paddingVertical: hp(22),
    borderRadius: wp(10),
    backgroundColor: colors.primary,
  },
  infoTitle: {
    fontSize: wp(16),
    fontWeight: '300',
    color: '#ffffff90',
  },
  infoValue: {
    fontSize: wp(35),
    fontWeight: '700',
    marginTop: hp(10),
    color: '#ffffff'
  },
  sectionTitleContainer: {
    marginTop: hp(25),
  },
  sectionTitle: {
    fontSize: wp(22),
    fontWeight: '700',
    color: colors.primary
  },
})

export default TeacherHome;