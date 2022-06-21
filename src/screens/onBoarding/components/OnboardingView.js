import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { colors } from '../../../constants/colors';
import { hp, wp } from '../../../util/dimension';

function OnboardingView({ title, description, image }) {
  return (
    <View style={styles.main}>
      <ImageBackground source={image} resizeMode="cover" style={styles.imageBg}>
        <View style={styles.texts}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: wp(375),
  },
  imageBg: {
    // width={wp(375)} height={hp(812)}
    flex: 1,
  },
  background: {
    flex: 1,
    paddingHorizontal: wp(20)
  },
  texts: {
    alignItems: 'center',
    marginTop: hp(610),
  },
  title: {
    // fontFamily: 'ApparelDisplayBold',
    fontSize: wp(25),
    color: colors.secondary,
  },
  description: {
    // // fontFamily: 'ApparelDisplayBold',
    fontSize: wp(18),
    color: colors.secondaryDarker,
    marginTop: hp(11)
  },
})

export default OnboardingView;