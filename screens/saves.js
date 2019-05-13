import React from 'react';
import {AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,
  TouchableHighlight,TouchableOpacity,FlatList,
  AppRegistry,ScrollView,Text, View,Image} from 'react-native';
import {Header,CheckBox,SearchBar,ListItem,Button,Input,Overlay} from 'react-native-elements';
import {NavigationEvents} from 'react-navigation'
import AntIcon from 'react-native-vector-icons/AntDesign';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import MatCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntIcon from 'react-native-vector-icons/Entypo';
import FIcon from 'react-native-vector-icons/Foundation';
import Tags from "react-native-tags";
import Calls from '../assets/apiCalls.js';
import styles from '../assets/styleSheet.js'
import IP from '../ip.js'




class Saves extends React.Component{
  constructor(props){
    super(props)
    this.state= {
      saves:[],
      username:null,
      saveAs:[],
      edit:false,
      willSend:false,
      whatToSend:[],
      showContacts:false,
      newContact:null,
      contacts:[],
      whoToSend:[]
    }
    this.getUsername()
  }

  getUsername = async () => {
    const username = await AsyncStorage.getItem('username');
    this.setState({username:username})
    this.getFiles()
    this.getContacts()
  }

  getFiles = () => {
    let url = 'http://'+IP+':5000/graph?username='+this.state.username
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
      let url = 'http://'+IP+':5000/graph'
      let data = {
        username:this.state.username,
        saveAs:[this.state.saves.map(entry=>{return entry.newSaveAs})]
      }
      Calls.PUT(url,data)
      .then((response)=>{
        if(response.status==200){
          this.getFiles()
        }
      })
  }

  deleteGraph = (filename) =>{
    let url = 'http://'+IP+':5000/graph'
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
    let url='http://'+IP+':5000/email/'+this.state.username
    let data = {
      archives:[this.state.saves.reduce((filtered,entry)=>{
        if(entry.whatToSend.png || entry.whatToSend.xls){
          filtered.push({graph:entry.graph,png:entry.whatToSend.png,xls:entry.whatToSend.xls})
        }
        return filtered
      },[])],
      receivers:[this.state.contacts.reduce((filtered,entry)=>{
        if(entry.send){
          filtered.push(entry.contact_name)
        }
        return filtered
      },[])],
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


  addContact = ()=>{
    let url='http://'+IP+':5000/friend/'+this.state.username
    let body={
      contact_name:this.state.newContact
    }
    Calls.POST(url,body)
    .then(response=>{
      console.log(response.status)
      if(response.status==400){
        alert('This email is already on your contact list')
      }else if(response.status!=201){
        alert("Something went wrong")
      }else{
        this.setState({newContact:''})
        this.getContacts()
      }
    })
  }

  getContacts = () => {
    let url='http://'+IP+':5000/friend/'+this.state.username
    Calls.GET(url)
    .then(response=>{
      if(response.status!=200){
        alert('Something went wrong')
      }else{
        response.json().then(responseJson=>{
          this.setState({contacts:responseJson.friends.map(entry=>{
            return {contact_name:entry.contact_name,newMail:'',send:false}
          })})
        })

      }
    })
  }

cancel = ()=> {
  if(this.state.willSend){
    this.setState({
      saves:this.state.saves.map(entry=>{
      return {newSaveAs:'',graph:entry.graph
      ,whatToSend:{png:false,xls:false}}
    }),
    willSend:false,
    contacts:this.state.contacts.map(entry=>{
      return {contact_name:entry.contact_name,send:false}
    })})
  }else{
    if(!this.state.showContacts){
      this.getFiles()
    }else{
      this.getContacts()
    }
    this.setState({edit:false})
  }
}


deleteFriend = (friend) => {
  let url='http://'+IP+':5000/friend/'+this.state.username
  let body={contact_name:friend}
  Calls.DELETE(url,body)
  .then(response=>{
    if(response.status!=200){
      alert('Something went wrong')
    }else{
      this.getContacts()
    }
  })
}

updateAllContacts = () => {
    let url = 'http://'+IP+':5000/friend/'+this.state.username
    let data = {
      contact_name:this.state.contacts.map(entry=>{return entry.newMail}).join(',').slice(1)
    }
    console.log(data.contact_name)
    Calls.PUT(url,data)
    .then((response)=>{
      if(response.status==200){
        this.getContacts()
      }
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
        leftComponent={this.state.willSend && this.state.showContacts?
          <Button title='Send' type='clear' titleStyle={styles.headerTitleStyle}
          onPress={()=>{
            var didUselect=0==1
            for(var i=0;i<this.state.contacts.length;i++){
              didUselect=this.state.contacts[i].send
              if(didUselect){
                break
              }
            }
            if(didUselect){
              this.sendMail()
              this.cancel()
              alert('Email sent successfully')
            }else{
              alert('You must select at least one item to proceed')
            }

          }}
          />
          :
          this.state.willSend?
          <Button title='Next' type='clear' titleStyle={styles.headerTitleStyle}
          onPress={()=>{
            var didUselect=0==1
            for(var i=0;i<this.state.saves.length;i++){
              didUselect=this.state.saves[i].whatToSend.png || this.state.saves[i].whatToSend.xls
              if(didUselect){
                break
              }
            }
            if(didUselect){
              this.setState({showContacts:true})
            }else{
              alert('You must select at least one item to proceed')
            }
          }} />
          :
          this.state.edit?
          <Button type='clear' title={'Done'} titleStyle={styles.headerTitleStyle}
          onPress={()=>{
            if(this.state.showContacts){
              this.updateAllContacts()
            }else{
              this.updateAllSaveAs()
            }
            this.setState({edit:false})
          }}
          />
          :
          <View style={{flexDirection:'row'}}>
            <Button type='clear' titleStyle={styles.headerTitleStyle} title='Edit'
             onPress={()=>this.setState({edit:true})}
            />
            <Button onPress={()=>this.setState({showContacts:false,willSend:true})}
            type='clear' icon={this.state.willSend?null:<MatIcon name='mail' color='white' size={28}/>}
          />
        </View>
      }
        centerComponent={{text:'Saves',style:{fontFamily:'Avenir',fontSize:25,fontWeight:'700'}}}
        rightComponent={this.state.edit || this.state.willSend?
          <Button type='clear' title='Cancel' titleStyle={styles.headerTitleStyle} onPress={()=>{
            this.cancel()
          }}/>
          :
          <View style={{flexDirection:'row'}}>
            <Button onPress={()=>this.setState({showContacts:true})}
            type='clear' icon={<AntIcon name='contacts' color={this.state.showContacts?'#4f4338':'white'} size={30}/>} />
            <Button onPress={()=>{
              this.setState({showContacts:false})
              // console.log(this.state.contacts)
            }}
            type='clear' icon={<FIcon name='graph-bar' color={!this.state.showContacts?'#4f4338':'white'} size={32}/>}/>
          </View>
          }
      />
      <View style={{flex:1,margin:15,width:'94%'}}>
      {this.state.showContacts?
        <Input autoCorrect={false} autoCapitalize={'none'}
        value={this.state.newContact} returnKeyType='done'
        onSubmitEditing={()=>{
          this.addContact()
        }}
        onChangeText={(text)=>this.setState({newContact:text})}
        inputStyle={{padding:7}} placeholder='Enter new email contact'
        rightIcon={<AntIcon onPress={()=>this.addContact()} raised
        reverse name='adduser' color='#4f4338' size={35}/>}/>
        :
        null
      }
      <ScrollView contentContainerStyle={{flexGrow:1}}>
        {
            !this.state.showContacts?
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
            :
            this.state.contacts.map((l, i) => (
              <ListItem
                containerStyle={{borderBottomWidth:1,borderColor:'gray'}}
                key={i}
                leftIcon={this.state.edit && i!=0?<AntIcon onPress={()=>this.deleteFriend(l.contact_name)} name='deleteuser' color='black' size={30} />:<MatCIcon name='contact-mail' color='#4f4338' size={30}/>}
                // chevron={true}
                rightContainerStyle={{height:30,width:40}}
                disabled={true}
                input={this.state.edit && i!=0?{
                  returnKeyType:'done',
                  placeholder:'Rename',
                  clearButtonMode:'while-editing',
                  onChangeText:(text)=>{
                    var dummy = this.state.contacts
                    dummy[i].newMail=text
                    this.setState({contacts:dummy})
                  },
                  value:l.newMail,
                }:null}
                title={i==0?'(You)'+l.contact_name:l.contact_name}
                titleStyle={{fontFamily:'Avenir',fontSize:21}}
                rightElement={this.state.willSend?
                  <CheckBox
                  checked={l.send}
                  onPress={()=>{
                    var dummy = this.state.contacts
                    dummy[i].send=!dummy[i].send
                    this.setState({contacts:dummy})
                  }}
                  />
                  :null}
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
