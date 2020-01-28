import * as Yup from "yup";
import { Formik } from "formik";
import { Container, Label } from "native-base";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import firebase from "../config/config";
import {
  StackActions,
  NavigationActions,
  withNavigation
} from "react-navigation";
import React, { Component, Fragment } from "react";
import PasswordInputText from "react-native-hide-show-password-input";
import {
  TextInput,
  Text,
  Image,
  StyleSheet,
  View,
  Alert,
  ToastAndroid,
  PermissionsAndroid
} from "react-native";
import { Divider, Input, Button } from "react-native-elements";
import Geolocation from "react-native-geolocation-service";
const Toast = props => {
  if (props.visible) {
    ToastAndroid.showWithGravityAndOffset(
      props.message,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      1,
      800
    );
    return null;
  }
  return null;
};
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: "",
      longitude: "",
      errorMessage: null,
      visible: false
    };
  }
  async componentDidMount() {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            this.setState({ latitude, longitude });
          },
          error => {
            this.setState(
              {
                errorMessage: "Check youre GPS",
                visible: true
              },
              () => {
                this.hideToast();
              }
            );
            return;
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
              this.setState({ latitude, longitude });
            },
            error => {
              this.setState(
                {
                  errorMessage: "Check your GPS",
                  visible: true
                },
                () => {
                  this.hideToast();
                }
              );
              return;
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        } else {
          this.setState(
            {
              errorMessage: "location denied",
              visible: true
            },
            () => {
              this.hideToast();
            }
          );
          return;
        }
      }
    } catch (err) {
      this.setState(
        {
          errorMessage: err,
          visible: true
        },
        () => {
          this.hideToast();
        }
      );
      return;
    }
  }
  getLogin = values => {
    console.log(this.state);

    firebase
      .auth()
      .signInWithEmailAndPassword(values.email, values.password)
      .then(response => {
        console.log(response.user.uid);
        firebase
          .database()
          .ref("user/" + response.user.uid)
          .update({
            online: "true",
            latitude: this.state.latitude || -7.7583,
            longitude: this.state.longitude || 110.378153,
          });
        Alert.alert(
          "Success",
          "hiHello there...",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            {
              text: "Ok",
              onPress: () => this.props.navigation.push("Chat")
            }
          ],
          { cancelable: false }
        );
      })
      .catch(error => {
        //error callback
        alert("Account not found");
        console.log("error ", error.message);
      });
  };
  hideToast = () => {
    this.setState({
      visible: false
    });
  };
  render() {
    return (
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={values => this.getLogin(values)}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .label("email")
            .email("Enter a valid email")
            .required("Please enter a registered email"),
          password: Yup.string()
            .label("password")
            .required()
            .min(6, "Password must have more than 6 characters ")
        })}
      >
        {({
          values,
          handleChange,
          errors,
          setFieldTouched,
          touched,
          isValid,
          setFieldValue,
          handleSubmit
        }) => (
          <Fragment>
            <ScrollView>
              <Container style={style.Login}>
                <Toast
                  visible={this.state.visible}
                  message={this.state.errorMessage}
                />
                <View style={style.logo}>
                  <Image
                    source={require("../assets/White_and_Red_Round_Fitness_Logo-removebg-preview.png")}
                    style={style.image}
                  />
                </View>
                <View style={style.form}>
                  <Label style={style.label}>
                    Get closer with your friend...
                  </Label>

                  <Input
                    placeholder="Your email here"
                    label="Email"
                    inputContainerStyle={{
                      marginLeft: 30,
                      marginRight: 50,
                      height: 35
                    }}
                    labelStyle={{
                      marginLeft: 30,
                      fontSize: 14,
                      color: "#008b8b",
                      marginTop: 30
                    }}
                    inputStyle={{
                      fontSize: 12
                    }}
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={() => setFieldTouched("email")}
                  />

                  {touched.email && errors.email && (
                    <Text style={style.erremail}>{errors.email}</Text>
                  )}

                  <Input
                    secureTextEntry={true}
                    placeholder="Your password here"
                    label="Password"
                    inputContainerStyle={{
                      marginLeft: 30,
                      marginRight: 50,
                      height: 35
                    }}
                    labelStyle={{
                      marginLeft: 30,
                      marginTop: 7,
                      fontSize: 14,
                      color: "#008b8b"
                    }}
                    inputStyle={{
                      fontSize: 12
                    }}
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={() => setFieldTouched("password")}
                  />
                  {touched.password && errors.password && (
                    <Text style={style.errpass}>{errors.password}</Text>
                  )}
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("ForgotPassword")
                    }
                  >
                    <Text style={style.forgot}>Forgot password ?</Text>
                  </TouchableOpacity>

                  <View>
                    <Button
                      title="Login"
                      titleStyle={{
                        fontSize: 14,
                        fontWeight: "normal"
                      }}
                      buttonStyle={style.loginButton}
                      disabled={!isValid}
                      onPress={handleSubmit}
                    />
                  </View>

                  <View
                    style={{ flexDirection: "row", justifyContent: "center" }}
                  >
                    <Text
                      style={{
                        color: "gray",
                        marginLeft: -30,
                        marginTop: 3,
                        fontSize: 12
                      }}
                    >
                      Do not have an account? Register{" "}
                    </Text>
                    <TouchableOpacity>
                      <Text
                        style={{
                          color: "#008b8b",
                          marginTop: 3,
                          textDecorationLine: "underline",
                          fontSize: 12,
                          fontWeight: "bold"
                        }}
                        onPress={() => {
                          const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                              NavigationActions.navigate({
                                routeName: "Register"
                              })
                            ]
                          });
                          this.props.navigation.dispatch(resetAction);
                        }}
                      >
                        here
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ marginTop: 30, marginLeft: -13 }}>
                  <Image
                    source={require("../assets/denimalz_sticker.png")}
                    style={{ width: 350, height: 120 }}
                  />
                </View>
                <View style={{ flexDirection: "column" }}>
                  <Text
                    style={{
                      color: "#008b8b",
                      fontStyle: "italic",
                      fontSize: 12,
                      marginTop: -110,
                      marginLeft: 40
                    }}
                  >
                    hollaaa
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: "#008b8b",
                      fontStyle: "italic",
                      fontSize: 12,
                      marginLeft: 80,
                      marginTop: -20
                    }}
                  >
                    hello!
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: "#008b8b",
                      fontStyle: "italic",
                      fontSize: 12,
                      marginLeft: 150,
                      marginTop: -50
                    }}
                  >
                    I'm here!!!
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: "#008b8b",
                      fontStyle: "italic",
                      fontSize: 12,
                      marginLeft: 210,
                      marginTop: -80
                    }}
                  >
                    where?
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: "#008b8b",
                      fontStyle: "italic",
                      fontSize: 12,
                      marginLeft: 270,
                      marginTop: -120
                    }}
                  >
                    ...hi
                  </Text>
                </View>
              </Container>
            </ScrollView>
          </Fragment>
        )}
      </Formik>
    );
  }
}

export default withNavigation(Login);

const style = StyleSheet.create({
  Login: {
    justifyContent: "center",
    // flex: 1,
    padding: wp("5%"),
    backgroundColor: "#f0f8ff"
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
    marginBottom: -20
  },
  forgot: {
    textAlign: "right",
    color: "grey",
    fontSize: 12,
    marginTop: 5
  },
  image: {
    // resizeMode: 'contain',
    width: 300,
    height: 300,
    marginTop: -20
  },
  label: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
    color: "#008b8b",
    fontWeight: "bold"
  },
  errpass: {
    fontSize: 10,
    color: "red"
  },
  erremail: {
    fontSize: 10,
    color: "red"
  },
  errrole: {
    fontSize: 10,
    color: "red"
  },
  // login: {
  //   flex: 1,
  // },
  form: {
    // marginTop: hp('-30%'),
    marginTop: -50
  },
  loginButton: {
    padding: 7,
    borderRadius: 10,
    backgroundColor: "#008b8b",
    marginTop: 10,
    marginLeft: 35,
    marginRight: 230
  }
});
