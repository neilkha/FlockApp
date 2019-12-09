import React from 'react';
import { ActivityIndicator, StyleSheet, AppRegistry, Button, FormLabel, FormInput, FormValidationMessage, View, Text, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import {Icon} from 'native-base'
import MenuButton from '../components/MenuButton';

import {styles} from '../styles';
import UserProfile from '../UserProfile';
import { Formik } from 'formik';
import {CheckBox} from 'react-native-elements';

export default class EditProfile extends React.Component{
    constructor(props) {
      super(props);
      this.renderData = this.renderData.bind(this)
      this.state = {tags: {}, hasFetched: false};
      this.renderData()

    }
    static navigationOptions = {
      drawerLabel: 'Account Settings',
    };

    renderData(){
      let email = UserProfile.getEmail()
      let splitEmail = email.split('@')
      fetch('http://35.2.212.197:8000/tags/get/' + splitEmail[0] + "/" + splitEmail[1])
                .then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson.length == 0){
                        alert("No user with this tagID")
                    }
                    else{
                        for (var key in responseJson){
                          this.state.tags[key] = responseJson[key]
                        }
                        console.log(this.state.tags)
                        this.setState({hasFetched: true})
                    }
                })
                .catch((error) => {
                    alert(error)
                })
    }
  
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
          {this.state.hasFetched ? 
          <Formik
            initialValues={{firstName: '', lastName: '', email: '', phone: '', outdoor_adventures: this.state.tags['outdoor_adventures'], cooking: this.state.tags['cooking'], gaming: this.state.tags['gaming'], night_life: this.state.tags['night_life'], swimming: this.state.tags['swimming'], weight_lifting: this.state.tags['weight_lifting'], photography: this.state.tags['photography'], yoga: this.state.tags['yoga'], basketball: this.state.tags['basketball'], dancing: this.state.tags['dancing']}}
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

                    <View style ={{marginVertical: 10, marginHorizontal: 20}}>
                <Text>Tags:</Text>
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  checkedIcon='check-box'
                  iconType='material'
                  uncheckedIcon='check-box-outline-blank'
                  title='Outdoor Adventures'
                  checked={formikProps.values.outdoor_adventures}
                  onPress={() => {formikProps.setFieldValue('outdoor_adventures', !formikProps.values.outdoor_adventures)}}
                />
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  checkedIcon='check-box'
                  iconType='material'
                  uncheckedIcon='check-box-outline-blank'
                  title='Cooking'
                  checked={formikProps.values.cooking}
                  onPress={() => formikProps.setFieldValue('cooking', !this.state.tags['cooking'])}
                />
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  checkedIcon='check-box'
                  iconType='material'
                  uncheckedIcon='check-box-outline-blank'
                  title='Gaming'
                  checked={this.state.tags['gaming']}
                  onPress={() => formikProps.setFieldValue('gaming', !this.state.tags['gaming'])}
                />
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  checkedIcon='check-box'
                  iconType='material'
                  uncheckedIcon='check-box-outline-blank'
                  title='Night Life'
                  checked={this.state.tags['night_life']}
                  onPress={() => formikProps.setFieldValue('night_life', !this.state.tags['night_life'])}
                />
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  checkedIcon='check-box'
                  iconType='material'
                  uncheckedIcon='check-box-outline-blank'
                  title='Swimming'
                  checked={formikProps.values.swimming}
                  onPress={() => formikProps.setFieldValue('swimming', !formikProps.values.swimming)}
                />
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  checkedIcon='check-box'
                  iconType='material'
                  uncheckedIcon='check-box-outline-blank'
                  title='Weight Lifting'
                  checked={this.state.tags['weight_lifting']}
                  onPress={() => formikProps.setFieldValue('weight_lifting', !this.state.tags['weight_lifting'])}
                />
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  checkedIcon='check-box'
                  iconType='material'
                  uncheckedIcon='check-box-outline-blank'
                  title='Photography'
                  checked={formikProps.values.photography}
                  onPress={() => formikProps.setFieldValue('photography', !formikProps.values.photograph)}
                />
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  checkedIcon='check-box'
                  iconType='material'
                  uncheckedIcon='check-box-outline-blank'
                  title='Basketball'
                  checked={this.state.tags['basketball']}
                  onPress={() => formikProps.setFieldValue('basketball', !this.state.tags['basketball'])}
                />
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  checkedIcon='check-box'
                  iconType='material'
                  uncheckedIcon='check-box-outline-blank'
                  title='Yoga'
                  checked={this.state.tags['yoga']}
                  onPress={() => formikProps.setFieldValue('yoga', !this.state.tags['yoga'])}
                />
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  checkedIcon='check-box'
                  iconType='material'
                  uncheckedIcon='check-box-outline-blank'
                  title='Dancing'
                  checked={this.state.tags['dancing']}
                  onPress={() => formikProps.setFieldValue('dancing', !this.state.tags['dancing'])}
                /> 
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
          </Formik> : <ActivityIndicator />}
          </ScrollView>

        </View>
      );
    }
  }




