import React from 'react';
import {
  ProgressBarAndroid,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import t from 'tcomb-form-native';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {styles} from './styles.js'

const Form = t.form.Form;

const User = t.struct ({
  username: t.String,
  password: t.String,
});

class Load extends React.Component{
  constructor(props){
    super(props);
    this.state = {updated : false};
  }

  componentDidMount(){
    setInterval(() => { this.setState({updated: !this.state.updated}) }, 4000);
  }

  render(){
    if(this.state.updated){
      return (<ProgressBarAndroid />);
    }
    return (<Text> Hello </Text>)
  }
}
export default class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {username: "", password: "", updated : false};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){

  }
  handleSubmit(){
    this.setState({
      username: User.username,
      password: User.password
    });
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
    })
  }
  render(){
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

     
      <TouchableOpacity onPress = {this.handleSubmit} style ={styles.button}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
  }
  
};