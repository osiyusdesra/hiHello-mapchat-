import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  FlatList,
  Platform
} from "react-native";
import firebase from "../config/config";
import {
  Header,
  Left,
  Body,
  Title,
  Right,
  List,
  ListItem,
  Thumbnail,
  Button
} from "native-base";
import { request, PERMISSIONS } from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";
import ActionButton from "react-native-action-button";
import { withNavigation, ScrollView } from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/FontAwesome5";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { Bubbles } from "react-native-loader";
class Chat extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      userList: [],
      isLoading: false,
      search: "",
      latitude: null,
      longitude: null
    };
    this.logout = this.logout.bind(this);
  }
  logout = () => {
    Alert.alert(
      "Are you sure?",
      "You must Login again to access your account",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () =>
            Alert.alert("Success!", "hiHello will miss you", [
              {
                text: "OK",
                onPress: () => {
                  firebase.auth().signOut() &&
                    this.props.navigation.push("Start");
                }
              }
            ])
        }
      ],
      { cancelable: false }
    );
  };
  componentDidMount() {
    const id = firebase.auth().currentUser.uid;
    const db = firebase.database().ref("user/" + id);
    db.once("value").then(data => {
      const item = data.val();
      this.setState({
        latitude: item.latitude || -7.7583,
        longitude: item.longitude || 110.378153
      });
    });
    this.requestLocationPermissions(db);
    db.once("value").then(data => {
      const item = data.val();
      let contact = [];
      for (const key in item) {
        if (key === "contacts") {
          for (const i in item[key]) {
            contact.push(item[key][i]);
          }
        }
      }
      this.setState({
        userList: contact
      });
    });
  }
  requestLocationPermissions = async db => {
    if (Platform === "ios") {
      let response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (response === "granted") {
        this.locateCurrentLocation(db);
      }
    } else {
      let responsed = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (responsed === "granted") {
        this.locateCurrentLocation(db);
      }
    }
  };
  locateCurrentLocation = db => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position.coords);

        db.update({
          online: "true",
          latitude: parseFloat(position.coords.latitude) || this.state.latitude,
          longitude:
            parseFloat(position.coords.longitude) || this.state.longitude
        });
      },
      error => Alert.alert(error.message)
      // {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000},
    );
  };
  firstSearch() {
    const db = firebase.database().ref("/user");
    this.searchDirectory(db);
  }

  searchDirectory(itemsRef) {
    let search = this.state.search.toString();

    if (search === "") {
      this.listenForItems(itemsRef);
    } else {
      itemsRef
        .orderByChild("user")
        .startAt(search)
        .endAt(search)
        .on("value", snap => {
          let items = [];
          snap.forEach(child => {
            items.push({
              name: child.val().name,
              photo: child.val().photo,
              status: child.val().status,
              phone: child.val().phone
            });
          });
          this.setState({
            userList: items
          });
        });
    }
  }
  render() {
    const { isLoading } = this.state;
    setTimeout(
      function() {
        this.setState({ isLoading: true });
      }.bind(this),
      2000
    );
    return (
      <>
        <Header style={style.header}>
          <Left>
            <TouchableOpacity>
              <Image
                source={require("../assets/White_and_Red_Round_Fitness_Logo-removebg-preview.png")}
                style={style.image}
              />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title style={style.title}>Chat your friend</Title>
          </Body>
          <Right style={style.headerRight}>
            <TouchableOpacity
              onPress={() => this.props.navigation.push("MyProfile")}
            >
              <View style={style.topIcon}>
                <Icon2 name="user" style={style.actionButtonIcon1} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.logout}>
              <View style={style.topIcon}>
                <Icon name="md-power" style={style.actionButtonIcon1} />
              </View>
            </TouchableOpacity>
          </Right>
        </Header>
        <View style={style.outer}>
          <View style={style.SearchBar}>
            <TextInput
              // onChangeText={props.onChangeText}
              placeholder="Type here for search"
              onChangeText={text => this.setState({ search: text })}
              onSubmitEditing={() => this.firstSearch()}
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
          <View style={style.body}>
            {!isLoading ? (
              <View style={style.loader}>
                <Bubbles size={10} style={style.loadBuble} color="#008b8b" />
              </View>
            ) : (
              <FlatList
                style={{ flex: 1 }}
                data={this.state.userList}
                renderItem={({ item }) => (
                  <View style={style.list}>
                    <List>
                      <ListItem avatar>
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.push("Messages", {
                              id: item.idFriend,
                              name: item.name,
                              photo: item.photo
                                ? item.photo
                                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAQeOYC_Uqrxp5lVzs-DalVZJg3t6cCtAFyMHeI2NejPr1-TsUUQ&s",
                              status: item.status
                            });
                          }}
                        >
                          <Left>
                            <Thumbnail
                              source={
                                item.photo
                                  ? { uri: item.photo }
                                  : require("../assets/dummy.jpg")
                              }
                            />
                          </Left>
                        </TouchableOpacity>
                        <Body>
                          <Text>{item.name}</Text>
                          <Text note>{item.status}</Text>
                        </Body>
                      </ListItem>
                    </List>
                  </View>
                )}
                keyExtractor={item => item.idFriend.toString()}
              />
            )}
          </View>
        </ScrollView>
        <ActionButton buttonColor="#008b8b">
          <ActionButton.Item
            buttonColor="#f4a460"
            title="Add friend"
            onPress={() => this.props.navigation.push("AddFriends")}
          >
            <Icon name="md-person-add" style={style.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#bc8f8f"
            title="Contacts"
            onPress={() => this.props.navigation.push("Contacts")}
          >
            <Icon2 name="user-friends" style={style.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#fa8072"
            title="Maps"
            onPress={() => this.props.navigation.push("Maps")}
          >
            <Icon name="md-map" style={style.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </>
    );
  }
}
export default withNavigation(Chat);
const style = StyleSheet.create({
  body: {
    height: hp("100%"),
    backgroundColor: "#d3d3d3"
  },
  header: {
    backgroundColor: "#008b8b"
  },
  image: {
    width: wp("15%"),
    height: hp("15%"),
    marginLeft: -8
  },
  logoText: {
    color: "white"
  },
  title: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 18
  },
  icon: {
    color: "white"
  },
  actionButtonIcon: {
    fontSize: 20,
    height: hp("3%"),
    color: "white"
  },
  actionButtonIcon1: {
    fontSize: 25,
    height: hp("4%"),
    color: "white"
  },
  topIcon: {
    marginRight: wp("5%")
  },
  SearchBar: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: wp("10%"),
    height: hp("6%"),
    fontSize: wp("5%"),
    paddingLeft: wp("10%"),
    paddingRight: wp("3%"),
    backgroundColor: "white",
    marginHorizontal: wp("3%"),
    marginTop: hp("2%")
  },
  outer: {
    backgroundColor: "#d3d3d3"
  },
  icon1: {
    position: "absolute",
    left: 12
  },
  list: {
    marginLeft: wp("3%"),
    marginRight: wp("3%"),
    backgroundColor: "transparent"
  },
  item: {
    backgroundColor: "#ffebcd"
  },
  loader: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("40%")
  },
  loadBuble: { marginTop: hp("50%") }
});
