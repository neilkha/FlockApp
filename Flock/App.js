import React from 'react';
import { AppRegistry, Button, View, Text, Image, TouchableOpacity } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import t from 'tcomb-form-native';
import {styles} from './styles.js';
import { LoginButton, LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager } from 'react-native-fbsdk';

var FBLoginButton = require('./FBLoginButton');

class SwipeScreen extends React.Component {
  constructor(props){
    super(props);
    
  }
  
  
  componentDidMount(){
    fetch('10.0.2.2/events/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstParam: 'yourValue',
        secondParam: 'yourOtherValue',
      }),
    });
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
    }
  }
  // async facebookLogin() {
  //   // native_only config will fail in the case that the user has
  //   // not installed in his device the Facebook app. In this case we
  //   // need to go for webview.
  //   let result;
  //   try {
  //     LoginManager.setLoginBehavior('WEB_ONLY');
  //     alert("trying await")
  //     LoginManager.logInWithPermissions(['public_profile, email'])
  //     .then((result) =>{
  //       if(result.isCancelled){
  //         alert("Result returned cancelled");
  //       }
  //     });
  //   } catch (webError) {
  //     // show error message to the user if none of the FB screens
  //     // did not open
  //   }
  //   console.log(result);
  //   // handle the case that users clicks cancel button in Login view
  //   if (result.isCancelled) {
  //     this.setState({
  //       loading: false,
  //     });
  //   } else {
  //     // Create a graph request asking for user information
  //     await this.FBGraphRequest('email', this.FBLoginCallback);
  //   }
  // }
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
      
      this.FBGraphRequest('email,name', this.FBLoginCallback).then(console.log("state changed to " + this.state.name));
      this.props.navigation.navigate('UserEvents', {name:this.state.name});
    }
  }
  render() {
    return (
      <View styles = {styles.body}>
        <View style = {{justifyContent: 'center',alignItems: 'center',}}>
          <Image style={{width: 200, height: 200}} source={require('./loginPage.png')}  />
        
        
          
          
        </View>
        <View>
          <Text style = {{textAlign: 'center'}}>Find Activities. Make Friends </Text>
        </View>
        <View style = {{justifyContent: 'flex-end'}}>
        <LoginButton
            permissions={["public_profile", "email"]}
            onLoginFinished={(error, result) => this.onFacebookLoginFinished(error,result)}
            onLogoutFinished={() => alert("User logged out")}/> 
         
          {/* <Button onPress={this.onPressHandler}
          title="Find Friends" />
          {/* <FBLoginButton /> */}
        </View>

        

      
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
    screen:SwipeScreen,
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