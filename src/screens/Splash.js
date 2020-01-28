import React, { useEffect } from "react";
import { View, StyleSheet, Image, Text, ImageBackground } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import firebase from "../config/config";
import { useNavigation } from "react-navigation-hooks";
import { Bubbles } from "react-native-loader";
const Splash = () => {
  const { navigate } = useNavigation();
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      navigate(user ? "Chat" : "Start");
    });
  });
  return (
    <ImageBackground
      source={require("../assets/rsz_1denimalz_dark_blue.jpg")}
      style={style.background}
    >
      <Image
        style={style.Logo}
        source={require("../assets/White_and_Red_Round_Fitness_Logo-removebg-preview.png")}
      />
      <View style={style.loader}>
        <Bubbles size={15} color="black" />
      </View>
    </ImageBackground>
  );
};

export default Splash;

const style = StyleSheet.create({
  loader: {
    marginTop: 60
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // height: 650,
    // width: '100%',
    resizeMode: "cover"
  },
  Logo: {
    width: "80%",
    height: "60%",
    marginTop: -265,
    // marginBottom:400,
  }
});
