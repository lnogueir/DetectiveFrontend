import React from 'react';
import {Dimensions,AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,
  TouchableHighlight,TouchableOpacity,FlatList,
  AppRegistry,ScrollView,Text, View,Image,StyleSheet} from 'react-native';
import {SearchBar,ListItem,Button,Input,Overlay} from 'react-native-elements';
import {NavigationEvents} from 'react-navigation'
import AntIcon from 'react-native-vector-icons/AntDesign';
import Tags from "react-native-tags";
import Calls from '../assets/apiCalls.js';
import styles from '../assets/styleSheet.js'

const win = Dimensions.get('window');

class Result extends React.Component{
  constructor(props){
    super(props);
    this.state={
      filename:this.props.navigation.getParam('filename','BUG'),
      saved:false,
      isSavePage:this.props.navigation.getParam('isSavePage','BUG')
    }

  }

  removeImageFromDB = () =>{
    let url='http://127.0.0.1:5000/graph'
    data={filename:this.state.filename}
    Calls.DELETE(url,data)
    .then((response)=>{
      if(response.status!=200){
        alert('Something went wrong')
      }
    })
  }


  render(){
    return(
    <View style={{flex:1}}>
      <NavigationEvents
        onWillBlur={payload=>{
          if(!this.state.isSavePage && !this.state.saved){
            this.removeImageFromDB()
          }
        }}
      />
      <View style={{margin:15,alignItems:'center'}}>
        <Text style={styles.detectiveResultTitle}>Detective Result</Text>
        <Image
          style={{width:450,height:460}}
          source={{cache:'reload',uri:'http://127.0.0.1:5000/graph?filename='+this.state.filename}}
        />
      </View>
      <View style={{alignItems:'center',width:'100%',justifyContent:'center'}}>
        <Button onPress={()=>{
          this.setState({saved:true})
          }
        }
        disabled={this.state.isSavePage?true:this.state.saved}
        titleStyle={{fontFamily:'Avenir',fontSize:30}} buttonStyle={{width:260,backgroundColor:'olive',borderRadius:30}}
        title={this.state.isSavePage?'Saved':this.state.saved?'Saved':'Save'}
        />
      </View>
    </View>
    )
  }
}


export default Result;
