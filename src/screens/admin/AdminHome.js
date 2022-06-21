import React, {useContext, useState, useEffect} from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import Header from '../../components/Header';
import { colors } from '../../constants/colors';
import { hp, wp } from '../../util/dimension';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppContext } from '../../context/AppContext';
import ActionCards from './components/ActionCards';
import { generateColor } from '../../util/randomColor';
import ImageView from '../../components/ImageView';
import { deleteFromStorage } from '../../util/storageUtil';
import { logout } from '../../context/action';
import { collection, getFirestore, query, onSnapshot } from 'firebase/firestore';

function AdminHome ({navigation}) {
  const {state, dispatch} = useContext(AppContext);
  const [payHistory, setPayHistory] = useState([]);

  const handleLogOut = () => {
    deleteFromStorage('userData')
      .then((response) => {
        dispatch(logout())
        // dispatch(resetState())
      })
  };

  const db = getFirestore();

  const paymentRef = query(collection(db, "payments"));
  
  useEffect(() => {
    const unsubscribe = onSnapshot(paymentRef, (querySnapshot) => {
      const allData = [];
      querySnapshot.forEach((doc) => {
        let singleData = {...doc.data(), id: doc.id};
        allData.push(singleData);
      });
      console.log(allData);
      setPayHistory(allData);
    },
    (error) => {
      console.log(error);
    });
    
    return () => unsubscribe();
  }, []);

  const allFeesPaid = () => {
    let pay = 0;
    payHistory.forEach(data => {
      pay = pay + parseInt(data.amount)
      // console.log(pay)
    });
    return pay;
  }

  return (
    <SafeAreaView style={styles.main}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#ffffff'} />
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          {/* <ImageView
            image={{uri: 'https://randomuser.me/api/portraits/women/8.jpg'}}
            width={wp(55)}
            height={wp(55)}
            /> */}
          <View style={styles.userInfoContainer}>
            <Text style={styles.name}>{state.user.lastName} {state.user.firstName}</Text>
            <Text style={styles.description}>{state.user.role}</Text>
          </View>
          <TouchableOpacity onPress={handleLogOut}>
            <View  style={styles.iconContainer}>
              <Ionicons name={'log-out-outline'} size={wp(20)} color={colors.secondaryDarker} />
            </View>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>
            Total school fee paid
          </Text>
          <Text style={styles.infoValue}>
            N {allFeesPaid().toLocaleString('en-US', { minimumFractionDigits: 2})}
          </Text>
        </View> */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Actions</Text>
        </View>
        <View style={{paddingBottom: hp(20), flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between'}}>
          <ActionCards
            marginTop={hp(15)}
            onPress={() => navigation.navigate('AdminList')}
            iconName={'people-outline'}
            title={'System'}
            value={'Admins'}
          />
          {/* <ActionCards
            // color={colors.secondaryDarker}
            marginTop={hp(15)}
            onPress={() => navigation.navigate('StudentList')}
            title={'Students'}
            value={40}
          /> */}
          <ActionCards
            // color={'#3d164d'}
            marginTop={hp(15)}
            onPress={() => navigation.navigate('AdminDepartment')}
            iconName={'people-outline'}
            title={'All'}
            value={'Dept.'}
          />
          {/* <ActionCards
            // color={'#3d164d'}
            marginTop={hp(15)}
            onPress={() => navigation.navigate('AdminClasses')}
            iconName={'people-outline'}
            title={'Department'}
            value={'Students'}
          /> */}
          <ActionCards
            // color={'#a14556'}
            marginTop={hp(20)}
            onPress={() => navigation.navigate('TeacherList')}
            iconName={'people-outline'}
            title={'All'}
            value={'Lecturer'}
          />
        </View>
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
    color: colors.secondary
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

export default AdminHome;