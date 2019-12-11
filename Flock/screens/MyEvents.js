import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, AppRegistry, Button, FormLabel, FormInput, FormValidationMessage, View, Text, TextInput, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import {Icon} from 'native-base'
import MenuButton from '../components/MenuButton';
import {styles} from '../styles';
import UserProfile from '../UserProfile';
import globalVal from '../globalVal';
import { ListItem } from 'react-native-elements';
import IndvEvents from '../IndvEvent';

export default class MyEvents extends React.Component{
  constructor(props) {
    super(props);
    this.state = {eventList: [], hasFetched: false};
    this.renderEvents = this.renderEvents.bind(this)
    this.updateCommitStatus = this.updateCommitStatus.bind(this)
    this.renderEvents()
  }

  static navigationOptions = {
    drawerLabel: 'My Events',
    
  };
  // need to call API to search events currently attending

  updateCommitStatus(ID_in){
    let email = UserProfile.getEmail()
    let splitEmail = email.split('@')
    fetch('http://' + globalVal.ip_address + ':8000/events/updateEventStatus/' + splitEmail[0] + "/" + splitEmail[1] + "/",  {
      method: 'POST',
      body: JSON.stringify({
        eventID: ID_in,
        
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson['status_code'] == 200){
        
      }
      else{
        
      }
    })
    .then(() => {this.renderEvents()})
    .catch((error) =>{alert(error)})
  }; 

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

            // console.log("my events: ")
            // console.log(this.state.eventList)
        }
    })
    .catch((error) => {
        alert(error)
    });
  };

  FlatListItemSeparator = () => {
    return (
      <View style={{height: 0.5, width: '100%', backgroundColor: '#c8c8c8'}} />
    );
  };

  render() {
    // const keys = Object.keys(this.state.eventList)
    // const event_array = [];
    // for (let i = 0; i < this.state.eventList.length; i += 1){
    //   const indvEvent = this.state.eventList[i];
    //   const eventName = indvEvent.eventName;
    //   const eventDescription = indvEvent.eventDescription;
    //   const phone = indvEvent.phone;
    //   const event = <IndvEvents eventName={eventName} eventDescription={eventDescription} phone={phone} key={i} />;
    //   event_array.push(event);
    // }
    //setTimeout(this.renderEvents, 2000);
    // setInterval(this.renderEvents, 10000);
    if(this.props.navigation.getParam('refresh')){
      this.renderEvents();
      this.props.navigation.setParams({refresh: false})
    }
    return (
      <View style ={{flex: 1}}>
        <ScrollView>
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
            <View style={styles.MainContainer}>
              <View style = {{alignItems: 'center'}}>
              <Icon 
              
              name = "sync"
              size = {25}
              onPress = {() => {this.renderEvents()}}
              />
              </View>
              {this.state.hasFetched ? 
                <FlatList
                data={this.state.eventList}
                //data defined in constructor
                ItemSeparatorComponent={this.FlatListItemSeparator}
                //Item Separator View
                renderItem={({ item }) => (
                  // Single Comes here which will be repeatative for the FlatListItems
                  <View>
                    <Text style={styles.item}>
                      {item.eventName}
                      {"\n"}
                      {item.eventDescription}
                      {"\n"}
                      Hosted by: {item.host}
                      {"\n"}
                      Contact Info: {item.phone}
                      
                    </Text>
                    <TouchableOpacity style = {{backgroundColor: '#ff6969', alignItems: 'center', 
                           padding: 10, marginHorizontal: 120, marginBottom: 20, borderRadius: 50}} 
                          onPress = {() => {this.updateCommitStatus(item.eventID)}}>
                        <Text >Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              : <ActivityIndicator/> }
            </View>
          </ScrollView>

            {/* {this.state.hasFetched ?
              <View style={styles.container}>
                { this.state.eventList.map((item, key)=>(
                <Text key={key} style={styles.item}> 
                  { item } 
                </Text>))}
              </View>
            : <ActivityIndicator />} */}
      </View>
      );
  }
}

// const styles = StyleSheet.create({
//   MainContainer: {
//     justifyContent: 'center',
//     flex: 1,
//     marginLeft: 10,
//     marginRight: 10,
//     marginBottom: 10,
//     marginTop: 30,
//   },

//   item: {
//     padding: 10,
//     fontSize: 18,
//     height: 100,
//   },
// });