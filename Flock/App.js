import React from 'react';
import { Button, View, Text, TouchableOpacity } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import t from 'tcomb-form-native';
import {styles} from './styles.js'
const Form = t.form.Form;

const User = t.struct ({
  username: t.String,
  password: t.String,
});
class SwipeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
      </View>
    );
  }
}
class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {username: "", password: "", updated : false};
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(){
    // this.setState({
    //   username: User.username,
    //   password: User.password
    // });
    fetch('http://0.0.0.0:8000/login/', {
      method: 'POST',
      body: JSON.stringify({
        user: this.state.username,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.username;
      this.props.navigation.navigate('UserEvents')
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

      <View style = {styles.form}>
        <Form type={User} />
      </View>


      <View style = {styles.links}>
        <Text style={{color: 'blue'}}
          onPress={() => Linking.openURL('http://google.com')}>
          Forgot Password
        </Text>
        <Text style={{color: 'blue'}}
          onPress={() => Linking.openURL('http://google.com')}>
          Join the Community!
        </Text>
      </View>

     
      <TouchableOpacity onPress={this.handleSubmit()} style ={styles.button}>
        <Text>Login</Text>
      </TouchableOpacity>
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