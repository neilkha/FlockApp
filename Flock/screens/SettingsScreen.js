import React from 'react';
import { ActivityIndicator, StyleSheet, AppRegistry, Button, FormLabel, FormInput, FormValidationMessage, View, Text, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import {Icon} from 'native-base'
import MenuButton from '../components/MenuButton';
export default class SettingsScreen extends React.Component{
  constructor(props) {
    super(props);
  }
  static navigationOptions = {
    drawerLabel: 'Notifications',
    
  };

  render() {
    return (
      <View style ={{flex: 1, backgroundColor: '#ff6969'}}>
      <Icon
				name="md-menu"
				color="#000000"
				size={32}
				style={styles.menuIcon}
				onPress={() => this.props.navigation.toggleDrawer()}
			/>
      </View>
    );
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
});
