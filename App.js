/**
 * Created by ScriptShock on 2020.
 *
 * @format
 */

import React, { Component  } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/es/integration/react";

import { enableScreens } from 'react-native-screens';


import store from "@store/configureStore";
import Router from "./src/Router";
import { setJSExceptionHandler, setNativeExceptionHandler } from "react-native-exception-handler";
import { Alert } from "react-native";
import { Linking , Dimensions} from 'react-native'
import RNRestart from 'react-native-restart';
import Orientation from 'react-native-orientation-locker';
import { Reactotron } from "@app/Omni";

enableScreens();



export default class ReduxWrapper extends Component {
  constructor(props) {
    super(props);

  }
  UNSAFE_componentWillMount() {
     Orientation.lockToPortrait(); //this will lock the view to Portrait
  }

  render() { 
    const persistor = persistStore(store);

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router />
        </PersistGate>
      </Provider>
    );
  }
}
const sendMail = (sub, body) => {
  const email = "crm.shop@gmail.com";
  //Linking.openURL('mailto:support@example.com?subject=SendMail&body=Description')
  Linking.openURL('mailto:' + email + '?subject=' + sub + '&body=' + body + '')
}




const handleError = (error, isFatal) => {
  //alert(JSON.stringify(error), isFatal)
  Alert.alert(
    error.name,
    JSON.stringify(error),
    [
      { text: "MAIL ERROR", onPress: () => sendMail(error.name, JSON.stringify(error)) },
      { text: "RESTART", onPress: () => RNRestart.Restart() },
    ],
    { cancelable: false }
  );

}
setJSExceptionHandler((error, isFatal) => {
  handleError(error, isFatal)
}, false)

setNativeExceptionHandler(exceptionString => {
  // This is your custom global error handler
  // You do stuff likehit google analytics to track crashes.
  // or hit a custom api to inform the dev team.
  //NOTE: alert or showing any UI change via JS
  //WILL NOT WORK in case of NATIVE ERRORS.
  handleError(exceptionString);
});
