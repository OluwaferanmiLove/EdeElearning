import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { hp, wp } from '../../util/dimension';
import { colors } from '../../constants/colors';
import Input from '../../components/Input';
import HeaderLite from '../../components/HeaderLite';
import Userlist from '../../components/Userlist';
import { users } from '../../constants/mockData';
import Button from '../../components/Button';
import { useToast } from 'react-native-toast-notifications';
import { collection, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { AppContext } from '../../context/AppContext';
import { WebView } from 'react-native-webview';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { makeid } from '../../util/util';

function ViewDoc({ navigation, route }) {
  const { state, dispatch } = useContext(AppContext);

  const toast = useToast();

  const docData = route.params;
  console.log(docData);

  const db = getFirestore();

  const handleDownload = async () => {
    // setLoading(true);
    try {
      const downloadInstance = FileSystem.createDownloadResumable(
        docData?.materialLink,
        FileSystem.documentDirectory + makeid(8) + 'Ede-ELearning.pdf'
      );
    
      const result = await downloadInstance.downloadAsync();

      const resultUrl = await FileSystem.copyAsync({
        from: result.uri,
        to: FileSystem.StorageAccessFramework.getUriForDirectoryInRoot('EdeElearning'),
      })

      console.log(resultUrl);

      toast.show('Download successfull');
    } catch (e) {
      // setLoading(false);
      console.log(e);
    }
  }

  return (
    <SafeAreaView style={styles.main}>
      <HeaderLite
        title={docData?.materialTitle}
        onPress={() => navigation.goBack()}
        // onPressRight={() => handleDownload()}
      />
      <WebView
        style={styles.container}
        source={{ uri: docData?.materialLink }}
        renderLoading={true}
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

export default ViewDoc;