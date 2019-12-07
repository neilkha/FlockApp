import React from 'react';
import { ActivityIndicator, AppRegistry, Button, FormLabel, FormInput, FormValidationMessage, View, Text, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';

import MenuButton from '../components/MenuButton';

export default class CreateEvent extends React.Component{
    render() {
        return (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <MenuButton />
            <Text>Hello, world!</Text>
          </View>
        );
      }
}