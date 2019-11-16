import React from 'react';
import { AppRegistry, Button, View, Text, TouchableOpacity } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import t from 'tcomb-form-native';
import {styles} from './styles.js'
import { LoginButton } from 'react-native-fbsdk';

var FBLoginButton = require('./FBLoginButton');

class SwipeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Will show events for user {this.props.navigation.getParam('user', 'default value')}</Text>
      </View>
    );
  }
}

class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {username: "", password: "", updated : false};
  }

  handleSubmit(){
    
    const value = this._form.getValue(); // use that ref to get the form value
    if(value == null){
      return;
    }
    this.props.navigation.navigate('UserEvents', {
      user: value.username
    })
  
  }

  render() {
    return (
      <View>
      
        <View style ={styles.header}>
          <Text style={{fontFamily: 'sans-serif', fontSize: 40}}>Flock</Text>
        </View>

        <View style = {styles.motto}>
          <Text style = {{fontFamily: 'sans-serif'}}>Find Activities. Make Friends </Text>
        </View>

        <FBLoginButton />

      
      </View>
      
    );
  }
}


const AppNavigator = createStackNavigator({
  Home: HomeScreen,
  UserEvents: SwipeScreen,
  // CreateEvent: EventScreen
},
{
  initialRouteName: 'Home'
});

export default createAppContainer(AppNavigator);