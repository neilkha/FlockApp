import React from 'react';
import { Animated, ActivityIndicator, AppRegistry, Dimensions,View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity, Button } from 'react-native';
import {DrawerActions} from 'react-navigation-drawer';
import {Icon} from 'native-base';
import {styles} from '../styles';
import {Formik} from 'formik';
import Swiper from 'react-native-deck-swiper'
import MenuButton from '../components/MenuButton';
import globalVal from '../globalVal';
import UserProfile from '../UserProfile';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width


export default class Event extends React.Component{
    constructor(props) {
        super(props); 
        this.state = {eventList: [], hasFetched: false, totalEvents: 0};
        this.renderCards = this.renderCards.bind(this)
        this.handleSwipeRight = this.handleSwipeRight.bind(this)
        this.handleSwipeLeft = this.handleSwipeLeft.bind(this)
        this.renderCards()
    }
    
    static navigationOptions = {
        drawerLabel: 'Home',

    };
    
    handleSwipeRight(index){
      let email = UserProfile.getEmail()
      let splitEmail = email.split('@')
      fetch('http://' + globalVal.ip_address + ':8000/events/postEventStatus/' + splitEmail[0] + "/" + splitEmail[1] + "/", {
        method: 'POST',
        body: JSON.stringify({
          eventID: this.state.eventList[index]['eventID'],
          interested: true
          
        }),
      }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson['status_code'] == 404){
          alert("couldn't add to database")
        }
        else{
          
          this.setState({totalEvents: this.state.totalEvents - 1})
          console.log("Decrementing total events + ")
          console.log(this.state.totalEvents)
        }
      })
       
      .catch((error) =>{
        alert(error)
      });
    };
    
    handleSwipeLeft(index){
      let email = UserProfile.getEmail()
      let splitEmail = email.split('@')
      fetch('http://' + globalVal.ip_address + ':8000/events/postEventStatus/' + splitEmail[0] + "/" + splitEmail[1] + "/", {
        method: 'POST',
        body: JSON.stringify({
          eventID: this.state.eventList[index]['eventID'],
          interested: false
          
        }),
      }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson['status_code'] == 404){
          alert("couldn't add to database")
        }
        else{
          
          this.setState({totalEvents: this.state.totalEvents - 1})
          console.log("Decrementing total events + ")
          console.log(this.state.totalEvents)
        }
      }) 
      .catch((error) =>{
        alert(error)
      });
    };

    renderCards(){
      let email = UserProfile.getEmail()
      let splitEmail = email.split('@')
      fetch('http://' + globalVal.ip_address + ':8000/events/getAvailable/' + splitEmail[0] + "/" + splitEmail[1])
      .then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.length == 0){
          alert("There are no events to show")
        }
        else{
          for (var key in responseJson) {
            // check if the property/key is defined in the object itself, not in parent
            this.state.eventList.push(responseJson[key])
          }
          console.log("eventList is ")
          console.log(this.state.eventList)
          this.setState({hasFetched: true, totalEvents: this.state.eventList.length})
          console.log(this.state)
        }
      })
      .catch((error) =>{
        console.log(error)
      });
    };
    
    render(){
      
      return (
        <View style ={{flex: 1}}>
          {/* menu button works if you put icon inside a scroll view but it fucks up layout */}
            <Icon
            name="md-menu"
            color="#000000"
            size={32}
            style={styles.menuIcon}
            onPress={() => this.props.navigation.toggleDrawer()}
            />  

          <View style = {styles.header}>
            <Text style = {styles.headerText}>Flock</Text>
          </View>

          <View style={styleTrial.container}>
            {this.state.hasFetched ? ((this.state.totalEvents == 0) ? <Text style = {styles.noEventText}> Look at you! You've swiped through all the events in your area</Text> :
            
            <Swiper 
            cards={this.state.eventList}
            renderCard={(card) => {
              return (
                  <View style={styleTrial.card}>
                      <View style={{paddingBottom: 20}}>
                        <Text style={styleTrial.eventTitle}>{card.eventName}</Text>
                      </View>
                      <View>
                        <Text style = {styleTrial.eventDesc}>Description: {card.eventDescription}
                        {"\n"}
                        Hosted by: {card.host}
                        {"\n"}
                        Contact Information: {card.phone}
                        </Text>
                        {/* cards/events that are swipped right need to be inserted into the UserEvents table */}
                      </View>
                      <View>
                        
                      </View>
                  </View>
              )
            }
          }
          backgroundColor={'white'}
          onSwipedRight = {(index) =>{
            this.handleSwipeRight(index)
          }}
          onSwipedRight = {(index) =>{
            this.handleSwipeLeft(index)
          }}
          overlayLabels={{
            bottom: {
              title: 'BLEAH',
              style: {
                label: {
                  backgroundColor: 'black',
                  borderColor: 'black',
                  color: 'white',
                  borderWidth: 1
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              }
            },
            left: {
              title: 'Nah',
              style: {
                label: {
                  backgroundColor: 'red',
                  borderColor: 'black',
                  color: 'white',
                  borderWidth: 1
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: -30
                }
              }
            },
            right: {
              title: 'Yes!',
              style: {
                label: {
                  backgroundColor: 'green',
                  borderColor: 'black',
                  color: 'white',
                  borderWidth: 1
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: 30
                }
              }
            },
            top: {
              title: 'SUPER LIKE',
              style: {
                label: {
                  backgroundColor: 'black',
                  borderColor: 'black',
                  color: 'white',
                  borderWidth: 1
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              }
            }
          }}
            onSwiped={(cardIndex) => {console.log(cardIndex)}}
            onSwipedAll={() => {}}
            cardIndex={0}
            backgroundColor={'#ff6969'}
            stackSize= {3}
            verticalSwipe = {false}></Swiper>) : <ActivityIndicator />}

          </View>

        </View>
        
          
      )
    }
  }
  const styleTrial = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 	'#ff6969',
      
    },
    card: {
      height: globalVal.SCREEN_HEIGHT - 200,
      borderRadius: 4,
      borderWidth: 2,
      borderRadius: 20,
      borderColor: "#E8E8E8",
      justifyContent: "center",
      backgroundColor: "white"
    },
    eventTitle: {
      textAlign: "center",
      fontSize: 40,
      backgroundColor: "transparent"
    },
    eventDesc:{
      textAlign: "center",
      fontSize: 20,
      color: '#97a3b2'
    }
  });
