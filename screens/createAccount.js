import React from 'react';
import {AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,
  TouchableHighlight,TouchableOpacity,FlatList,
  AppRegistry,ScrollView,Text,View,Image} from 'react-native';
import {Input,Button} from 'react-native-elements'
import styles from '../assets/styleSheet.js'
import Icon from 'react-native-vector-icons/FontAwesome';
import MatIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Calls from '../assets/apiCalls.js'



class createAccount extends React.Component{
    constructor(props){
      super(props)
      this.state={
        username:null,
        password:null,
        email:null,
      }
    }

    signUpPOST = async () =>{
      url = 'http://127.0.0.1:5000/register'
      userInfo = {
        username:this.state.username,
        password:this.state.password,
        email:this.state.email
      }
      const response = await Calls.POST(url,userInfo)
      // console.log(response)
      if(response.status == 200){
        alert('Your account has been successfully created')
        this.props.navigation.goBack()
      }else{
        alert('Unable to sign up, username or email invalid')
      }



    }

    render(){
      return(
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logoStyle}
              source={require('../assets/detective-guy.png')}
            />
          </View>
          <View style={styles.inputContainerSignUp}>
            <Text style={{
              fontFamily:'Avenir',fontWeight:'bold',fontSize:25}}
            >Create Account</Text>
            <Input
            inputContainerStyle={[{margin:5},styles.inputStyle]}
            inputStyle={{padding:14}}
            leftIcon={
            <Icon
              name='user'
              size={24}
              color='#7b8738'
            />
            }
            returnKeyType={'next'}
            clearButtonMode='while-editing'
            onChangeText={(text) => this.setState({username:text})}
            value={this.state.username}
            onSubmitEditing={()=>this.passwordInput.focus()}
            blurOnSubmit={false}
            placeholder='Detective'/>
            <Input
              returnKeyType={'next'}
              inputContainerStyle={[{margin:5},styles.inputStyle]}
              inputStyle={{padding:14}}
              leftIcon={
              <Icon
                name='lock'
                size={24}
                color='#7b8738'
              />
              }
              placeholder='Password'
              ref={(input)=>{this.passwordInput = input}}
              clearButtonMode='while-editing'
              onChangeText={(text) => this.setState({password:text})}
              value={this.state.password}
              onSubmitEditing={()=>this.emailInput.focus()}
            />
            <Input
              returnKeyType={'done'}
              ref={(input)=>{this.emailInput = input}}
              clearButtonMode='while-editing'
              onChangeText={(text) => this.setState({email:text})}
              value={this.state.email}
              inputContainerStyle={[{margin:5},styles.inputStyle]}
              inputStyle={{padding:14}}
              leftIcon={
              <MatIcon
                name='email'
                size={24}
                color='#7b8738'
              />
              }
              placeholder='example@email.com'
            />
          </View>
          <View style={styles.buttonViewSignUp}>
            <Button onPress={()=>this.signUpPOST()}
            buttonStyle={{borderRadius:30,backgroundColor:'olive',width:300}}
            title='Sign Up' titleStyle={{fontFamily:'Avenir',fontWeight:'bold',fontSize:25}}
            />
          </View>


        </View>
      )
    }
}

export default createAccount;
