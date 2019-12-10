import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, AppRegistry, Button, FormLabel, FormInput, FormValidationMessage, View, Text, TextInput, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import {Icon} from 'native-base'
import MenuButton from '../components/MenuButton';
// import {styles} from '../styles';
import UserProfile from '../UserProfile';
import globalVal from '../globalVal';
import { ListItem } from 'react-native-elements';
import IndvEvents from '../IndvEvent';

export default class MyEvents extends React.Component{
  constructor(props) {
    super(props);
    this.state = {eventList: [], hasFetched: false};
    this.renderEvents = this.renderEvents.bind(this)
    this.renderEvents()
  }

  static navigationOptions = {
    drawerLabel: 'My Events',
    
  };
  // need to call API to search events currently attending

  renderEvents(){
    let email = UserProfile.getEmail()
    let splitEmail = email.split('@')
    fetch('http://' + globalVal.ip_address + ':8000/events/getStatusEvents/' + splitEmail[0] + "/" + splitEmail[1] + "/")
    .then((response) => response.json())
    .then((responseJson) => {
        if(responseJson.length == 0){
            alert("User has no events")
        }
        else{
            var temp = [];
            for (var key in responseJson){
              temp.push(responseJson[key])
              // const temp = {};
              // temp['eventDescription'] = responseJson[key]['eventDescription'];
              // temp['eventName'] = responseJson[key]['eventName'];
              // temp['picture'] = responseJson[key]['picture'];
              // const x = this.state.eventList;
              // x.push(temp);
              // this.setState({ eventList: x });
            }
            this.setState({hasFetched: true})
            this.setState({eventList: temp})

            console.log("my events: ")
            console.log(this.state.eventList)
        }
    })
    .catch((error) => {
        alert(error)
    });
  };

  render() {
    const keys = Object.keys(this.state.eventList)
    const event_array = [];
    for (let i = 0; i < this.state.eventList.length; i += 1){
      const indvEvent = this.state.eventList[i];
      const eventName = indvEvent.eventName;
      const eventDescription = indvEvent.eventDescription;
      const phone = indvEvent.phone;
      const event = <IndvEvents eventName={eventName} eventDescription={eventDescription} phone={phone} key={i} />;
      event_array.push(event);
    }
    return (
      <View style ={{flex: 1}}>
          <Icon
              name="md-menu"
              color="#000000"
              size={32}
              style={styles.menuIcon}
              onPress={() => this.props.navigation.toggleDrawer()}
            />
            <View style = {styles.header}>
                <Text style = {styles.headerText}>My Events</Text>
            </View>

            {this.state.hasFetched ?
              <View style={styles.container}>
                { this.state.eventList.map((item, key)=>(
                <Text key={key} style={styles.item}> 
                  { item } 
                </Text>))}
              </View>
            : <ActivityIndicator />}
      </View>
      );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 30,
  },

  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});