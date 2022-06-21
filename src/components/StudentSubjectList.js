import React from 'react';
import { Platform, StyleSheet, Text, View, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors } from '../constants/colors';
import { hp, wp } from '../util/dimension';
import { generateColor } from '../util/randomColor';
import ImageView from './ImageView';
import Ionicons from '@expo/vector-icons/Ionicons';

function StudentSubjectList({
  onPress,
  name,
  firstTerm,
  secondTerm,
  thirdTerm,
  total,
  onPressFirstTerm,
  onPressSecondTerm,
  onPressThirdTerm,
}) {
  return (
    // <TouchableOpacity onPress={onPress}>
      <View style={styles.userListContainer}>
        <View style={styles.mainContainer}>
          {/* <ImageView
            image={image}
          /> */}
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{name}</Text>
          </View>
          <View style={[styles.nameContainer, { flex: 0.25 }]}>
            <Text style={styles.name} numberOfLines={1} >{firstTerm}</Text>
          </View>
          <View style={[styles.nameContainer, { flex: 0.25 }]}>
            <Text style={styles.name}>{secondTerm}</Text>
          </View>
          <View style={[styles.nameContainer, { flex: 0.25 }]}>
            <Text style={styles.name}>{thirdTerm}</Text>
          </View>
          <View style={[styles.nameContainer, { flex: 0.25 }]}>
            <Text style={styles.name}>{total}</Text>
          </View>
        </View>
        <View style={{marginTop: hp(20), flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity onPress={onPressFirstTerm}>
            <View style={styles.iconContainer}>
              <Text style={[styles.name, {fontSize: wp(14)}]}>1st Term</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity  onPress={onPressSecondTerm}>
            <View style={styles.iconContainer}>
              <Text style={[styles.name, {fontSize: wp(14)}]}>2nd Term</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity  onPress={onPressThirdTerm}>
            <View style={styles.iconContainer}>
              <Text style={[styles.name, {fontSize: wp(14)}]}>3rd Term</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    // {/* </TouchableOpacity> */}
  );
}

export const styles = StyleSheet.create({
  userListContainer: {
    paddingVertical: hp(18),
    borderBottomColor: '#eee',
    borderBottomWidth: wp(1)
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameContainer: {
    flex: 1,
    // marginLeft: wp(10),
  },
  name: {
    fontSize: hp(18),
    fontWeight: '600',
    color: colors.primaryLighter,
  },
  description: {
    // // fontFamily: 'ApparelDisplayBold',
    fontSize: hp(16),
    color: colors.primaryLighter,
    textTransform: 'capitalize',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(100),
    height: wp(35),
    borderRadius: 7,
    backgroundColor: colors.primary + '30',
  },
})

export default StudentSubjectList;