
//main-page UI styling
import { StyleSheet } from 'react-native'
import {

  Colors
} from 'react-native/Libraries/NewAppScreen';

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
  },
  headerText: {
    textAlign: 'center',fontSize: 25, fontWeight: 'bold'
  }
});

export { styles } 