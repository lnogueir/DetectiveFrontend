import React from 'react';
import {AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,
  TouchableHighlight,TouchableOpacity,FlatList,
  AppRegistry,ScrollView,Text, View,Image,StyleSheet} from 'react-native';
import {SearchBar,ListItem,Button,Input,Overlay} from 'react-native-elements';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Tags from "react-native-tags";
import Calls from '../assets/apiCalls.js';
import styles from '../assets/styleSheet.js'
import IP from '../ip.js'


class Home extends React.Component{
    constructor(props){
      super(props)
      this.state={
        topics:[],
        isVisible:false,
        username:null,
        keywords:[],
        topic:null,
        newTopic:'',
        newKeyword:'',
        search:'',
        isLoading:false
      }

      this.getUserInfo()
    }

    getUsername = async () => {
      const username = await AsyncStorage.getItem('username');

      this.setState({username:username})
    }

    getKeywords = (topic_name) =>{
      let url = 'http://'+IP+':5000/topic/'+this.state.username+'/'+topic_name
      fetch(url)
      .then((response)=>response.json())
      .then((responseJson)=>{
        this.setState({topic:responseJson,isVisible:true})
      })
    }

    addKeyword = (keyword) => {
      let url = 'http://'+IP+':5000/tag/'+this.state.topic.id+'/'+keyword
      fetch(url,{
        method:'POST'
      })
      .then(response=>{
        if(response.status==201){
          this.getKeywords(this.state.topic.topic)
        }
      })
    }

    deleteKeyword = (keyword) => {
      let url = 'http://'+IP+':5000/tag/'+this.state.topic.id+'/'+keyword
      fetch(url,{
        method:'DELETE'
      })
      .then((response)=>{
      })
    }

    addTopic = (topic) =>{
      let url = 'http://'+IP+':5000/topic/'+this.state.username+'/'+topic
      fetch(url,{
        method:'POST'
      })
      .then(response=>{
        if(response.status==201){
          this.getUserInfo()
          this.setState({newTopic:''})
        }
      })
    }

    deleteTopic = (topic) => {

      let url = 'http://'+IP+':5000/tags/'+this.state.topic.id
      fetch(url,{
        method:'DELETE'
      }).then((response)=>{

        if(response.status==200 || response.status==404){
          url = 'http://'+IP+':5000/topic/'+this.state.username+'/'+topic
          fetch(url,{
            method:'DELETE'
          })
          .then((response)=>{

            if(response.status==200){
              this.getUserInfo()
              this.setState({isVisible:false})
            }
          })
        }
      })

    }


    getUserInfo = async () =>{
      let username = await this.getUsername()
      let url = 'http://'+IP+':5000/user/'+this.state.username
       fetch(url)
      .then((response)=>response.json())
      .then((responseJson)=>{
          this.setState({topics:responseJson.topics})
        })
    }

    getSearchResult = () => {
      this.setState({isLoading:true})
      let url = 'http://'+IP+':5000/graph'
      body = {
        url:this.state.search,
        username:this.state.username
      }
      Calls.POST(url,body)
      .then((response)=>response.json())
      .then((responseJson)=>{
        if (responseJson){
              this.props.navigation.navigate('Result',{
                filename:responseJson.filename,
                isSavePage:false
              })
              this.setState({isLoading:false,search:''})
        }else{
            alert('Something went wrong')
        }
      })



    }




    render(){
      return(
        <View style={{flex:1}}>
        <View style={styles.headerContainerLogin}>
          <Text style={styles.fontHeader}><Text style={{fontFamily:'Times New Roman',fontWeight:'bold'}}>HTML</Text> Detective</Text>
        </View>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logoStyle}
            source={require('../assets/detective-guy.png')}
          />
          </View>
          <Overlay
            isVisible={this.state.isVisible}
            width='70%'
            height='55%'
            windowBackgroundColor="rgba(255, 255, 255, .5)"
            onBackdropPress={() => {
              this.setState({ isVisible: false })
              this.getUserInfo()
            }}
            overlayBackgroundColor="olive"
          >
            <View stlye={{margin:10,justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontFamily:'Avenir',fontSize:21,fontWeight:'bold'}}>{this.state.topic==null?"":this.state.topic.topic} keywords:</Text>
              <Tags
                containerStyle={{margin:10}}
                textInputProps={{
                   containerStyle:{borderRadius:20},
                   autoFocus:true
                 }}

                 initialTags={this.state.topic==null||this.state.topic==[]?[]:this.state.topic.tags.map(tagObj=>tagObj.keyword)}
                 onChangeTags={tags => {
                   if(tags.length<this.state.topic.tags.length){
                     this.deleteKeyword(this.state.topic.tags[this.state.topic.tags.length-1].keyword)
                   }else{
                    this.addKeyword(tags[tags.length-1]);
                   }

                 }}
                 // onTagPress={(index, tagLabel, event, deleted) =>
                 //   // this.setState({isVisible:true})
                 // }
                 deleteTagOnPress={true}
                 containerStyle={{ justifyContent: "center" }}
                 inputStyle={{ backgroundColor: "lightgray" }}
              />
              <Button onPress={()=>{
                this.deleteTopic(this.state.topic.topic)
              }}
              buttonStyle={{margin:10,backgroundColor:'#4f4338',borderRadius:30}}
              title='Remove this topic' titleStyle={{fontFamily:'Avenir'}}/>
            </View>
          </Overlay>
          <SearchBar
          returnKeyType='go'
          showLoading={this.state.isLoading}
          onSubmitEditing={()=>{
            this.getSearchResult()
          }}
          searchIcon={{ size: 24 }}
          onChangeText={text => this.setState({search:text})}
          containerStyle={{backgroundColor:'olive'}}
          inputContainerStyle={{backgroundColor:'#4f4338'}}
          placeholder="Detect URL"
          value={this.state.search}
          />
          <View style={{margin:7,height:'45%'}}>
            <Text style={{padding:7,fontFamily:'Avenir',fontSize:23,fontWeight:'bold'}}>Those are your topics:</Text>
            <Input value={this.state.newTopic} returnKeyType='done'
            onSubmitEditing={()=>{
              this.addTopic(this.state.newTopic)
            }}
            onChangeText={(text)=>this.setState({newTopic:text})}
            inputStyle={{padding:7}} placeholder='Enter new topic'
            rightIcon={<AntIcon onPress={()=>this.addTopic(this.state.newTopic)} raised
            reverse name='pluscircle' color='#4f4338' size={23}/>}/>
            <View style={{flex:1,marginHorizontal:15,marginTop:10,width:'94%'}}>
            <ScrollView>
              {
                this.state.topics.map((l, i) => (
                  <ListItem
                    containerStyle={{borderBottomWidth:1,borderColor:'gray'}}
                    key={i}
                    leftIcon={<AntIcon name='tags' color='#4f4338' size={30}/>}
                    chevron={true}
                    rightContainerStyle={{height:30,width:40}}
                    onPress={()=>{
                      this.getKeywords(l.topic_name)
                    }}
                    // rightIcon={<AntIcon name='right' color='gray' size={25}/>}
                    title={l.topic_name}
                    titleStyle={{fontFamily:'Avenir',fontSize:21}}
                    badge={{ value:l.numTags, badgeStyle:{width:50,height:30,backgroundColor:'olive',borderRadius:50}}}
                    // subtitle={l.subtitle}
                  />
                ))
              }
              </ScrollView>
            </View>
          </View>
        </View>
      )
    }
}

export default Home;
