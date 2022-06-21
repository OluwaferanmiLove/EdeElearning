import React, { useState, useEffect, useContext } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
import * as DocumentPicker from 'expo-document-picker';

function AddStudyMaterial({
  term,
  isVisible,
  studentData,
  onPressCancel,
  subject,
  className,
  course,
  navigation,
  exsitingData
}) {
  const [materialTitle, setMaterialTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [file, setFile] = useState({});

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  const { state } = useContext(AppContext);

  const db = getFirestore();

  const toast = useToast()

  const getDocument = async () => {
    let doc = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      multiple: false,
    });
    console.log(doc);
    setFile(doc);
  }

  const uploadfile = async (uri) => {
    try {
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      console.log(filename);

      const storage = getStorage();
      const storageRef = ref(storage, `images/${filename}`);

      // const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      const image = await fetch(uri);
      const imageBlob = await image.blob();

      // 'file' comes from the Blob or File API
      let imageUploadInfo = await uploadBytes(storageRef, imageBlob);

      let imageUrl = await getDownloadURL(imageUploadInfo.ref);
      console.log('File available at', imageUrl);
      // setImage(imageUrl);
      return imageUrl;
    } catch (error) {
      console.log(error)
    }
  };

  const handleAddData = async () => {
    // dispatch(login({role: 'student'}))
    try {
      setLoading(true);

      if (materialTitle === null || description === null) {
        toast.show('Please review your input, all field must be filed');
        setLoading(false);
        return;
      }

      const materialLink = await uploadfile(file.uri);

      console.log(studentData)

      let data = {
        materialTitle,
        description,
        materialLink,
        class: className,
        course: {
          courseCode: course.courseCode,
          courseTitle: course.courseTitle,
        },
      }

      console.log(data);

      let scoresRef;

      scoresRef = doc(db, 'materials', makeid(20));

      // set user data in firestore
      let dataInfo = await setDoc(scoresRef, data, { merge: true });

      toast.show('Material added successfull');
      onPressCancel();
      setFile({})
      setMaterialTitle(null);
      setDescription(null)
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
      <KeyboardAvoidingView style={styles.main} behavior={'padding'}>
        <View style={{ marginTop: hp(20), alignItems: 'center', paddingHorizontal: wp(20) }}>
          <View style={{ width: wp(120), height: hp(4), backgroundColor: '#eee', borderRadius: 999 }} />
        </View>
        <View style={styles.header}>
          <View style={{ marginTop: hp(25) }}>
            <Text style={styles.title}>Add Material</Text>
          </View>
        </View>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ marginTop: hp(10) }}>
            <View style={styles.content}>
            </View>
            <View style={{ marginTop: hp(1) }}>
              <View style={styles.content}>
                <View style={{ width: '100%', marginTop: hp(20), paddingHorizontal: wp(20) }}>
                  <View>
                    <Text style={styles.selectLabel}>Select Material(PDF)</Text>
                  </View>
                  <View style={{ width: '100%', marginTop: hp(20) }}>
                    <Button 
                      dark
                      outlined
                      title={file?.name ? file?.name : 'Select material'}
                      onPress={getDocument}
                      />
                  </View>
                </View>
                <Input
                  label={'Title of Material'}
                  placeholder={'Enter title of material'}
                  // onChangeText={(text) => setTest(text)}
                  onChangeText={(text) => setMaterialTitle(text)}
                  value={materialTitle}
                  marginTop={hp(15)}
                />
                <Input
                  label={'Description'}
                  placeholder={'file description'}
                  onChangeText={(text) => setDescription(text)}
                  value={description}
                  multiline
                  height={hp(90)}
                  marginTop={hp(15)}
                />
              </View>
            </View>
            <View style={[styles.content, { marginTop: hp(35), paddingBottom: hp(30) }]}>
              <Button
                dark
                loading={loading}
                onPress={handleAddData}
                title={'Add material'} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  main: {
    height: hp(770) - StatusBar.currentHeight,
    backgroundColor: '#ffffff',
    borderTopRightRadius: wp(30),
    borderTopLeftRadius: wp(30),
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

export default AddStudyMaterial;