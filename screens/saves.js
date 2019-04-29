import React from 'react';
import {Dimensions,AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,
  TouchableHighlight,TouchableOpacity,FlatList,
  AppRegistry,ScrollView,Text, View,Image,StyleSheet} from 'react-native';
import {Header,CheckBox,SearchBar,ListItem,Button,Input,Overlay} from 'react-native-elements';
import {NavigationEvents} from 'react-navigation'
import AntIcon from 'react-native-vector-icons/AntDesign';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import EntIcon from 'react-native-vector-icons/Entypo';
import FIcon from 'react-native-vector-icons/Foundation';
import Tags from "react-native-tags";
import Calls from '../assets/apiCalls.js';
import styles from '../assets/styleSheet.js'




class Saves extends React.Component{
  constructor(props){
    super(props)
    this.state= {
      saves:[],
      username:null,
      saveAs:[],
      edit:false,
      willSend:false,
      whatToSend:[]
    }
    this.getUsername()
  }

  getUsername = async () => {
    const username = await AsyncStorage.getItem('username');
    this.setState({username:username})
    this.getFiles()
  }

  getFiles = () => {
    let url = 'http://127.0.0.1:5000/graph?username='+this.state.username
    Calls.GET(url)
    .then((response)=>response.json())
    .then((responseJson=>{
      // console.log(responseJson)
      this.setState({saves:responseJson.map(entry=>{
        return {newSaveAs:'',graph:entry
        ,whatToSend:{png:false,xls:false}}
      })
    })
    }))
  }

  // updateSaveAs = (index) => { TO UPDATE JUST ONE NAME
  //   let url = 'http://127.0.0.1:5000/graph'
  //   data = {
  //     filename:this.state.saves[index].filename,
  //     saveAs:this.state.saveAs[index]
  //   }
  //   Calls.PUT(url,data)
  //   .then((response)=>{
  //     // console.log(response)
  //     if(response.status==200){
  //       this.getFiles()
  //     }
  //   })
  // }

  updateAllSaveAs = () => {
      let url = 'http://127.0.0.1:5000/graph'
      let data = {
        username:this.state.username,
        saveAs:[this.state.saves.map(entry=>{return entry.newSaveAs})]
      }
      Calls.PUT(url,data)
      .then((response)=>{
        // console.log(response)
        if(response.status==200){
          this.getFiles()
        }
      })
  }

  deleteGraph = (filename) =>{
    let url = 'http://127.0.0.1:5000/graph'
    data = {
      filename:filename
    }
    Calls.DELETE(url,data)
    .then((response)=>{
      if(response.status==200){
        this.getFiles()
      }
    })
  }


  sendMail = () => {
    let url='http://127.0.0.1:5000/email/'+this.state.username
    let data = {
      archives:[this.state.saves.reduce((filtered,entry)=>{
        if(entry.whatToSend.png || entry.whatToSend.xls){
          filtered.push({graph:entry.graph,png:entry.whatToSend.png,xls:entry.whatToSend.xls})
        }
        return filtered
      },[])],
      receivers:[['michel.sdf@gmail.com']],
    }

    Calls.POST(url,data)
    .then(response=>{
      console.log(response.status)
      response.json()
    })
    .then(responseJson=>{
      console.log(responseJson)
      const dummy = this.state.saves.map(entry=>{
        return {newSaveAs:'',graph:entry.graph
        ,whatToSend:{png:false,xls:false}}
      })
      this.setState({saves:dummy})
    })
  }



  render(){
    return (
    <View style={{flex:1}}>
      <NavigationEvents
        onWillFocus={payload=>{
          if(!this.state.saved){
            this.getFiles()
          }
        }}
      />
      <Header
        backgroundColor='olive'
        leftComponent={this.state.edit?
          <Button type='clear' title={'Done'} titleStyle={styles.headerTitleStyle}
          onPress={()=>{
            this.updateAllSaveAs()
            this.setState({edit:false})
          }
          }
          />
          :
          <View style={{flexDirection:'row'}}>
            <Button type='clear' titleStyle={styles.headerTitleStyle} title='Edit'
             onPress={()=>this.setState({edit:true})}
            />
            <Button titleStyle={styles.headerTitleStyle} title={this.state.willSend?'Send':null}
            onPress={()=>{
              if(this.state.willSend){
                this.sendMail()
              }
              this.setState({willSend:!this.state.willSend})
            }}
          type='clear' icon={this.state.willSend?null:<MatIcon name='mail' color='white' size={28}/>}
          />
        </View>
      }
        centerComponent={{text:'Saves',style:{fontFamily:'Avenir',fontSize:25,fontWeight:'700'}}}
        rightComponent={this.state.edit?
          <Button type='clear' title='Cancel' titleStyle={styles.headerTitleStyle} onPress={()=>this.setState({edit:false})}/>
          :
          <View style={{flexDirection:'row'}}>
            <Button type='clear' icon={<AntIcon name='contacts' color='white' size={30}/>} />
            <Button type='clear' icon={<FIcon name='graph-bar' color='#4f4338' size={32}/>}/>
          </View>
          }
      />
      <View style={{margin:15,width:'94%'}}>
        <ScrollView>
        {
          this.state.saves.map((l, i) => (
              <ListItem
                containerStyle={{borderBottomWidth:1,borderColor:'gray'}}
                key={i}
                disabled={this.state.edit || this.state.willSend}
                subtitle={'Available to send as png and xls'}
                subtitleStyle={{fontSize:14,color:'gray'}}
                leftIcon={this.state.edit?<AntIcon onPress={()=>this.deleteGraph(l.graph.filename)} name='minuscircle' color='red' size={38}/>:<EntIcon name='bar-graph' color="#4f4338" size={35}/>}
                // chevron={true}
                onPress={()=>{
                  this.props.navigation.navigate('Result',{filename:l.graph.filename,isSavePage:true})
                }}
                input={this.state.edit?{
                  returnKeyType:'done',
                  placeholder:'Rename',
                  clearButtonMode:'while-editing',
                  onChangeText:(text)=>{
                    var dummy = this.state.saves
                    dummy[i].newSaveAs=text
                    this.setState({saves:dummy})
                  },
                  value:l.newSaveAs,
                }:null}
                rightElement={
                  this.state.willSend?
                  <View>
                    <CheckBox checked={l.whatToSend.png}
                    containerStyle={{backgroundColor:'transparent',borderColor:'transparent'}}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    title='send png'
                    onPress={()=>{
                      var dummy = this.state.saves
                      dummy[i].whatToSend.png=!dummy[i].whatToSend.png
                      this.setState({saves:dummy})
                    }}
                    />
                    <Text style={{textAlign:'center',color:'gray'}}>───────</Text>
                    <CheckBox checked={l.whatToSend.xls}
                    containerStyle={{backgroundColor:'transparent',borderColor:'transparent'}}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    title='send xls'
                    onPress={()=>{
                      var dummy = this.state.saves
                      dummy[i].whatToSend.xls=!dummy[i].whatToSend.xls
                      this.setState({saves:dummy})
                    }}
                    />
                  </View>
                  :
                  null
                }
                rightIcon={this.state.edit || this.state.willSend?null:<AntIcon name='right' color='gray' size={25}/>}
                title={l.graph.saveAs==null || l.graph.saveAs==''?'Save '+i:l.graph.saveAs}
                titleStyle={{fontFamily:'Avenir',fontSize:21,fontWeight:'700'}}
              />
          ))
        }
        </ScrollView>
      </View>
    </View>
    )
  }
}


export default Saves;
