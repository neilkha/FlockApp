import React from 'react';
import { ActivityIndicator, StyleSheet, AppRegistry, Button, FormLabel, FormInput, FormValidationMessage, View, Text, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import {Icon} from 'native-base'
import MenuButton from '../components/MenuButton';
import UserProfile from '../UserProfile';
import { Formik } from 'formik';

export default class EditProfile extends React.Component{
    constructor(props) {
      super(props);
    }
    static navigationOptions = {
      drawerLabel: 'Edit Profile',
      
    };
  
    render() {
      return (
        <View style ={{}}>
          <ScrollView>
          <Icon
            name="md-menu"
            color="#000000"
            size={32}
            style={styles.menuIcon}
            onPress={() => this.props.navigation.toggleDrawer()}
          />
          <View style = {styles.header}>
            <Text style = {{textAlign: 'center',fontSize: 20}}>Edit Profile</Text>
          </View>
          <Formik
            initialValues={{firstName: '', lastName: '', email: '', phone: ''}}
            onSubmit={(values) =>{
                fetch('http://35.2.212.197:8000/user/set/', {
                    method: 'POST',
                    body: JSON.stringify({
                        firstName: values['firstName'],
                        lastName: values['lastName'],
                        email: values['email'],
                        phone: values['phone']
                    }),
                }).then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson['status'] == 'false'){
                        alert("Could not edit profile.")
                    }
                    else{
                        alert("Succesfully updated profile!")
                    }
                })
                .catch((error) => {
                    alert(error)
                })
            }}
          >
              {formikProps =>(
                  <React.Fragment>
                    <View style ={{marginTop: 30, marginVertical: -10, marginHorizontal: 20}}>
                        <Text>Name: </Text>
                        <TextInput placeholder={UserProfile.getName()}
                        style={{borderWidth: 1, borderColor: 'black', padding: 10}}
                        onChangeText={formikProps.handleChange("firstName")}
                        />
                        <Text style = {{color: 'red'}}>{formikProps.errors.firstName}</Text>
                    </View>

                    <View style ={{marginVertical: -10, marginHorizontal: 20}}>
                        <Text>Email: </Text>
                        <TextInput placeholder={UserProfile.getEmail()}
                        style={{borderWidth: 1, borderColor: 'black', paddingBottom: 10}}
                        onChangeText={formikProps.handleChange("email")}
                        />
                        <Text style = {{color: 'red'}}>{formikProps.errors.email}</Text>
                    </View>

                    <View style ={{marginVertical: -10, marginHorizontal: 20}}>
                        <Text>Phone Number: </Text>
                        <TextInput placeholder={UserProfile.getPhone()}
                        style={{borderWidth: 1, borderColor: 'black', paddingBottom: 10}}
                        onChangeText={formikProps.handleChange("phone")}
                        />
                        <Text style = {{color: 'red'}}>{formikProps.errors.phone}</Text>
                    </View>

                    {/* <View style ={{marginVertical: -10, marginHorizontal: 20}}>
                        <Text>Profile Picture: </Text>
                        <TextInput   
                        style={{borderWidth: 1, borderColor: 'black', paddingBottom: 10}}
                        onChangeText={formikProps.handleChange("picture")}
                        />
                        <Text style = {{color: 'red'}}>{formikProps.errors.picture}</Text>
                    </View> */}

                    <TouchableOpacity 
                        style = {{backgroundColor: '#ff6969', alignItems: 'center', 
                        justifyContent: 'center', padding: 10, marginVertical: 20, marginHorizontal: 50, borderRadius: 50}}
                        onPress ={formikProps.handleSubmit}>
                            <Text style = {{color: 'white'}}>Submit</Text>
                    </TouchableOpacity>
                  </React.Fragment>
              )}
          </Formik>
          </ScrollView>
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
      },
      header: {
          paddingTop: 20,
          paddingBottom: 5
      }
  });