import React from 'react';
//import react in project
import {StyleSheet, View, Text, Image} from 'react-native';
//import all the required component
import AppIntroSlider from 'react-native-app-intro-slider';
//import AppIntroSlider to use it
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
      //To show the main page of the app
    };
  }
  _onDone = () => {
    this.props.navigation.navigate('Login');
  };
  _onSkip = () => {
    this.props.navigation.navigate('Login');
  };
  _renderItem = ({item}) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: item.backgroundColor,
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingBottom: 100,
        }}>
        <Text style={styles.title}>{item.title}</Text>
        <Image style={styles.image} source={item.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };
  render() {
    //If false show the Intro Slides
    if (this.state.showRealApp) {
      //Real Application
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 50,
          }}>
          <Text>
            This will be your screen when you click Skip from any slide or Done
            button at last
          </Text>
        </View>
      );
    } else {
      //Intro slides
      return (
        <AppIntroSlider
          slides={slides}
          renderItem={this._renderItem}
          onDone={this._onDone}
          showSkipButton={true}
          onSkip={this._onSkip}
          bottomButton
        />
      );
    }
  }
}
const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
    marginBottom:-30,
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    paddingVertical: 30,
    fontStyle: 'italic',
  },
  title: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    marginTop:30,
  },
});

const slides = [
  {
    key: 's1',
    text: 'stay in touch with your friend',
    title: 'Welcome to hiHello',
    image: {
      uri:
        'https://pbs.twimg.com/media/DgAtUYFVAAA-yRK.png',
    },
    backgroundColor: '#20b2aa',
  },
  {
    key: 's2',
    title: 'Track Your Friend',
    text: 'know your friend location',
    image: {
      uri: 'https://pbs.twimg.com/media/DgAtWlBUwAA7nc2.png',
    },
    backgroundColor: '#f08080',
  },
  {
    key: 's3',
    title: 'Chat Your Friend',
    text: 'keep update your friend situation',
    image: {
      uri: 'https://pbs.twimg.com/media/DgAtVSzVMAAiP-F.png',
    },
    backgroundColor: '#cd5c5c',
  },
];
