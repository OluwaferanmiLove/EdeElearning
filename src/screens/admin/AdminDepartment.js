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
import AddDepartmentModal from './components/AddDepartmentModal';

function AdminDepartment({navigation}) {
  const [addAdminModal, setAddAdminModal] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const db = getFirestore();

  const adminsRef = query(collection(db, "departments"));

  useEffect(() => {
    const getAdmins = async () => {
      let admins = await getDocs(adminsRef);
      let allAdmins = admins.docs.map((item) => {
        return item.data();
      })
      setAdmins(allAdmins);
      console.log(allAdmins);
    }
  
    getAdmins();
  }, []);

  return (
    <SafeAreaView style={styles.main}>
      <HeaderLite title={'Department List'} onPress={() => navigation.goBack()} />
      {/* <View style={styles.searchContainer}>
        <Input height={hp(48)} placeholder={'Search the list'} />
      </View> */}
      <ScrollView style={styles.content}>
        {admins.map((item, index) => (
          <Userlist
            key={item.id}
            image={{ uri: item.image }}
            name={item.name}
            onPress={() => navigation.navigate('DepartmentAction', item)}
            description={item.school.schoolName} />
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button dark title={'Add new department'} onPress={() => setAddAdminModal(true)} />
      </View>
      <AddDepartmentModal navigation={navigation} isVisible={addAdminModal} onPressCancel={() => setAddAdminModal(false)} />
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

export default AdminDepartment;