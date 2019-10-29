/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
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

import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
const Form = t.form.Form;

const User = t.struct ({
  username: t.String,
  password: t.String,
});
const App: () => React$Node = () => {
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

     
      <TouchableOpacity style ={styles.button}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  button: {
    marginTop: 32,
    alignItems: 'center',
    backgroundColor: 'lightsalmon',
    padding: 10,
    
  },
  form: {
    marginTop: 32,
    
  },
  header: {
    marginTop: 20
  },
  links: {
    marginTop: 32,

  },
  motto: {
   color: 'blue'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
