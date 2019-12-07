import React from 'react';
import { ActivityIndicator, AppRegistry, Button, FormLabel, FormInput, FormValidationMessage, View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import {DrawerActions} from 'react-navigation-drawer';
import {Icon} from 'native-base'
// import MenuButton from '../components/MenuButton';

export default class Event extends React.Component{
    constructor(props) {
        super(props);
    }
    static navigationOptions = {
        drawerLabel: 'Home',
        
      };
    render(){
      let email = this.props.navigation.getParam('email', 'default value')
      let splitEmail = email.split('@')
      fetch('http://35.0.37.87:8000/events/getAvailable/' + splitEmail[0] + "/" + splitEmail[1])
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.length == 0){
          alert("There are no events to show")
        }
        else{
          for (var key in responseJson) {
            // check if the property/key is defined in the object itself, not in parent
            let eventID = responseJson[key]['eventID'];
            let eventName = responseJson[key]['eventName'];
            let eventDescription = responseJson[key]['eventDescription'];
            let picture = responseJson[key]['picture'];
          }
      }
  
      })
      .then(() => {})
      .catch((error) =>{
        alert(error)
      });
      return(
        <View style ={{flex: 1, backgroundColor: '#ff6969'}}>
          <Icon
				name="md-menu"
				color="#000000"
				size={32}
				style={styles.menuIcon}
				onPress={() => this.props.navigation.toggleDrawer()}
			/>
        </View>
          
      )
    }
  }
  const styles = StyleSheet.create({
	menuIcon: {
		zIndex: 9,
		position: 'absolute',
		top: 20,
        left: 20,
        backgroundColor: '#ff6969'
	}
})