import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar
} from 'react-native';
import { colors } from '../../constants/colors';
import { hp, wp } from '../../util/dimension';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppContext } from '../../context/AppContext';
import { generateColor } from '../../util/randomColor';
import ImageView from '../../components/ImageView';
import { deleteFromStorage } from '../../util/storageUtil';
import { logout } from '../../context/action';
import { useToast } from 'react-native-toast-notifications';
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  where
} from 'firebase/firestore';
import ClassSubjectCard from '../../components/ClassSubjectCard';
import TeacherSubject from '../../components/TeacherSubject';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import ActionCards from '../admin/components/ActionCards';
import { Paystack } from 'react-native-paystack-webview';
import EnterPayModal from './component/EnterPayModal';
import { makeid } from '../../util/util';

function StudentHome({ navigation }) {
  const { state, dispatch } = useContext(AppContext);

  const [allSubjects, setAllSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [fees, setFees] = useState(null);
  const [data, setData] = useState([]);
  const [paymentCheck, setPaymentCheck] = useState({});
  const [payHistory, setPayHistory] = useState([]);

  const toast = useToast();

  const db = getFirestore();

  useEffect(() => {
    const ref = query(collection(db, "courses"), where("class.name", "==", state.user.studentClass.name));
    const unsubscribe = onSnapshot(ref, (querySnapshot) => {
      const allData = [];
      querySnapshot.forEach((doc) => {
        let singleData = { ...doc.data(), id: doc.id };
        allData.push(singleData);
      });
      setData(allData);
    },
      (error) => {
        console.log(error);
      });

    return () => unsubscribe();
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
      <ScrollView style={{ flex: 1, marginHorizontal: wp(20), }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          {/* <ImageView
            image={{uri: 'https://randomuser.me/api/portraits/women/8.jpg'}}
            width={wp(55)}
            height={wp(55)}
            /> */}
          <View style={styles.userInfoContainer}>
            <Text style={styles.name}>{state.user.firstName} {state.user.lastName}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.description}>{state.user.role} - {state.user.class}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogOut}>
            <View style={styles.iconContainer}>
              <Ionicons name={'log-out-outline'} size={wp(20)} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>
            Total fees paid by you
          </Text>
          <Text style={styles.infoValue}>
            N {allFeesPaid().toLocaleString('en-US', { minimumFractionDigits: 2})}
          </Text>
        </View> */}
        <View style={styles.sectionTitleContainer}>
          <Text style={[styles.sectionTitle, { fontSize: wp(15) }]}>
            Your courses at {state.user.department.name} {state.user.studentClass.shortName}
          </Text>
        </View>
        {/* <View style={{
          flexDirection: 'row',
          marginTop: hp(25),
          alignItems: 'center',
          justifyContent: 'space-between'}}>
          <TouchableOpacity style={{alignItems: 'center', flex: 1}} onPress={() => {
            handlePayment('schoolFee');
          }}>
              <Ionicons name={'cash-outline'} color={colors.primary} size={wp(25)} />
              <Text style={{ marginTop: hp(8) }}>School fee</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{alignItems: 'center', flex: 1}} onPress={() => {
            handlePayment('hostelFee')
            }}>
            <FontAwesome name={'bank'} color={colors.primary} size={wp(25)} />
            <Text style={{ marginTop: hp(8) }}>Hostel fee</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{alignItems: 'center', flex: 1}} onPress={() => navigation.navigate('Results')}>
            <FontAwesome name={'paper-plane'} color={colors.primary} size={wp(25)} />
            <Text style={{ marginTop: hp(8) }}>Check result</Text>
          </TouchableOpacity>
        </View> */}
        <View style={{
          paddingBottom: hp(20),
          marginTop: hp(25),
          flexWrap: 'wrap',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          {data.map((item, index) => (
            <TeacherSubject
              key={item.class.shortName}
              title={item.courseTitle}
              subject={item.courseCode}
              onPress={() => navigation.navigate('CourseDetail', item)}
              marginTop={index !== 0 && index !== 1 ? hp(25) : 0}
            />
          ))}
        </View>
      </ScrollView>
      {/* <EnterPayModal
        isVisible={isVisible}
        onPressCancel={() => setIsVisible(false)} 
        onPressNext={handlePayment}
      /> */}
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size={'small'} color={colors.white} />
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // marginHorizontal: wp(20),
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
    fontWeight: '500',
    color: '#00000070'
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(35),
    height: wp(35),
    borderRadius: 7,
    backgroundColor: colors.primary + '10',
  },
  infoContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: hp(20),
    paddingVertical: hp(22),
    borderRadius: wp(10),
    backgroundColor: colors.primary + 20,
  },
  infoTitle: {
    fontSize: wp(16),
    fontWeight: '300',
    color: colors.primary + 80,
  },
  infoValue: {
    fontSize: wp(35),
    fontWeight: '700',
    marginTop: hp(10),
    color: colors.primary
  },
  sectionTitleContainer: {
    marginTop: hp(25),
  },
  sectionTitle: {
    fontSize: wp(22),
    fontWeight: '700',
    color: colors.primary
  },
  loading: {
    flex: 1,
    position: 'absolute',
    height: hp(812),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000090',
  }
})

export default StudentHome;