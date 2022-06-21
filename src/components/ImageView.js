import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { wp } from '../util/dimension';

function ImageView({
  image, width = wp(55), height =  wp(55)}) {
  return (
    <View style={[styles.imageContainer, {width, height}]}>
      <Image
        source={image}
        style={[styles.image, {width, height}]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    // width: wp(55),
    // height: wp(55),
    borderRadius: 99999,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  image: {
    // width: wp(55),
    // height: wp(55),
  },
})

export default ImageView;
