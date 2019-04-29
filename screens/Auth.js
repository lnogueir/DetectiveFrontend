import React from 'react';
import {AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,
  TouchableHighlight,TouchableOpacity,FlatList,
  AppRegistry,ScrollView,Text, View,Image,StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';

class AuthLoadingScreen extends React.Component{
  constructor(props){
    super(props);
    this._bootstrapAsync();
  }


  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userid'); //trocar
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    setTimeout(()=>{this.props.navigation.navigate(userToken ? 'Main': 'Login')},1000)

  };

  render(){
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <Text>Authentication Screen</Text>
      </View>
    );
  }

}

export default AuthLoadingScreen;
