import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, TextInput, Button, ActivityIndicator} from 'react-native';
import {createSwitchNavigator,createStackNavigator,
  createBottomTabNavigator, createAppContainer} from 'react-navigation';
import AuthLoadingScreen from './screens/Auth.js'
import Login from './screens/Login.js'
import Home from './screens/Home.js'
import createAccount from './screens/createAccount.js';
import Result from './screens/result.js'
import Saves from './screens/saves.js'



const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});



const LoginStack = createStackNavigator({
  Login:{screen:Login,navigationOptions:{headerStyle:{height:0},headerForceInset:{top:'never',bottom:'never'}}},
  createAccount:{screen:createAccount,navigationOptions:{
      title:'Create account'
  }},
})




const HomeStack = createStackNavigator({
  Home:{screen:Home,navigationOptions:{headerStyle:{height:0},headerForceInset:{top:'never',bottom:'never'}}},
  Result:{screen:Result,navigationOptions:{
    gesturesEnabled: false
  }}
})

const SavesStack = createStackNavigator({
  Saves:{screen:Saves,navigationOptions:{headerStyle:{height:0},headerForceInset:{top:'never',bottom:'never'}}},
  Result:{screen:Result,navigationOptions:{
    gesturesEnabled: false
  }}
})

const MainNavigator = createBottomTabNavigator({
  Home:{screen:HomeStack},
  Saves:{screen:SavesStack}
})



const App = createAppContainer(createSwitchNavigator(
  {
  AuthLoading:AuthLoadingScreen,
  Login:LoginStack,
  Main:MainNavigator,
  },
  {
    initialRouteName:'AuthLoading',
  }
));

export default App;




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20
  },

    item: {
      flex:1,
      backgroundColor: '#FFFFFF',
      margin:20,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#df0f0f'

    },
    input:{
      paddingLeft:8,
      borderWidth:2,
      height:40,
      width:150,
      borderColor:'gray',
    }


});
