import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  // we will be using the useMemo hook as the socket is continuosly changing when the useEffect is running.

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [allMessages,setAllMessages]=useState([]);
  const [roomName,setRoomName]=useState("");

  console.log(allMessages);
  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected", socket.id);
    });
    socket.on("receive-msg", (data) => {
      console.log(data);
      setAllMessages((allMessages)=>[...allMessages,data]);
    });
    socket.on("welcome", (s) => {
      console.log(s);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };
  const joinRoomHandler=(e)=>{
    e.preventDefault();
    socket.emit('join-room',roomName);
    setRoomName("")
  }
  return (
    <Container>
      {/* <Typography variant="h4" component="div" gutterBottom>
        Welcome to socket .io
      </Typography> */}
      <Typography variant="h6" component="div" gutterBottom>
        {socketId}
      </Typography>
      <form onSubmit={joinRoomHandler} >
      <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="RoomName"
          variant="outlined"
        />
      </form>
      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
        />
        <Button variant="contained" color="primary" type="submit">
          Send
        </Button>
      </form>
      <Stack>
        {allMessages.map((m,i)=>(
          <Typography key={i} variant="h6" component="div" gutterBottom>{m}</Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
