import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Avatar, Button} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Header, Left, Body, Title} from 'native-base';
import RNFetchBlob from 'react-native-fetch-blob';
import firebase from '../config/config';
import {Bubbles} from 'react-native-loader';

const storage = firebase.storage();

// Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const uploadImage = (uri, mime = 'application/octet-stream') => {
  return new Promise((resolve, reject) => {
    const uploadUri = uri;
    const sessionId = new Date().getTime();
    let uploadBlob = null;
    const imageRef = storage.ref('photo').child(`${sessionId}`);

    fs.readFile(uploadUri, 'base64')
      .then(data => {
        return Blob.build(data, {type: `${mime};BASE64`});
      })
      .then(blob => {
        uploadBlob = blob;
        return imageRef.put(blob, {contentType: mime});
      })
      .then(() => {
        uploadBlob.close();
        return imageRef.getDownloadURL();
      })
      .then(url => {
        resolve(url);
      })
      .catch(error => {
        reject(error);
      });
  });
};
export default class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      isLoading: false,
      isLoadingPhoto: false,
      isSelectedPhoto: 0,
      uri: '',
      fileName: '',
      photoErr: '',
      photo: '',
      name: '',
      phone: '',
      status: '',
      email: '',
      contacts: {},
      messages: {},
    };
    this.editPhoto = this.editPhoto.bind(this);
  }
  componentDidMount() {
    const id = firebase.auth().currentUser.uid;
    const db = firebase.database().ref('user/' + id);
    db.once('value').then(data => {
      const item = data.val();
      this.setState({
        photo: item.photo,
        name: item.name,
        phone: item.phone || '',
        status: item.status || '',
        email: item.email,
        contacts: item.contacts || {},
      });
    });
  }
  editPhoto() {
    const id = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref('user/' + id)
      .set({
        photo: this.state.photo,
        status: this.state.status,
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        contacts: this.state.contacts,
      })
      .then(data => {
        Alert.alert(
          'Are you sure?',
          'Your avatar will change',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                this.props.navigation.push('MyProfile');
              },
            },
          ],
          {cancelable: false},
        );
      })
      .catch(error => {
        //error callback
        alert(error);
        console.log('error ', error);
      });
  }
  UploadPhoto = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.fileSize > 10485760) {
        this.setState({
          photoErr: 'File too large max 10 MB',
        });
      }
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        this.setState({
          isLoadingPhoto: true,
        });
        uploadImage(response.uri)
          .then(url =>
            this.setState({
              photo: url,
              isSelectedPhoto: 1,
              isLoadingPhoto: false,
            }),
          )
          .catch(error => {
            console.log(error);
            this.setState({
              isLoadingPhoto: false,
            });
          });
      }
    });
  };

  render() {
    const {
      isLoading,
      photoErr,
      fileName,
      isSelectedPhoto,
      photo,
      isLoadingPhoto,
    } = this.state;
    setTimeout(
      function() {
        this.setState({isLoading: true});
      }.bind(this),
      2000,
    );
    return (
      <>
        <Header style={style.header}>
          <Left>
            <TouchableOpacity
              onPress={() => this.props.navigation.push('Chat')}>
              <Icon name="times" size={30} color="white" style={style.icon1} />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title style={style.title}>Edit Photo</Title>
          </Body>
        </Header>
        <View style={style.wrapper}>
          {!isLoading ? (
            <View style={style.loader}>
              <Bubbles size={10} style={style.loadBuble} color="#008b8b" />
            </View>
          ) : (
            <ScrollView>
              <View style={style.imageWrapper}>
                {isLoadingPhoto ? (
                  <ActivityIndicator />
                ) : (
                  <Avatar
                    rounded
                    source={
                      isSelectedPhoto
                        ? {uri: photo}
                        : photo === undefined
                        ? require('../assets/dummy.jpg')
                        : {uri: photo}
                    }
                    size="xlarge"
                    showEditButton
                    onPress={this.UploadPhoto}
                  />
                )}
                <Text style={style.textRequirement}>
                  Size: Up to 10 MB (.JPG .JPEG .PNG)
                </Text>

                <Text>{fileName}</Text>
                <Text style={style.textErr}>{photoErr}</Text>
              </View>
              <Button
                title="Update Picture"
                buttonStyle={style.button}
                onPress={this.editPhoto}
              />
            </ScrollView>
          )}
        </View>
      </>
    );
  }
}
const style = StyleSheet.create({
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  image: {
    resizeMode: 'contain',
    height: hp('50%'),
    width: wp('100%'),
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#faf0e6',
  },
  title: {
    fontWeight: 'bold',
    fontSize: wp('8%'),
    marginLeft: -60,
  },
  header: {
    backgroundColor: '#008b8b',
  },
  button: {
    // width: wp('50%'),
    alignSelf: 'center',
    backgroundColor: '#008b8b',
    borderRadius:10,
    marginLeft:100,
    marginRight:100,
    marginTop:-20,
  },
  textErr: {
    fontStyle: 'italic',
    color: 'red',
    marginTop: 15,
    alignItems: 'center',
  },
  textRequirement: {
    color: 'rgba(0,0,0,.5)',
    fontSize: wp('3%'),
    marginLeft: wp('3%'),
    marginTop: hp('5%'),
    textAlign: 'center',
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('40%'),
  },
  loadBuble: {marginTop: hp('50%')},
});
