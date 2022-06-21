import React from 'react';
import AppContextProvider from './src/context/AppContext';
import { ToastProvider } from 'react-native-toast-notifications';
import AUHighSchool from './src/navigation';
import { colors } from './src/constants/colors';
import { initializeApp } from "firebase/app";
import {hp} from './src/util/dimension';

export default function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyAoAo6Wfet8jZ0bGBFMwq9pIfzup3GccCU",
    authDomain: "edeelearning.firebaseapp.com",
    projectId: "edeelearning",
    storageBucket: "edeelearning.appspot.com",
    messagingSenderId: "183169719126",
    appId: "1:183169719126:web:9564c0d6d64902298f54f7"
  };

  initializeApp(firebaseConfig);

  return (
    <AppContextProvider>
      <ToastProvider
        placement="top"
        duration={2000}
        // successColor="green"
        // dangerColor="red"
        // warningColor="orange"
        // normalColor="#6610F2"
        normalColor={colors.primaryLighter}
        offsetTop={hp(40)}
        // renderType={{
        //   normal: (toast) => (
        //     <Toast text={toast.message} bgColor="#6610F2" />
        //   ),
        //   danger: (toast) => (
        //     <Toast text={toast.message} bgColor="#F83C33" />
        //   ),
        //   success: (toast) => (
        //     <Toast text={toast.message} bgColor="#45D988" />
        //   ),
        // }}
        swipeEnabled={true}>
        <AUHighSchool />
      </ToastProvider>
    </AppContextProvider>
  );
};
