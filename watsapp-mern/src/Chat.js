import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, InsertEmoticon, SearchOutlined, SettingsInputAntenna } from '@material-ui/icons';
import MoreVert from '@material-ui/icons/MoreVert';
import React, {useEffect, useState} from "react";
import MicIcon from '@material-ui/icons/Mic';
import axios from './axios';
import "./Chat.css"


function Chat({messages}) {
    const [input, setInput] = useState("");

    const sendMessage = async(e) =>{
        e.preventDefault();

        axios.post('/messages/new', {
            message: input,
            name: "app",
            timestamp: "Just now",
            received: false
        });

        setInput('');
    }

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar/>
                <div className="chat__headerInfo">
                    <h3>Room name</h3> 
                    <p>Last seen at...</p>
                </div>
                <div className="chaht__headerRight">
                    <IconButton>
                        <SearchOutlined/>
                    </IconButton>
                    <IconButton>
                        <AttachFile/>
                    </IconButton>
                    <IconButton>
                        <MoreVert/>
                    </IconButton>
                </div>
            </div>
            <div className="chat__body">
                {messages.map((message) => (
                    <p className={`chat__message ${message.received && "chat__receiver"}`}>
                    <span className="chat__name">{message.name}</span>
                        {message.message}
                    <span className="chat__timestamp">
                        {message.timestamp}
                    </span>
                </p>
                ))}
                
            </div>
            <div className="chat__footer">
                <InsertEmoticon/>
                <form>
                    <input value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type a message" 
                    type="text"
                    />
                    <button onClick={sendMessage} 
                    type="submit">
                        Send a message
                    </button>
                </form>
                <MicIcon/>
            </div>
        </div>
    );
}

export default Chat
