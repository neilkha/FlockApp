import React from 'react';
import { Animated, ActivityIndicator, AppRegistry, Dimensions,View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity, Button } from 'react-native';
import {DrawerActions} from 'react-navigation-drawer';
import {Icon} from 'native-base';
import {styles} from '../styles';
import {Formik} from 'formik';
import Swiper from 'react-native-deck-swiper'
import MenuButton from '../components/MenuButton';
import globalVal from '../globalVal';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
const Users = [
  { id: "1", uri: require('../var/uploads/joggingWithJag.jpeg') },
  { id: "2", uri: require('../var/uploads/HikingWithFriends.jpeg') },
  { id: "3", uri: require('../var/uploads/YogaWithFriends.jpeg') },
]
export default class Event extends React.Component{
    constructor(props) {
        super(props); 
        this.state = {eventList: [], hasFetched: false};
        this.renderCards = this.renderCards.bind(this)
        this.renderCards()
    }
    
    static navigationOptions = {
        drawerLabel: 'Home',

    };
    
    renderCards(){
      let email = this.props.navigation.getParam('email', 'default value')
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
          this.setState({hasFetched: true})
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
            {this.state.hasFetched ?
            <Swiper 
            cards={this.state.eventList}
            renderCard={(card) => {
              return (
                  <View style={styleTrial.card}>
                      <View style={{paddingBottom: 20}}>
                        <Text style={styleTrial.eventTitle}>{card.eventName}</Text>
                      </View>
                      <View>
                        <Text style = {styleTrial.eventDesc}>Description: {card.eventDescription}</Text>
                        {/* cards/events that are swipped right need to be inserted into the UserEvents table */}
                      </View>
                  </View>
              )
            }
          }
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
              title: 'NOPE',
              style: {
                label: {
                  backgroundColor: 'black',
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
              title: 'LIKE',
              style: {
                label: {
                  backgroundColor: 'black',
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
            backgroundColor={'#4FD0E9'}
            stackSize= {3}
            verticalSwipe = {false}></Swiper> : <ActivityIndicator />}

          </View>

        </View>
        
          
      )
    }
  }
  const styleTrial = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5FCFF"
    },
    card: {
      height: SCREEN_HEIGHT - 200,
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
