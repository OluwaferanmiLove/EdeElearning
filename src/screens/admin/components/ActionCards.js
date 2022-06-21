import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../../constants/colors';
import { hp, wp } from '../../../util/dimension';
import Ionicons from '@expo/vector-icons/Ionicons';

function ActionCards({
  color = colors.primary,
  marginTop,
  title,
  value,
  iconName,
  onPress,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.actionCard, {borderColor: color, marginTop}]}>
        <View>
          <Text style={[styles.title, {color: color + 'aa'}]}>
            {title}
          </Text>
          <Text style={[styles.value, {color}]}>
            {value}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} color={color + '20'} size={wp(90)} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  actionCard: {
    flexDirection: 'row',
    borderRadius: wp(10),
    // borderWidth: wp(1),
    width: wp(160),
    backgroundColor: colors.inputBg + '30',
    paddingVertical: hp(30),
    paddingHorizontal: hp(15),
    overflow: 'hidden',
  },
  title: {
    fontSize: wp(18),
    fontWeight: '300',
    color: colors.primary
  },
  value: {
    fontSize: wp(36),
    fontWeight: '700',
    color: colors.primaryLighter
  },
  iconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
})

export default ActionCards;