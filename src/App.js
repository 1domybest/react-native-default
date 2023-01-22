import { StyleSheet} from 'react-native'
import AuthNavigation from './navigation/AuthNavigation'
import {Provider} from "react-redux";
import store from './store'

const App = () => {
  return (
    <Provider store={store}>
      <AuthNavigation/>
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({})