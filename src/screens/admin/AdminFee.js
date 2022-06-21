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
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import AddStudentModal from './components/AddStudentModal';

function AdminFee({ navigation, route }) {
  const [schoolFee, setSchoolFee] = useState(null);
  const [hostelFee, setHostelFee] = useState(null);

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);

  const toast = useToast();

  const db = getFirestore();

  const studentRef = query(collection(db, "fees"));

  useEffect(() => {
    const getData = async () => {
      let data = await getDocs(studentRef);
      let allData = data.docs.map((item) => {
        return {...item.data(), id: item.id};
      })
      setData(allData);
      setHostelFee(allData[0].hostelFee);
      setSchoolFee(allData[0].schoolFee);
    }

    getData();
  }, []);

  const handleSaveFees = async () => {
    try {
      setLoading(true);

      if (schoolFee === null || hostelFee === null) {
        toast.show('Please review your input, all field must be filed');
        setLoading(false);
        return;
      }

      let feeData = {
        schoolFee,
        hostelFee,
      };

      const feesRef = doc(db, 'fees', data[0].id);

      // set user data in firestore
      let userInfo = await setDoc(feesRef, feeData, {merge: true})
      toast.show('Fee saved successfull');
      navigation.goBack();
    } catch (e) {
      toast.show(e.message)
      console.log(e.message)
      setLoading(false)
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      <HeaderLite
        title={'Fees'}
        onPress={() => navigation.goBack()}
        description={'Fee structure'}
      />
      {/* <View style={styles.searchContainer}>
        <Input height={hp(48)} placeholder={'Search the list'} />
      </View> */}
      <ScrollView style={styles.content}>
        <Input
          label={'School fees'}
          placeholder={'Enter school fees'}
          onChangeText={(text) => setSchoolFee(text)}
          value={schoolFee}
          marginTop={hp(15)}
        />
        <Input
          label={'Hostel fee'}
          placeholder={'Enter hostel fee'}
          marginTop={hp(15)}
          value={hostelFee}
          onChangeText={(text) => setHostelFee(text)}
        />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button dark title={'Save'} loading={loading} onPress={handleSaveFees} />
      </View>
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

export default AdminFee;