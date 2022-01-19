// importing
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1293688",
  key: "cf2e3abc9169b4cc823c",
  secret: "fd38fe870c9e7ecdd6a3",
  cluster: "ap3",
  useTLS: true
});

app.use(express.json());
app.use(cors());

const password=process.env.DB_PW;
console.log("pw:",password)
const connection_url = process.env.ATLAS_URI;

mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once('open', ()=>{
    console.log('DB is connected');

    const msgCollection = db.collection('messagecontents');
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change)=>{
        console.log('A change occured', change);

        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted',{
               name: messageDetails.name,
               message: messageDetails.message,
               timestamp: messageDetails.timestamp,
               received: messageDetails.received
            });
        } else{
            console.log("Error triggering pusher");
        }
    });
});

// api routes
app.get('/',(req, res)=>res.status(200).send('hello world'));

app.get('/messages/sync', (req, res)=>{
    Messages.find((err, data)=>{
        if(err){
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    }) 
});

app.post('/messages/new', (req, res)=>{
    const dbMessage=req.body;
    Messages.create(dbMessage, (err, data)=>{
        if(err){
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
});

app.listen(port, ()=>console.log(`Listening on localhost:${port}`))