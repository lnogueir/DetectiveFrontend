
const Calls = {
   POST: (url,data) => {
      response = fetch(url,{
      method:'POST',
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
      },
      body:JSON.stringify(data)
    })
    return response
  },
  GET: (url) => {
    return fetch(url)
  },
  DELETE:(url,data)=>{
    response = fetch(url,{
      method:'DELETE',
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
      },
      body:JSON.stringify(data)
    })
    return response
  },
  PUT:(url,data)=>{
    response = fetch(url,{
      method:'PUT',
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
      },
      body:JSON.stringify(data)
    })
    return response
  },
  }



export default Calls;
