import React from 'react';
import { ActivityIndicator, Dimensions, AppRegistry, Button, FormLabel, FormInput, FormValidationMessage, View, Text, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import {
    createAppContainer,
    DrawerIterms,
    SafeAreaView
  } from 'react-navigation';

import {createDrawerNavigator} from 'react-navigation-drawer';
import Event from '../screens/Event';
import CreateEvent from '../screens/CreateEvent';
import SettingsScreen from '../screens/SettingsScreen';

import MenuDrawer from '../components/MenuDrawer';

const WIDTH = Dimensions.get('window').width;

const DrawerConfig = {
    drawerWidth: WIDTH*0.83,
    contentComponent: ({ navigation }) => {
		return(<MenuDrawer navigation={navigation} />)
	}
}

  
const DrawerNavigator = createDrawerNavigator(
    {
    
        Home: {screen: Event},
        Settings: {screen: SettingsScreen}
    },
    DrawerConfig
);

export default createAppContainer(DrawerNavigator);