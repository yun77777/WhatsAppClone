import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, InsertEmoticon, SearchOutlined, SettingsInputAntenna } from '@material-ui/icons';
import MoreVert from '@material-ui/icons/MoreVert';
import React, {useEffect, useState} from "react";
import MicIcon from '@material-ui/icons/Mic';
import axios from './axios';
import "./Chat.css"


function Chat({messages}) {
    const [input, setInput] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

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

    const test = async(e) =>{
        e.preventDefault();
        alert('a')
    }

    const onChange = (e) => {
        setImage(e.target.files[0]);
    }

    const onClick = async() => {
        const formData = new FormData();
        formData.append('file', img);
        const res = await axios.post('/api/upload', formData);
        console.log(res);
    }

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        console.log("event.target.files[0]:",event.target.files[0]);
    }

    const handleFileUpload = () => {
        const formData = new FormData();

        formData.append("userfile", selectedFile, selectedFile.name);

        axios.post('api/uploadfile', formData)
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
    };


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
                    <div>
                        {/* <input type="file" onChange={handleFileChange}/>
                        <IconButton onClick={handleFileUpload}> */}
                        <input type="img" onChange={onChange}/>
                        <IconButton onClick={onClick}>
                            <AttachFile/>
                        </IconButton>
                    </div>
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
