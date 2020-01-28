import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import firebase from '../config/config';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import {
  Header,
  Left,
  Body,
  Title,
  Right,
  List,
  ListItem,
  Thumbnail,
} from 'native-base';
import {withNavigation, ScrollView, FlatList} from 'react-navigation';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Bubbles} from 'react-native-loader';
class Chat extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      search: '',
      listFriend: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    const id = firebase.auth().currentUser.uid;
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
  render() {
    const {listFriend, isLoading} = this.state;
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
              <Icon1 name="times" size={30} color="white" style={style.icon} />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title style={style.title}>Contacts</Title>
          </Body>
          <Right style={style.headerRight}>
            <TouchableOpacity
              onPress={() => this.props.navigation.push('AddFriends')}>
              <View style={style.topIcon}>
                <Icon2 name="user-plus" style={style.actionButtonIcon1} />
              </View>
            </TouchableOpacity>
          </Right>
        </Header>
        <View style={style.outer}>
          <View style={style.SearchBar}>
            <TextInput
              // onChangeText={props.onChangeText}
              placeholder="Type here for search"
            />
            <Icon
              name="md-search"
              size={30}
              color="#194d33"
              style={style.icon1}
            />
          </View>
        </View>
        <ScrollView>
          {!isLoading ? (
            <View style={style.loader}>
              <Bubbles size={10} style={style.loadBuble} color="#008b8b" />
            </View>
          ) : (
            <FlatList
              data={listFriend}
              renderItem={({item}) => (
                <List style={style.list}>
                  <ListItem avatar>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.push('Messages', {
                          id: item.idFriend,
                          name: item.name,
                          photo: item.photo
                            ? item.photo
                            : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAQeOYC_Uqrxp5lVzs-DalVZJg3t6cCtAFyMHeI2NejPr1-TsUUQ&s',
                          status: item.status,
                        });
                      }}>
                      <Left>
                        <Thumbnail
                          source={
                            item.photo
                              ? {uri: item.photo}
                              : require('../assets/dummy.jpg')
                          }
                        />
                      </Left>
                    </TouchableOpacity>
                    <Body>
                      <Text>{item.name}</Text>
                      <Text note>{item.phone}</Text>
                    </Body>
                  </ListItem>
                </List>
              )}
              keyExtractor={item => item.idFriend.toString()}
            />
          )}
        </ScrollView>
      </>
    );
  }
}
export default withNavigation(Chat);
const style = StyleSheet.create({
  body: {
    backgroundColor: '#ffebcd',
  },
  header: {
    backgroundColor: '#008b8b',
  },
  image: {
    width: wp('8%'),
    height: hp('4%'),
  },
  logoText: {
    color: 'white',
  },
  title: {
    fontWeight: 'bold',
  },
  icon: {
    color: 'white',
  },
  icon1: {
    position: 'absolute',
    left: 12,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: hp('3%'),
    color: 'white',
  },
  actionButtonIcon1: {
    fontSize: 20,
    height: hp('4%'),
    color: 'white',
  },
  topIcon: {
    marginRight: wp('5%'),
  },
  SearchBar: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: wp('10%'),
    height: hp('6%'),
    fontSize: wp('5%'),
    paddingLeft: wp('10%'),
    paddingRight: wp('3%'),
    backgroundColor: 'white',
    marginHorizontal: wp('3%'),
    marginTop: hp('2%'),
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('40%'),
  },
  loadBuble: {marginTop: hp('50%')},
});
