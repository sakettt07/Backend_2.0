import React, { useEffect } from 'react';
import {io} from "socket.io-client"

const App = () => {
  const socket=io("http://localhost:3000");
  useEffect(()=>{

    socket.on("connect",()=>{
      console.log("Connected",socket.id)
    })
  },[])
  return (
    <div>
      This is my Socket.io Application
      
    </div>
  )
}

export default App
