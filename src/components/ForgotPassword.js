import * as Yup from 'yup';
import {Formik} from 'formik';
import {Button, Container, Label} from 'native-base';
import {ScrollView} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React, {Component, Fragment} from 'react';
import {TextInput, Text, Image, StyleSheet, View, Alert} from 'react-native';
import firebase from '../config/config';
class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  sendEmail = values => {
    Alert.alert(
      'Are you sure to submit?',
      'You will be getting email for reset password',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Ok',
          onPress: () => {
            firebase
              .auth()
              .sendPasswordResetEmail(values.email)
              .then(() => {
                this.props.navigation.push('Login');
              })
              .catch(error => {
                Alert.alert('Email is not registered');
              });
          },
        },
      ],
      {cancelable: false},
    );
  };
  render() {
    return (
      <Formik
        initialValues={{email: ''}}
        onSubmit={values => this.sendEmail(values)}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .label('email')
            .email('Enter a valid email')
            .required('Please enter a registered email'),
        })}>
        {({
          values,
          handleChange,
          errors,
          setFieldTouched,
          touched,
          isValid,
          setFieldValue,
          handleSubmit,
        }) => (
          <Fragment>
            <ScrollView>
              <Container style={style.container}>
                <View style={style.logo}>
                  <Image
                    source={require('../assets/White_and_Red_Round_Fitness_Logo-removebg-preview.png')}
                    style={style.image}
                  />
                </View>
                <View style={style.wrapper}>
                  <Label style={style.label}>Request New Password</Label>
                  <Text style={style.textNew}>
                    We will send you OTP code to resert your password. Make sure you input your valide email.
                  </Text>
                  <TextInput
                    value={values.email}
                    onChangeText={handleChange('email')}
                    placeholder="E-mail"
                    onBlur={() => setFieldTouched('email')}
                  />
                  {touched.email && errors.email && (
                    <Text style={style.erremail}>{errors.email}</Text>
                  )}
                  <Button
                    full
                    title="Submit"
                    disabled={!isValid}
                    onPress={handleSubmit}
                    style={style.submit}>
                    <Text style={style.submitText}>Submit</Text>
                  </Button>
                  <Button
                    full
                    title="Sign In"
                    onPress={() => this.props.navigation.navigate('Login')}
                    style={style.signin}>
                    <Text style={style.signintext}>Sign In</Text>
                  </Button>
                </View>
              </Container>
            </ScrollView>
          </Fragment>
        )}
      </Formik>
    );
  }
}

export default ForgotPassword;

const style = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexGrow: 1,
    padding: wp('5%'),
  },
  textSignUp: {
    color: 'white',
    textAlign: 'center',
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('-20%'),
  },
  submit: {
    backgroundColor: '#ffffff',
    borderRadius: wp('3%'),
    borderWidth: wp('0.5%'),
    marginTop: hp('3%'),
    borderColor: '#008b8b',
  },
  submitText: {
    color: '#008b8b',
  },
  signintext: {
    color: '#ffffff',
  },
  signin: {
    backgroundColor: '#008b8b',
    borderRadius: wp('3%'),
    marginTop: hp('3%'),
  },
  forgot: {textAlign: 'right', color: 'grey'},
  image: {resizeMode: 'contain', width: wp('60%'), marginTop: hp('-30%')},
  label: {fontSize: wp('5%'), textAlign: 'center'},
  wrapper: {marginTop: hp('-30%')},
  erremail: {fontSize: wp('3%'), color: 'red'},
  textNew: {
    fontSize: wp('3%'),
    textAlign: 'center',
    marginTop: hp('3%'),
    color: 'rgba(0,0,0,0.6)',
  },
});
