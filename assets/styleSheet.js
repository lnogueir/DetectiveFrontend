import {StyleSheet} from 'react-native';


// user-secret icon fontAwesome!!

const styles = StyleSheet.create({
  containerLogin:{
    height:'100%',
    width:'100%',
    flex:1
  },
  headerContainerLogin:{
    height:'10%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'olive'
  },
  headerContainer:{
    height:'13%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'olive'
  },
  fontHeader:{
    paddingTop:30,
    fontFamily:'Avenir',
    fontSize:26,
    fontWeight:'900'
  },
  logoContainer:{
    height:'22%',
    marginVertical:15,
    alignItems:'center',
    justifyContent:'center'
  },
  logoStyle:{
    borderRadius:50,
    overflow:'hidden',
    width:120,
    height:135
  },
  inputContainerLogin:{
    flexDirection:'column',
    alignItems:'center',
    height:'20%',
    justifyContent:'center'
  },
  inputStyle:{
    borderRadius:30,
    borderColor:'#4f4338',
    borderWidth:1
  },
  buttonViewLogin:{
    marginVertical:25,
    height:'20%',
    width:'100%',
    flexDirection:'column',
    justifyContent:'space-evenly',
    alignItems:'center'
  },
  buttonViewSignUp:{
    height:'15%',
    width:'100%',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
  },

  inputContainerSignUp:{
    flexDirection:'column',
    alignItems:'center',
    height:'35%',
    justifyContent:'center'
  },
  detectiveResultTitle:{
    backgroundColor:'#4f4338',fontSize:24,
      textAlign:'center',padding:15,fontFamily:'Avenir',
      color:'white',fontWeight:'bold'
  },
  headerTitleStyle:{fontSize:20,color:"white",fontWeight:'600'}  






});

export default styles;
