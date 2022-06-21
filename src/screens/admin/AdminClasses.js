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
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import ClassCard from '../../components/ClassCard';
import AddClassModal from './components/AddClassModal';

function AdminClasses({navigation}) {
  const [addClassModal, setAddAdminModal] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const db = getFirestore();

  const dataRef = query(collection(db, "classes"));

  useEffect(() => {
    const getData = async () => {
      let data = await getDocs(dataRef);
      let allData = data.docs.map((item) => {
        return item.data();
      })
      setData(allData);
      console.log(allData);
    }
  
    getData();
  });

  return (
    <SafeAreaView style={styles.main}>
      <HeaderLite title={'Classes'} onPress={() => navigation.goBack()} />
      {/* <View style={styles.searchContainer}>
        <Input height={hp(48)} placeholder={'Search the list'} />
      </View> */}
      <ScrollView style={styles.content}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
          {data.map((item, index) => (
            <ClassCard 
              title={item.className}
              value={item.numberStudents}
              onPress={() => navigation.navigate('StudentList', item)}
              marginTop={index !== 0 && index !== 1 ? hp(25) : 0}
            />
          ))}
        </View>
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

export default AdminClasses;