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
import {
  Text,
  Image,
  StyleSheet,
  View,
  Alert,
  PermissionsAndroid,
  ToastAndroid
} from "react-native";
import { Divider, CheckBox, Input, Button } from "react-native-elements";
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
class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: "",
      longitude: "",
      errorMessage: null,
      visible: false
    };
    this.getSignUp = this.getSignUp.bind(this);
  }
  hideToast = () => {
    this.setState({
      visible: false
    });
  };
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
  getSignUp = values => {
    let rootRef = firebase.database().ref();
    rootRef
      .child("user")
      .orderByChild("email")
      .equalTo(values.email)
      .once("value")
      .then(snapshot => {
        if (snapshot.exists()) {
          let userData = snapshot.val();
          console.log(userData);
          Alert.alert("email is taken");
          return userData;
        } else {
          firebase
            .auth()
            .createUserWithEmailAndPassword(values.email, values.password)
            .then(() => {
              const id = firebase.auth().currentUser.uid;
              firebase
                .database()
                .ref("user/" + id)
                .set({
                  name: values.email.split("@")[0],
                  email: values.email,
                  status: "",
                  phone: "",
                  latitude: this.state.latitude || -7.758300,
                  longitude: this.state.longitude || 110.378153,
                  online: true
                })
                .then(data => {
                  //success callback
                  Alert.alert(
                    "Success",
                    "hihelllo there...",
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
                  alert(error);
                  console.log("error ", error);
                });
            })
            .catch(error => {
              return alert(error);
            });
        }
      })
      .catch(error => {
        return alert(error);
      });
  };

  render() {
    return (
      <Formik
        initialValues={{
          email: "",
          password: "",
          confirmPassword: "",
          agreeToTerms: false
        }}
        onSubmit={values => this.getSignUp(values)}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .label("email")
            .email("Enter a valid email")
            .required("Please enter a registered email"),
          password: Yup.string()
            .label("password")
            .required()
            .min(6, "Password must have more than 6 characters "),
          confirmPassword: Yup.string()
            .required()
            .label("Confirm password")
            .test("passwords-match", "Passwords must match ", function(value) {
              return this.parent.password === value;
            }),
          agreeToTerms: Yup.boolean().oneOf(
            [true],
            "Please check the agreement"
          )
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
                      marginLeft: 20,
                      marginRight: 30,
                      height: 35
                    }}
                    labelStyle={{
                      marginLeft: 20,
                      // marginTop:-30,
                      fontSize: 14,
                      color: "#008b8b"
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
                      marginLeft: 20,
                      marginRight: 30,
                      height: 35
                    }}
                    labelStyle={{
                      marginLeft: 20,
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

                  <Input
                    secureTextEntry={true}
                    placeholder="Confirm your password"
                    label="Password"
                    inputContainerStyle={{
                      marginLeft: 20,
                      marginRight: 30,
                      height: 35
                    }}
                    labelStyle={{
                      marginLeft: 20,
                      marginTop: 7,
                      fontSize: 14,
                      color: "#008b8b"
                    }}
                    inputStyle={{
                      fontSize: 12
                    }}
                    value={values.confirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={() => setFieldTouched("confirmPassword")}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={style.errpass}>{errors.confirmPassword}</Text>
                  )}
                  <CheckBox
                    checkedIcon="check-box"
                    iconType="material"
                    uncheckedIcon="check-box-outline-blank"
                    title="Agree to terms and conditions"
                    checkedTitle="You agreed to our terms and conditions"
                    checked={values.agreeToTerms}
                    onPress={() =>
                      setFieldValue("agreeToTerms", !values.agreeToTerms)
                    }
                    containerStyle={{
                      backgroundColor: "transparent",
                      borderRadius: 10,
                      marginLeft: 20,
                      marginRight: 45,
                      padding: 6
                    }}
                    textStyle={{
                      color: "#008b8b",
                      fontSize: 14,
                      fontStyle: "italic"
                    }}
                  />

                  {touched.agreeToTerms && errors.agreeToTerms && (
                    <Text style={style.textError}>{errors.agreeToTerms}</Text>
                  )}

                  <View>
                    <Button
                      title="Sign Up"
                      titleStyle={{
                        fontSize: 14,
                        fontWeight: "normal"
                      }}
                      buttonStyle={style.regisButton}
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
                        marginLeft: -60,
                        marginTop: 3,
                        fontSize: 12
                      }}
                    >
                      Already have an account? Login{" "}
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
                              NavigationActions.navigate({ routeName: "Login" })
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
              </Container>
            </ScrollView>
          </Fragment>
        )}
      </Formik>
    );
  }
}

export default withNavigation(SignUp);

const style = StyleSheet.create({
  Login: {
    justifyContent: "center",
    flex: 1,
    padding: wp("5%"),
    backgroundColor: "#f0f8ff"
  },
  textSignUp: {
    color: "white",
    textAlign: "center"
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: -80,
    marginBottom: 20
  },
  signup: {
    backgroundColor: "#ffffff",
    borderRadius: wp("3%"),
    borderWidth: wp("0.5%"),
    marginTop: hp("3%"),
    borderColor: "#6184f2"
  },
  signuptext: {
    color: "#6184f2"
  },
  signintext: {
    color: "#ffffff"
  },
  signin: {
    backgroundColor: "#6184f2",
    borderRadius: wp("3%"),
    marginTop: hp("3%")
  },
  forgot: { textAlign: "right", color: "grey" },
  image: {
    resizeMode: "contain",
    width: wp("80%"),
    marginTop: hp("-20%")
  },
  label: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
    color: "#008b8b",
    fontWeight: "bold",
    marginBottom: 30
  },
  errpass: { fontSize: 10, color: "red" },
  erremail: { fontSize: 10, color: "red" },
  errrole: { fontSize: 10, color: "red" },
  login: {
    flex: 1
  },
  form: {
    marginTop: hp("-30%")
  },
  regisButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#008b8b",
    marginTop: 10,
    marginLeft: 20,
    marginRight: 235
  }
});
