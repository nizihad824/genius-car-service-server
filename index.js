const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port =process.env.port||5000;
 const app =express();


 //middleware
 app.use(cors());
 app.use(express.json())



 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3jrjtso.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log('genius car database is connected')
  // perform actions on the collection object
  client.close();
});


 app.get('/',(req,res)=>{
    res.send('Running Ginus Server')

 })
 app.listen(port,()=>{
    console.log('listenning to port',port)
 })