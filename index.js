const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// middle ware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kd8d4hj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
;


async function run(){
    const serviceCollection = client.db('paparrazo').collection('services')
    try{
        app.get('/',async(req,res)=>{
            const query = {}
            const cursor = serviceCollection.find(query);
            const result = await cursor.limit(3).toArray();
            res.send(result);
        })
        // geting all services
        app.get('/services',async (req,res)=>{
            const query = {}
            const cursor = serviceCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        // for a specific service
        app.get('/services/:id',async (req,res)=>{
            const id = req.params.id;
            console.log(id);
            const query = {_id:ObjectId(id)};
            const result = await serviceCollection.findOne(query);
            res.send(result);
        })
    }
    catch{}
    finally{}
}
run().catch(err=>console.error(err.message))
app.get('/',(req,res)=>{
    res.send('Server running')
})
app.listen(port,(req,res)=>{
    console.log(`Running on ${port}`);
})