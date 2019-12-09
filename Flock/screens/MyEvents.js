import React from 'react';
import { ActivityIndicator, StyleSheet, AppRegistry, Button, FormLabel, FormInput, FormValidationMessage, View, Text, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import {Icon} from 'native-base'
import MenuButton from '../components/MenuButton';
import {styles} from '../styles';

export default class SettingsScreen extends React.Component{
  constructor(props) {
    super(props);
  }
  static navigationOptions = {
    drawerLabel: 'My Events',
    
  };

  render() {
    return (
    <View>
        <View>
        <Icon
          name="md-menu"
          color="#000000"
          size={32}
          style={styles.menuIcon}
          onPress={() => this.props.navigation.toggleDrawer()}
        />
        </View>
        <View style = {styles.header}>
            <Text style = {styles.headerText}>My Events</Text>
          </View>
    </View>);
  }
}