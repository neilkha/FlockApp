import React from 'react'
import { View, Alert } from 'react-native'

export default class LogoutScreen extends React.Component {
    constructor(props){
        super(props);
        this.button = this.button.bind(this)
        this.button()
    }

    static navigationOptions = {
      drawerLabel: "Logout",
    }

    button() {
        Alert.alert(
            'Confirmation required',
            'Do you really want to logout?',
            [{text: 'Accept', onPress: () => {this.props.navigation.navigate('Login')}},
            {text: 'Cancel', onPress: () => {this.props.navigation.navigate('Home')}}]
        )
    }

    render () {
        return (
            <View></View>
        )
    }
  }