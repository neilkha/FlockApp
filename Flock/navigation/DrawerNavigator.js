import React from 'react';
import { ActivityIndicator, Dimensions, AppRegistry, Button, FormLabel, FormInput, FormValidationMessage, View, Text, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import {
    createAppContainer,
    DrawerIterms,
    SafeAreaView
  } from 'react-navigation';

import {createDrawerNavigator} from 'react-navigation-drawer';
import CreateEvent from '../screens/CreateEvent';
import SettingsScreen from '../screens/SettingsScreen';

import MenuDrawer from '../components/MenuDrawer';

const WIDTH = Dimensions.get('window').width;

const DrawerConfig = {
    drawerWidth: WIDTH*0.83,
  //   drawerPosition: 'left',
  //   contentComponent: ({ navigation }) => {
	// 	return(<MenuDrawer navigation={navigation} />)
	// }
}

  
const DrawerNavigator = createDrawerNavigator(
    {
    
        Home: {screen: CreateEvent},
        Settings: {screen: SettingsScreen}
    },
    DrawerConfig
    // {
    //   hideStatusBar: true,
    //   drawerBackgroundColor: 'rgba(255,255,255,.9)',
    //   overlayColor: '#6b52ae',
    //   contentOptions: {
    //     activeTintColor: '#fff',
    //     activeBackgroundColor: '#6b52ae',
    //   },
    // }
);

export default createAppContainer(DrawerNavigator);