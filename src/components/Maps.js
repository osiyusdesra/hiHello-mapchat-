import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Header, Left, Body, Title} from 'native-base';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import firebase from '../config/config';
import Carousel from 'react-native-snap-carousel';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS} from 'react-native-permissions';
import Icon from 'react-native-vector-icons/FontAwesome5';
export default class Maps extends Component {
  constructor() {
    super();
    this.state = {
      latitude: '',
      longitude: '',
      name: '',
      photo: '',
      search: '',
      region: {},
      listFriend: [],
      markers: [],
      isLoading: false,
    };
  }
  componentDidMount() {
    this.requestLocationPermissions();
    const id = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref('user/' + id)
      .once('value')
      .then(items => {
        const user = items.val();
        this.setState({
          name: user.name,
          photo: user.photo,
          latitude: user.latitude,
          longitude: user.longitude,
        });
      });
    const db = firebase.database().ref('user/' + id);
    db.once('value').then(data => {
      const item = data.val();
      let contact = [];
      for (const key in item) {
        if (key === 'contacts') {
          for (const i in item[key]) {
            contact.push(item[key][i]);
          }
        }
      }
      this.setState({
        listFriend: contact,
      });
    });
  }
  requestLocationPermissions = async () => {
    if (Platform === 'ios') {
      let response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (response === 'granted') {
        this.locateCurrentLocation();
      }
    } else {
      let responsed = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (responsed === 'granted') {
        this.locateCurrentLocation();
      }
    }
  };
  locateCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        let region = {
          latitude: parseFloat(position.coords.latitude),
          longitude: parseFloat(position.coords.longitude),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        this.setState({
          region,
        });
      },
      error => Alert.alert(error.message),
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000},
    );
  };
  onCarouselItemChange = index => {
    let location = this.state.listFriend[index];

    this._map.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    this.state.markers[index].showCallout();
  };
  renderCarouselItem = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        this.props.navigation.push('Messages', {
          id: item.idFriend,
          name: item.name,
          status: item.status || '',
          photo:
            item.photo ||
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAQeOYC_Uqrxp5lVzs-DalVZJg3t6cCtAFyMHeI2NejPr1-TsUUQ&s',
        })
      }>
      <View style={style.cardContainer}>
        <Text style={style.cardTitle}>{item.name}</Text>
        <Text style={style.cardTitle}>{item.status}</Text>
        <Image
          style={style.cardImage}
          source={
            item.photo
              ? {uri: item.photo}
              : {
                  uri:
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAQeOYC_Uqrxp5lVzs-DalVZJg3t6cCtAFyMHeI2NejPr1-TsUUQ&s',
                }
          }
        />
      </View>
    </TouchableOpacity>
  );
  render() {
    const {listFriend, region} = this.state;
    return (
      <>
        <View style={style.container}>
          <Header style={style.header}>
            <Left>
              <TouchableOpacity
                onPress={() => this.props.navigation.push('Chat')}>
                <Icon
                  name="arrow-left"
                  size={30}
                  color="white"
                  style={style.icon1}
                />
              </TouchableOpacity>
            </Left>
            <Body>
              <Title style={style.title}>hiHello</Title>
            </Body>
          </Header>
          <MapView
            style={{flex: 1}}
            ref={map => (this._map = map)}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            initialRegion={
              region.latitude !== undefined
                ? region
                : {
                    latitude: -7.758300,
                    longitude: 110.378153,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }
            }>
            {listFriend.length !== 0
              ? listFriend.map((item, index) => (
                  <Marker
                    key={index}
                    ref={ref => (this.state.markers[index] = ref)}
                    title={item.name}
                    description={item.phone}
                    onCalloutPress={() =>
                      this.props.navigation.push('DetailFriend', {
                        id: item.idFriend,
                      })
                    }
                    coordinate={{
                      latitude: Number(item.latitude),
                      longitude: Number(item.longitude),
                    }}
                  />
                ))
              : null}
          </MapView>
          <Carousel
            ref={c => {
              this._carousel = c;
            }}
            data={this.state.listFriend}
            containerCustomStyle={style.Carousel}
            renderItem={this.renderCarouselItem}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={200}
            removeClippedSubviews={false}
            onSnapToItem={index => this.onCarouselItemChange(index)}
          />
        </View>
      </>
    );
  }
}
const style = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  Carousel: {
    position: 'absolute',
    bottom: 0,
  },
  cardContainer: {
    backgroundColor: '#008b8b',
    height: 250,
    width: 200,
    padding: 13,
    borderRadius: 25,
  },
  cardImage: {
    height: 200,
    width: 200,
    bottom: 0,
    position: 'absolute',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  cardTitle: {
    color: 'white',
    fontSize: 22,
    alignSelf: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: wp('8%'),
    marginLeft: -50,
  },
  header: {
    backgroundColor: '#008b8b',
  },
});
