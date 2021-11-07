import React, {useEffect, useState} from "react";
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Pusher from 'pusher-js';
import axios from './axios';

function App() {
  const [messages, setMessages] = useState([]);
  useEffect(()=>{
    axios.get('/messages/sync')
      .then(response => {
        setMessages(response.data);
      })
  },[]);

  useEffect(()=>{
    const pusher = new Pusher('cf2e3abc9169b4cc823c', {
      cluster: 'ap3'
    });

    const channel = pusher.subscribe('messages');
    console.log(channel)
    channel.bind('inserted', (data) => {
      // alert(JSON.stringify(data));
      setMessages([...messages, data]);
    });

    return ()=>{
      channel.unbind_all();
      channel.unsubscribe();
    };

  },[messages]);
  
  console.log(messages);

  return (
    <div className="App">
      <div className="app__body">
        <Sidebar/>
        <Chat messages={messages}/>
      </div>
      
    </div>
  );
}

export default App;
