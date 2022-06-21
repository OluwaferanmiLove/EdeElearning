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

function Results({ navigation }) {
  const { state, dispatch } = useContext(AppContext);

  const [resultType, setResultType] = useState(null);
  const [subJects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState([]);

  const toast = useToast();

  const db = getFirestore();

  let className = state.user.class.substring(0,3) + state.user.class.substring(4,5);

  className = className.toLowerCase();

  const adminsRef = query(collection(db, "users"), where("role", "==", 'admin'));

  const dataRef = query(collection(db, "scores"), where("student.email", "==", state.user.email));
  const subjectRef = query(collection(db, "subjects"), where("class", "==", className));

  useEffect(() => {
    const unsubscribe = onSnapshot(dataRef, (querySnapshot) => {
      const allData = [];
      querySnapshot.forEach((doc) => {
        let singleData = {...doc.data(), id: doc.id};
        allData.push(singleData);
      });
      console.log(allData);
      setScores(allData);
    },
    (error) => {
      console.log(error);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(subjectRef, (querySnapshot) => {
      const allData = [];
      querySnapshot.forEach((doc) => {
        let singleData = {...doc.data(), id: doc.id};
        allData.push(singleData);
      });
      console.log(allData);
      setSubjects(allData);
    },
    (error) => {
      console.log(error);
    });
    
    return () => unsubscribe();
  }, []);

  const html = `
<html>
<head>
    <meta charset="utf-8">
    <title>Receipt page - Bootdey.com</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
    <link href="https://netdna.bootstrapcdn.com/bootstrap/3.3.6/scss/bootstrap.min.css" rel="stylesheet">
	<script src="https://netdna.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
</head>
<body>
<
<div id="invoice-POS">
  
  <center id="top">
    <div class="logo">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/auhighschool-70d8b.appspot.com/o/14707951_323481941350051_7489274773429529878_o-removebg-preview.png?alt=media&token=4209baa5-459f-4efc-a824-ab6352a1fd5d"
        style="width: 100px;" />
    </div>
    <div class="info"> 
      <h2>Adeleke University High School</h2>
      <h3 style="margin-top: 0; line-height: 0">P.O.Box 9, Old Osogbo Road Ede, Osun State</h3>
    </div><!--End Info-->
  </center><!--End InvoiceTop-->
  
  <div id="mid">
    <div class="info">
      <h2>Student Info</h2>
      <p> 
          Name : ${state.user.lastName} ${state.user.firstName}</br>
          Email   : ${state.user.email}</br>
          Class   : ${state.user.class.toUpperCase()}</br>
      </p>
    </div>
  </div><!--End Invoice Mid-->
  
  <div id="bot">

        <div id="table">
          <table width="100%">
            <tr class="tabletitle">
              <td class="item"><h3>Subject</h3></td>
              <td class="Hours"><h3>First term</h3></td>
              <td class="Rate"><h3>Second Term</h3></td>
              <td class="Rate"><h3>Third Term</h3></td>
              <td class="Rate"><h3>Total</h3></td>
            </tr>

            ${subJects.map((item) => {
              const filterScore = (term, subject) => {
                let newList = scores.filter(data => {
                  return data?.term === term && data?.subject === subject;
                });
            
                return newList;
              };

              let firstTerm = filterScore('1st', item.subject)[0]?.total ? filterScore('1st', item.subject)[0]?.total : 0
              let secondTerm = filterScore('2nd', item.subject)[0]?.total ? filterScore('2nd', item.subject)[0]?.total : 0
              let thirdTerm = filterScore('3rd', item.subject)[0]?.total ? filterScore('3rd', item.subject)[0]?.total : 0
              let total = parseInt(firstTerm) + parseInt(secondTerm) + parseInt(thirdTerm);
              return (
              `<tr class="service">
                <td class="tableitem"><p class="itemtext">${item.subject}</p></td>
                <td class="tableitem"><p class="itemtext">${firstTerm}</p></td>
                <td class="tableitem"><p class="itemtext">${secondTerm}</p></td>
                <td class="tableitem"><p class="itemtext">${thirdTerm}</p></td>
                <td class="tableitem"><p class="itemtext">${total}</p></td>
              </tr>
              `
            )})}

          </table>
        </div><!--End Table-->

        <div id="legalcopy">
        <p class="legal"><strong>Note!</strong>  This only generate result based on the available scores only. 
          </p>
        </div>

      </div><!--End InvoiceBot-->
</div><!--End Invoice-->


<style type="text/css">
#invoice-POS{
  // box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);
  padding:2mm;
  margin: 0 auto;
  // width: 44mm;
  background: #FFF;
  
  
::selection {background: #f31544; color: #FFF;}
::moz-selection {background: #f31544; color: #FFF;}
h1{
  font-size: 1.5em;
  color: #222;
}
h2{font-size: .9em;}
h3{
  font-size: 1.2em;
  font-weight: 300;
  line-height: 2em;
}
p{
  font-size: .7em;
  color: #666;
  line-height: 1.2em;
}
 
#top, #mid,#bot{ /* Targets all id with 'col-' */
  border-bottom: 1px solid #EEE;
}

#top{min-height: 100px;}
#mid{min-height: 80px;} 
#bot{ min-height: 50px; width: 100%}

#top .logo{
  //float: left;
	height: 60px;
	width: 60px;
	background: url(http://michaeltruong.ca/images/logo1.png) no-repeat;
	background-size: 60px 60px;
}
.clientlogo{
  float: left;
	height: 60px;
	width: 60px;
	background: url(http://michaeltruong.ca/images/client.jpg) no-repeat;
	background-size: 60px 60px;
  border-radius: 50px;
}
.info{
  display: block;
  //float:left;
  margin-left: 0;
}
.title{
  float: right;
}
.title p{text-align: right;} 
table{
  margin-top: 80px;
  width: 100vw;
  border-collapse: collapse;
}
td{
  //padding: 5px 0 5px 15px;
  //border: 1px solid #EEE
}
.tabletitle{
  //padding: 5px;
  font-size: .5em;
  background: #EEE;
}
.service{border-bottom: 1px solid #EEE;}
.item{width: 24mm;}
.itemtext{font-size: .5em;}

#legalcopy{
  margin-top: 5mm;
}

  
  
}
</style>

<script type="text/javascript">

</script>
</body>
</html>`

const printToFile = async () => {
  // On iOS/android prints the given html. On web prints the HTML from the current page.
  const { uri } = await Print.printToFileAsync({
    html
  });
  console.log('File has been saved to:', uri);
  await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
};

const print = async () => {
  // On iOS/android prints the given html. On web prints the HTML from the current page.
  await Print.printAsync({
    html,
  });
}

  return (
    <SafeAreaView style={styles.main}>
      <HeaderLite title={'Your Results'} onPress={() => navigation.goBack()} />
      {/* <View style={styles.searchContainer}>
        <Input height={hp(48)} placeholder={'Search the list'} />
      </View> */}
      <ScrollView style={styles.content}>
          {/* <Userlist
            onPress={() => {
              setResultType('First term')
              print();
            }}
            name={'First term'}
            description={'Print first term result'} /> */}
          <Userlist
            onPress={() => {
              setResultType('total')
              print();
            }}
            name={'Session result'}
            description={'Print session result'} />
      </ScrollView>
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

export default Results;