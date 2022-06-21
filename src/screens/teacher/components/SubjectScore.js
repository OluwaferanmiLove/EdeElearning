import React, { useState, useEffect, useContext } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { colors } from '../../../constants/colors';
import { hp, wp } from '../../../util/dimension';
import { useToast } from 'react-native-toast-notifications';
import DropDownPicker from 'react-native-dropdown-picker';
import { makeid } from '../../../util/util';
import { AppContext } from '../../../context/AppContext';

function SubjectScore({
  term,
  isVisible,
  studentData,
  onPressCancel,
  subject,
  clasName,
  navigation,
  exsitingData
}) {
  const [test, setTest] = useState(null);
  const [exam, setExam] = useState(null);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  const {state} = useContext(AppContext);

  const db = getFirestore();

  const adminsRef = query(collection(db, "users"), where("role", "==", 'teacher'));
  const scoreRef = query(collection(db, "scores"));

  useEffect(() => {
    console.log(exsitingData);
    if(exsitingData) {
      setTest(exsitingData.test);
      setExam(exsitingData.exam);
      setTotal(exsitingData.total);
    }
  }, [])

  useEffect(() => {
    const getTeacher = async () => {
      let teacher = await getDocs(scoreRef);
      let allData = teacher.docs.map((item) => {
        return {...item.data(), id: item.id};
      })
      // let allAdmins = teacher.docs.map((item) => {
      //   return {value: item.data(), label: item.data().firstName + ' ' + item.data().lastName};
      // })

      console.log(allData);
    }
  
    getTeacher();
  }, []);

  const userRef = collection(db, 'users')

  const toast = useToast()

  const handleAddData = async () => {
    // dispatch(login({role: 'student'}))
    try {
      setLoading(true);

      if (test === null || exam === null) {
        toast.show('Please review your input, all field must be filed');
        setLoading(false);
        return;
      }

      console.log(studentData)

      let data = {
        student: studentData,
        teacher: state.user,
        class: studentData.class,
        subject: subject,
        test,
        exam,
        total,
        term,
      }

      console.log(data);

      let scoresRef;

      if(exsitingData) {
        scoresRef = doc(db, 'scores', exsitingData.id);
      } else {
        scoresRef = doc(db, 'scores',makeid(16));
      }

      // set user data in firestore
      let dataInfo;
      if(exsitingData) {
        dataInfo = await setDoc(scoresRef, data, {merge: true});
      } else {
        dataInfo = await setDoc(scoresRef, data);
      }

      toast.show('Score updated added successfull');
      setExam(null);
      setTest(null);
      setTotal(null);
      onPressCancel();
      setLoading(false);
      // navigation.goBack();
    } catch (e) {
      toast.show(e.message)
      console.log(e.message)
      setLoading(false);
    }
  }

  return (
    <Modal
      isVisible={isVisible}
      coverScreen={false}
      hasBackdrop={true}
      backdropOpacity={0.5}
      swipeDirection={'down'}
      onSwipeComplete={onPressCancel}
      onBackdropPress={onPressCancel}
      animationIn="slideInUp"
      style={{
        // width: '100%',
        // bottom: 0,
        margin: 0,
        height: '100%',
        justifyContent: 'flex-end',
        // backgroundColor: colors.mainBg,
      }}>
      <View style={styles.main}>
        <View style={{ marginTop: hp(20), alignItems: 'center', paddingHorizontal: wp(20) }}>
          <View style={{ width: wp(120), height: hp(4), backgroundColor: '#eee', borderRadius: 999 }} />
        </View>
        <View style={styles.header}>
          <View style={{ marginTop: hp(25) }}>
            <Text style={styles.title}>Enter {term} term score</Text>
            <Text style={[styles.title, {fontWeight: 'normal'}]}>{studentData.lastName} {studentData.firstName}</Text>
          </View>
        </View>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ marginTop: hp(10) }}>
            <View style={styles.content}>
            </View>
            <View style={{ marginTop: hp(1) }}>
              <View style={styles.content}>
                <Input
                  label={'Test score'}
                  placeholder={'Enter score'}
                  // onChangeText={(text) => setTest(text)}
                  onChangeText={(text) => {
                    setTest(text);
                    let total;
                    if(exam !== null) {
                      total = parseInt(exam) + parseInt(text);
                      setTotal(total.toString());
                    }
                  }}
                  value={test}
                  keyboardType={'numeric'}
                  marginTop={hp(15)}
                />
                <Input
                  label={'Exam score'}
                  placeholder={'Enter score'}
                  onChangeText={(text) => {
                    setExam(text);
                    let total;
                    if(test !== null) {
                      total = parseInt(test) + parseInt(text);
                      setTotal(total.toString());
                    }
                  }}
                  keyboardType={'numeric'}
                  value={exam}
                  marginTop={hp(15)}
                />
                <Input
                  label={'Total'}
                  placeholder={'Total'}
                  onChangeText={(text) => setTotal(text)}
                  editable={false}
                  keyboardType={'numeric'}
                  value={total}
                  marginTop={hp(15)}
                />
              </View>
            </View>
            <View style={[styles.content, { marginTop: hp(35), paddingBottom: hp(30) }]}>
              <Button
                dark
                loading={loading}
                onPress={handleAddData}
                title={'Save score'} />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  main: {
    height: hp(500),
    backgroundColor: '#ffffff',
    borderTopRightRadius: wp(10),
    borderTopLeftRadius: wp(10),
  },
  header: {
    // flexDirection: 'row',
    alignItems: 'center',
    width: wp(375),
  },
  backBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: wp(45),
    width: wp(45),
    borderRadius: 9999,
    backgroundColor: colors.secondary
  },
  title: {
    fontSize: hp(20),
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '700',
  },
  description: {
    // fontFamily: 'ApparelDisplayBold',
    fontSize: hp(16),
    color: colors.secondaryDarker,
    marginTop: hp(4)
  },
  content: {
    alignItems: 'center',
    // marginTop: hp(20)
    // marginHorizontal: wp(20),
  },
  selectLabel: {
    fontSize: wp(18),
    fontWeight: 'bold',
    color: colors.primary,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    height: wp(130),
    width: wp(130),
    borderRadius: 9999,
    backgroundColor: colors.primary + 20,
  },
  image: {
    height: wp(130),
    width: wp(130),
    borderRadius: 9999,
    resizeMode: 'cover',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: hp(5)
  },
})

export default SubjectScore;