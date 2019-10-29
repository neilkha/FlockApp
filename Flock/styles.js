
//main-page UI styling
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  button: {
    marginTop: 32,
    alignItems: 'center',
    backgroundColor: 'lightsalmon',
    padding: 10,
    
  },
  form: {
    marginTop: 32,
    
  },
  header: {
    marginTop: 20
  },
  links: {
    marginTop: 32,

  },
  motto: {
   color: 'blue'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export { styles } 