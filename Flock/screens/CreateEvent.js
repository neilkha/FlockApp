import React from 'react';
import { ActivityIndicator, StyleSheet,AppRegistry, Button, FormLabel, FormInput, FormValidationMessage, View, Text, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import {Icon} from 'native-base';
import MenuButton from '../components/MenuButton';
import {Formik } from 'formik';
import {CheckBox} from 'react-native-elements';
import ImagePicker from'react-native-image-picker';
import * as yup from 'yup';
import {styles} from '../styles';
import globalVal from '../globalVal';
import AppNavigator from '../App';
import UserProfile from '../UserProfile'


export default class CreateEvent extends React.Component{
  constructor(props) {
    super(props);
    this.handlePhotoUpload = this.handlePhotoUpload.bind(this)
    this.state = {photo: null}
  }

  static navigationOptions = {
    drawerLabel: 'Create Event',
    
  };

  handlePhotoUpload() {
    const options = {
      noData: false
    };
    
    ImagePicker.showImagePicker(options, (response) => {
      // console.log("response = ", response)
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        this.setState({
          photo: source,
        })
      }
    });
  };

  render() {
    const validationScheme = yup.object().shape({
      eventName: yup.string().required().label("Name"),
      eventDesc: yup.string().required().label("Description"),

    })
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
          <Text style = {styles.headerText}>Create an Event!</Text>
        </View>
        <Formik
          initialValues={{eventName: '', eventDesc: '', eventLocation: '', phone: '', outdoor_adventures: false, cooking: false, gaming: false, night_life: false, swimming: false, weight_lifting: false, photography: false, yoga: false, basketball: false, dancing: false}}
          onSubmit={(values) =>{
            let email_u = UserProfile.getEmail()
            fetch('http://' + globalVal.ip_address + ':8000/events/add/', {
              method: 'POST',
              body: JSON.stringify({
                eventName: values['eventName'],
                eventDesc: values['eventDesc'],
                eventLocation: values['eventLocation'],
                email: email_u,
                outdoor_adventures : values['outdoor_adventures'],
                cooking : values['cooking'],
                gaming : values['gaming'],
                night_life : values['night_life'],
                swimming : values['swimming'],
                weight_lifting : values['weight_lifting'],
                photography : values['photography'],
                yoga : values['yoga'],
                basketball : values['basketball'],
                dancing : values['dancing']
              }),
            }).then((response) => response.json())
            .then((responseJson) => {
              if(responseJson['status'] == 'false'){
                alert("Could not create event.")
              }
              else{
                alert("Succesfully created new event!")
                this.props.navigation.navigate('MyEvents', {refresh: true})
              }
            })
            .catch((error) =>{
              alert(error)
            })
          }}
          validationSchema = {validationScheme}
        >
          {formikProps =>(
            <React.Fragment>
              <View style ={{marginTop: 20, marginHorizontal: 20}}>
                
                <Text>Event Name</Text>
                <TextInput
                  style={{borderWidth: 1, borderColor: 'black', padding: 10}}
                  onChangeText={formikProps.handleChange("eventName")}
                />
                <Text style = {{color: 'red'}}>{formikProps.errors.eventName}</Text>
              </View>

              <View style ={{marginVertical: 10, marginHorizontal: 20}}>
                
                <Text>Describe Your Event: </Text>
                <TextInput 
                  style={{borderWidth: 1, borderColor: 'black', paddingBottom: 30}}
                  onChangeText={formikProps.handleChange("eventDesc")}
                />
                <Text style = {{color: 'red'}}>{formikProps.errors.eventDesc}</Text>
              </View>

              <View style={{ flex: 1, alignIterms: "center", justifyContent: "center"}}>
                <TouchableOpacity style = {{marginHorizontal: 120, padding: 10, borderRadius: 20, alignItems: 'center', backgroundColor: 'grey'}} onPress = {this.handlePhotoUpload}>
                  <Text style = {{color: 'white'}}>Choose Photo</Text>
                </TouchableOpacity>
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
                  onPress={() => formikProps.setFieldValue('cooking', !formikProps.values.cooking)}
                />
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  checkedIcon='check-box'
                  iconType='material'
                  uncheckedIcon='check-box-outline-blank'
                  title='Gaming'
                  checked={formikProps.values.gaming}
                  onPress={() => formikProps.setFieldValue('gaming', !formikProps.values.gaming)}
                />
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  checkedIcon='check-box'
                  iconType='material'
                  uncheckedIcon='check-box-outline-blank'
                  title='Night Life'
                  checked={formikProps.values.night_life}
                  onPress={() => formikProps.setFieldValue('night_life', !formikProps.values.night_life)}
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
                  checked={formikProps.values.weight_lifting}
                  onPress={() => formikProps.setFieldValue('weight_lifting', !formikProps.values.weight_lifting)}
                />
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  checkedIcon='check-box'
                  iconType='material'
                  uncheckedIcon='check-box-outline-blank'
                  title='Photography'
                  checked={formikProps.values.photography}
                  onPress={() => formikProps.setFieldValue('photography', !formikProps.values.photography)}
                />
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  checkedIcon='check-box'
                  iconType='material'
                  uncheckedIcon='check-box-outline-blank'
                  title='Basketball'
                  checked={formikProps.values.basketball}
                  onPress={() => formikProps.setFieldValue('basketball', !formikProps.values.basketball)}
                />
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  checkedIcon='check-box'
                  iconType='material'
                  uncheckedIcon='check-box-outline-blank'
                  title='Yoga'
                  checked={formikProps.values.yoga}
                  onPress={() => formikProps.setFieldValue('yoga', !formikProps.values.yoga)}
                />
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  checkedIcon='check-box'
                  iconType='material'
                  uncheckedIcon='check-box-outline-blank'
                  title='Dancing'
                  checked={formikProps.values.dancing}
                  onPress={() => formikProps.setFieldValue('dancing', !formikProps.values.dancing)}
                />
              </View>

              <TouchableOpacity 
                  style = {{backgroundColor: '#ff6969', alignItems: 'center', 
                  justifyContent: 'center', padding: 10, marginVertical: 20, marginHorizontal: 120, borderRadius: 50}}
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
