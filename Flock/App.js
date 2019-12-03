import React from 'react';
import { ActivityIndicator, AppRegistry, Button, FormLabel, FormInput, FormValidationMessage, View, Text, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Formik } from 'formik';
import {styles} from './styles.js';
import * as yup from 'yup';
import { thisExpression } from '@babel/types';
import Swipe from './swipe';
// import {SwipeScreen} from './screens/SwipeScreen'

//var FBLoginButton = require('./FBLoginButton');

class NativeLoginScreen extends React.Component{
  
  constructor(props) {
		super(props);
		this.state = {
			form: {
				firstName: null,
				email: null
			},
			isValid: false
		};
		this.onChange = this.onChange.bind(this)
  }
  onChange({updateData}){
		this.setState({ form: updateData })
	}
  render(){
    const validationScheme = yup.object().shape({
      firstName: yup.string().required().label("Name"),
      lastName: yup.string().required().label("Last Name"),
      email: yup.string().required().email().label("Email"),
      pword: yup.string().required().label("Password").min(2, 'Password too short, try again').max(20, 'Too long idiot'),
      phone: yup.number().required().label("Phone Number")
    })
    return(
      <View>
        <ScrollView>
        <Formik
          initialValues={{firstName :'', lastName: '', email: '', pword: '', phone: ''}}
          onSubmit={(values) =>{
            //alert(JSON.stringify(values))
            fetch('http://10.0.0.25:8000/user/create/', {
              method: 'POST',
              body: JSON.stringify({
                firstName: values['firstName'],
                lastName: values['lastName'],
                email: values['email'],
                pword: values['pword'],
                phone: values['phone']
              }),
            }).then((response) => response.json())
            .then((responseJson) => {
              if(responseJson['status'] == "false"){
                alert("A user already exists with the email " + values['email'] + ". Please try again with another email.")
              }
              //alert("hello")
              //alert(responeJson.code)
            })
            .catch((error) =>{
              alert(error)
            });
          }}
          validationSchema = {validationScheme}
        >
          {formikProps =>(
            <React.Fragment>
              <View style ={{padding: 20, backgroundColor: '#ff6969', alignItems: 'center'}}>
                <Text>Take Your First Step In Finding Events</Text>
              </View>
              <View style ={{marginVertical: 10, marginHorizontal: 20}}>
                
                <Text>First Name</Text>
                <TextInput placeholder ="Jane" 
                  style={{borderWidth: 1, borderColor: 'black', padding: 10}}
                  onChangeText={formikProps.handleChange("firstName")}
                />
                <Text style = {{color: 'red'}}>{formikProps.errors.firstName}</Text>
              </View>

              <View style ={{marginVertical: 10, marginHorizontal: 20}}>
                
                <Text>Last Name</Text>
                <TextInput placeholder ="Doe" 
                  style={{borderWidth: 1, borderColor: 'black', padding: 10}}
                  onChangeText={formikProps.handleChange("lastName")}
                />
                <Text style = {{color: 'red'}}>{formikProps.errors.lastName}</Text>
              </View>

              <View style ={{marginVertical: 10, marginHorizontal: 20}}>
                <Text>Email</Text>
                <TextInput placeholder ="janedoe@gmail.com" 
                  style={{borderWidth: 1, borderColor: 'black', padding: 10}}
                  onChangeText={formikProps.handleChange("email")}
                />
                <Text style = {{color: 'red'}}>{formikProps.errors.email}</Text>
              </View>
              <View style ={{marginVertical: 10, marginHorizontal: 20}}>
                <Text>Password</Text>
                <TextInput placeholder ="password" 
                  style={{borderWidth: 1, borderColor: 'black', padding: 10}}
                  onChangeText={formikProps.handleChange("pword")}
                  secureTextEntry
                />
                <Text style = {{color: 'red'}}>{formikProps.errors.pword}</Text>
              </View>

              <View style ={{marginVertical: 10, marginHorizontal: 20}}>
                <Text>Phone Number</Text>
                <TextInput placeholder ="123-456-7890" 
                  style={{borderWidth: 1, borderColor: 'black', padding: 10}}
                  onChangeText={formikProps.handleChange("phone")}
                  
                />
                <Text style = {{color: 'red'}}>{formikProps.errors.phone}</Text>
              </View>

              <TouchableOpacity 
                  style = {{marginVertical: 20, marginHorizontal: 20}}
                  onPress ={formikProps.handleSubmit}>
                  <View style = {{backgroundColor: '#ff6969', alignItems: 'center', 
                                  justifyContent: 'center', padding: 10}}
                        >
                      <Text style = {{color: 'white'}}>Submit</Text>
                  </View>
              </TouchableOpacity>
            </React.Fragment>
          )}
        </Formik>
        </ScrollView>
      </View>
    )
  }
}
class SwipeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {name: "", events:[]}
  }
  
  
  componentDidMount(){
    
    
    

  }

  render() {
    let name = this.props.navigation.getParam('name');
    
    let email = this.props.navigation.getParam('email').split("@")
    console.log("calling fetch from swipescreen")
    fetch('https://35.0.27.244:8000/events/' + email[0] + "/" + email[1])
    .then((response) =>{
      console.log("we got a response from api")
    })
    .catch(error => console.log("error is :" + error));
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        {/* <Swiper></Swiper> */}
        <Text>Will show events for user {this.props.navigation.getParam('name', 'default value')}</Text>
      </View>
    );
  }
}

class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.FBGraphRequest = this.FBGraphRequest.bind(this);
    this.FBLoginCallback = this.FBLoginCallback.bind(this);
    this.onPressHandler = this.onPressHandler.bind(this);
    this.onFacebookLoginFinished = this.onFacebookLoginFinished.bind(this);
    this.onAppLogin = this.onAppLogin.bind(this);
    this.state = {name: "", email: "", loading : false};

  }

  componentDidMount(){
    //console.error("hello")
  }
  async FBGraphRequest(fields, callback) {
    const accessData = AccessToken.getCurrentAccessToken();
    console.log("in Graph request")
    // Create a graph request asking for user information
    const infoRequest = new GraphRequest('/me', {
      accessToken: accessData.accessToken,
      parameters: {
        fields: {
          string: fields
        }
      }
    }, callback);
    // Execute the graph request created above
    alert("info request is " + infoRequest)
    alert("fields is " + fields)
    new GraphRequestManager().addRequest(infoRequest).start();
  }
  FBLoginCallback(error, result) {
    
    if (error) {
      console.log("error " + JSON.stringify(error))
      this.setState({
        loading: false
      });
      
    } else {
      // Retrieve and save user details in state. In our case with 
      // Redux and custom action saveUser
      console.log("graph result is " + JSON.stringify(result))
      this.setState({
       
        name: result.name,
        email: result.email,
      });
      console.log("The state of name is " + this.state.name)
      this.props.navigation.navigate('UserEvents', {name:this.state.name, email: this.state.email});
    }
  }

  onPressHandler(){
    
    this.facebookLogin().then(() => {alert("name is " + this.state.name); this.props.navigation.navigate('UserEvents', {name: this.state.name }) })
  }
  onFacebookLoginFinished(error, result){
   
    if (error) {
      alert("Login failed with error: " + error.message);
    } else if (result.isCancelled) {
      alert("Login was cancelled");
    } else {
      
      console.log("first result is " + JSON.stringify(result))
      
      this.FBGraphRequest('email,name', this.FBLoginCallback).then((result, err) => console.log("state changed to " + this.state.name));
      
    }
  }
  onAppLogin(){
    
  }
  render() {
    const validationScheme = yup.object().shape({
      email: yup.string().required().email().label("Email"),
      pword: yup.string().required().label("Password").min(2, 'Password too short, try again').max(20, 'Too long idiot')
    })
    return (
      <View styles = {styles.body}>
        <ScrollView>
          <View style = {{marginTop: 20, justifyContent: 'center',alignItems: 'center'}}>
            <Image style={{width: 200, height: 200}} source={require('./loginPage.png')}  />
          </View>
          <View style = {{marginTop: 20}}>
            <Text style = {{textAlign: 'center'}}>Find Activities. Make Friends </Text>
          </View>

          <Formik
          initialValues={{email :'', pword: ''}}
          onSubmit={(values) => {
            
            fetch('http://10.0.0.25:8000/login/', {
                method: 'POST',
                body: JSON.stringify({
                  email: values['email'],
                  pword: values['pword'],
                }),
              }).then((response) => response.json())
              .then((responseJson) => {
                if(responseJson['email'] == ""){
                  alert("Email/Password combination not found in our database. Please try again.")
                }
              })
              .catch((error) =>{
                alert(error)
              });
            }}
            validationSchema = {validationScheme}
          >
            {formikProps =>(
              <React.Fragment>
                <View style ={{marginVertical: 10, marginHorizontal: 20}}>
                  
                  <Text>Email</Text>
                  <TextInput placeholder ="janedoe@gmail.com" 
                    style={{borderWidth: 1, borderColor: 'black', padding: 10}}
                    onChangeText={formikProps.handleChange("email")}
                  />
                  <Text style = {{color: 'red'}}>{formikProps.errors.email}</Text>
                  <Text>Password</Text>
                  <TextInput placeholder ="password" 
                    style={{borderWidth: 1, borderColor: 'black', padding: 10}}
                    onChangeText={formikProps.handleChange("pword")}
                    secureTextEntry
                  />
                  <Text style = {{color: 'red'}}>{formikProps.errors.pword}</Text>
                </View>
              
            
          
            <View style ={{marginHorizontal: 90}}>
              <TouchableOpacity onPress ={formikProps.handleSubmit}>
                    <View style = {{backgroundColor: '#ff6969', alignItems: 'center', 
                                    justifyContent: 'center', padding: 10}}
                          >
                        <Text style = {{color: 'white'}}>Login with Flock</Text>
                    </View>
              </TouchableOpacity>
              
            </View>
            </React.Fragment>
            )}
          </Formik>

          <View style ={{marginTop: 20}}>
            <Text style ={{textAlign: 'center', color: 'blue'}} onPress ={() =>{this.props.navigation.navigate('NativeAppLogin')}}>New to Flock? Click to Get Started</Text>
          </View>
          <View style = {{justifyContent: 'flex-end'}}>
          
          
            {/* <Button onPress={this.onPressHandler}
            title="Find Friends" />
            {/* <FBLoginButton /> */}
          </View>

        </ScrollView>

      
      </View>
      
    );
  }
}


const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      header: null,
    },
  },
  
  UserEvents: {
    screen: Swipe,
    navigationOptions: {
      header: null,
    },
  },
  NativeAppLogin:{
    screen: NativeLoginScreen,
    navigationOptions: {
      header: null,
    },
  }
  // CreateEvent: EventScreen
  
},
{
  initialRouteName: 'Home'
});

export default createAppContainer(AppNavigator);