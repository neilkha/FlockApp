
//main-page UI styling
import { StyleSheet } from 'react-native'
import {

  Colors
} from 'react-native/Libraries/NewAppScreen';
import globalVal from './globalVal';

const styles = StyleSheet.create({
  menuIcon: {
		zIndex: 100,
		position: 'absolute',
		top: 20,
    left: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 5
  },
  headerText: {
    textAlign: 'center',fontSize: 20, fontWeight: 'bold'
  },
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 30,
  },

  item: {
    padding: 10,
    fontSize: 18,
  },
  noEventText: {
    fontSize: 20, 
    color: 'white',
    textAlignVertical: 'center',
    textAlign: 'center'
  }
});

export { styles } 