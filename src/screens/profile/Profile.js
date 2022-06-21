import React, { useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { hp, wp } from '../../util/dimension';
import { colors } from '../../constants/colors';
import Input from '../../components/Input';
import HeaderLite from '../../components/HeaderLite';
import Userlist from '../../components/Userlist';
import { users } from '../../constants/mockData';
import Button from '../../components/Button';
import ImageView from '../../components/ImageView';
import ActionCard from '../../components/ActionCard';

function Profile({navigation, route}) {
  const [addAdminModal, setAddAdminModal] = useState(false);

  const userInfo = route.params;

  console.log(userInfo);

  return (
    <SafeAreaView style={styles.main}>
      <HeaderLite title={'Profile'} onPress={() => navigation.goBack()} />
      <View style={styles.content}>
        {/* <ImageView width={wp(150)} height={wp(150)} /> */}
        <View style={{marginTop: hp(10)}}>
          <Text style={styles.name}>{userInfo.firstName} {userInfo.lastName}</Text>
        </View>
        <View style={styles.roleContainer}>
          <Text style={styles.description}>{userInfo.role}</Text>
        </View>
        <View style={[styles.roleContainer, {backgroundColor: '#ffffff00'}]}>
          <Text style={styles.description}>{userInfo.email}</Text>
        </View>
        <View style={[styles.roleContainer, {backgroundColor: '#ffffff00'}]}>
          <Text style={styles.description}>{userInfo.class}</Text>
        </View>
        {/* <View style={{marginTop: hp(30)}}>
          <Text style={styles.name}>Actions</Text>
        </View>
        <View style={styles.actionContainer}>
          <ActionCard color={'#cc5500'} title={'Block User'} />
          <ActionCard color={'#ee7600'} title={'Block User'} />
          <ActionCard color={'#bb0a1e'} title={'Delete User'} />
          <ActionCard color={'#092e20'} title={'Unblock User'} marginTop={hp(20)} width={wp(335)} />
          <ActionCard color={'#bb0a1e'} title={'Delete User'} marginTop={hp(20)} />
        </View> */}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // marginHorizontal: wp(20),
  },
  content: {
    alignItems: 'center',
    marginTop: hp(20),
    paddingHorizontal: wp(20),
  },
  name: {
    fontSize: hp(20),
    fontWeight: '700',
    color: colors.primaryLighter,
  },
  roleContainer: {
    backgroundColor: colors.primary + 20,
    marginTop: hp(8),
    paddingVertical: wp(4),
    paddingHorizontal: wp(25),
    borderRadius: wp(9999)
  },
  description: {
    // // fontFamily: 'ApparelDisplayBold',
    textTransform: 'capitalize',
    fontSize: hp(16),
    color: colors.primaryLighter,
  },
  actionContainer: {
    // position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%',
    marginTop: hp(10),
    marginBottom: hp(25),
  },
})

export default Profile;