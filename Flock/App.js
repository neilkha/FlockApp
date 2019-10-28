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
      <Text style={{font-family: 'Roboto'}}>Flock</Text>
      <Text>Find Activities. Make Friends </Text>

      <View style = {styles.form}>
        <Form type={User} />
      </View>

      <Text style={{color: 'blue'}}
        onPress={() => Linking.openURL('http://google.com')}>
        Forgot Password
      </Text>
      <Text style={{color: 'blue'}}
        onPress={() => Linking.openURL('http://google.com')}>
        Join the Community!
      </Text>
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
    alignItems: 'center',
    backgroundColor: 'salmon',
    padding: 10,
    
  },
  form: {

    
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
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
