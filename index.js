const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const port =process.env.port||5000;
 const app =express();


 //middleware
 app.use(cors());
 app.use(express.json())


 function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        console.log('decoded', decoded);
        req.decoded = decoded;
        next();
    })
}
 
 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3jrjtso.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db('geniusCar').collection('service');
        const orderCollection =client.db('geniusCar').collection('order')

//AUTH
app.post('/login',async(req,res)=>{
    const user =req.body;
    const accessToken =jwt.sign(user,process.env.JWT_SECRET_KEY,{
        expiresIn: '1d'
    });
    res.send({ accessToken });
    
})
//service API
        app.get('/service',async(req,res)=>{
            const query ={};
            const cursor =serviceCollection.find(query)
            const services =await cursor.toArray(); 
            res.send(services);
        });
        app.get('/service/:id',async(req,res)=>{
            const id =req.params.id;
            const query ={_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })
        //POST
        app.post('/service',async(req,res)=>{
            const newService =req.body;
            const result = await serviceCollection.insertOne(newService)
            res.send(result)
        })
        //delete
        app.delete('/service/:id',async(req,res)=>{
            const id =req.params.id;
            const query={_id:ObjectId(id)}
            const result =await serviceCollection.deleteOne(query)
            res.send(result)

        })
        //order collection API
        app.get('/order', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email;
            const email = req.query.email;
            if (email === decodedEmail) {
                const query = { email: email };
                const cursor = orderCollection.find(query);
                const orders = await cursor.toArray();
                res.send(orders);
            }
            else{
                res.status(403).send({message: 'forbidden access'})
            }
        })
        app.post('/order',async (req,res) =>{
            const order =req.body;
            const result =await orderCollection.insertOne(order)
            res.send(result)
            console.log(result)
        })
    }
    finally{

    }

}
run().catch(console.dir)




app.get('/hero',(req,res)=>{
    res.send('hero meets hero ku')
})

 app.get('/',(req,res)=>{
    res.send('Running Ginus Server')

 })
 app.listen(port,()=>{
    console.log('listenning to port',port)
 })
