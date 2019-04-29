import React from 'react';
import {AsyncStorage,ActivityIndicator, TextInput,Alert,Linking,
  TouchableHighlight,TouchableOpacity,FlatList,
  AppRegistry,ScrollView,Text,View,Image} from 'react-native';
import {Input,Button} from 'react-native-elements'
import styles from '../assets/styleSheet.js'
import Icon from 'react-native-vector-icons/FontAwesome';
import Calls from '../assets/apiCalls.js'

class Login extends React.Component{
    constructor(props){
      super(props)
      this.state={
        username:null,
        password:null,
        error:false
      }
    }

    handleLogin = async () =>{
      url = 'http://127.0.0.1:5000/auth'
      userInfo = {
        username:this.state.username,
        password:this.state.password,
      }
      const response = await Calls.POST(url,userInfo)
      const responseJson = await response.json()
      if(response.status==200){
        AsyncStorage.setItem('username', this.state.username);
        this.props.navigation.navigate('Main')
      }else{
        this.setState({error:true})
      }
    }

    render(){
      return(
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.fontHeader}>Login Detective</Text>
          </View>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logoStyle}
              source={require('../assets/detective-guy.png')}
            />
          </View>
          <View style={styles.inputContainerLogin}>
            <Text style={{
              fontFamily:'Avenir',fontWeight:'bold',fontSize:25}}
            >Login</Text>
            <Input
            returnKeyType={'next'}
            clearButtonMode='while-editing'
            onChangeText={(text) => this.setState({username:text})}
            value={this.state.username}
            onSubmitEditing={()=>this.passwordInput.focus()}
            blurOnSubmit={false}
            inputContainerStyle={[{margin:5},styles.inputStyle]}
            inputStyle={{padding:14}}
            leftIcon={
            <Icon
              name='user'
              size={24}
              color='#7b8738'
            />
            }
            placeholder='Detective'
            />
            <Input
            secureTextEntry={true}
            returnKeyType={'go'}
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
            onSubmitEditing={()=>this.handleLogin()}
            />
            <Text style={{color:this.state.error?'red':'transparent'}}>Invalid username or password</Text>
          </View>
          <View style={styles.buttonViewLogin}>
            <Button onPress={()=>this.handleLogin()}
            buttonStyle={{borderRadius:30,backgroundColor:'#4f4338',width:300}}
            title='Sign in' titleStyle={{fontFamily:'Avenir',fontWeight:'bold',fontSize:25}}
            />
            <Text style={{marginVertical:15,alignSelf:'center',color:'gray',fontSize:23}}>─────  Or  ─────</Text>
            <Button onPress={()=>this.props.navigation.navigate('createAccount')}
            buttonStyle={{borderRadius:30,backgroundColor:'olive',width:300}}
            title='Create an Account' titleStyle={{fontFamily:'Avenir',fontWeight:'bold',fontSize:25}}
            />
          </View>


        </View>
      )
    }
}

export default Login;
