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
    const reviewCollection = client.db('paparrazo').collection('reviews')
    
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
            // console.log(id);
            const query = {_id:ObjectId(id)};
            const result = await serviceCollection.findOne(query);
            res.send(result);
        })
        app.get('/reviews',async (req,res)=>{
            const query = {}
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        // adding review
        app.post('/reviews',async (req,res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })
        //get reviews of logged user
        app.get('/myreviews',async(req,res)=>{
            const email = req.query.email;
            const query = {email:email}
            const options = {
                    sort: { date: -1 ,zone:-1, time:-1 , }
                }
            const cursor = reviewCollection.find(query,options);
            const result = await cursor.toArray();
            res.send(result)
        })
        // deleting review of a user
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
        app.get('/review/:id',async(req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.findOne(query);
            res.send(result)
        })
        // updating review
        app.patch('/review/:id',async(req,res)=>{
            const id = req.params.id;
            // console.log(id);
            const title = req.body.title
            const description = req.body.description
            const rating = req.body.rating
            const date = req.body.date
            const time = req.body.time
            const zone = req.body.zone
            console.log(title,description,rating,date,time,zone);
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set:{
                    title:title,
                    description:description,
                    rating:rating,
                    date:date,
                    time:time,
                    zone:zone
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc);
            res.send(result);
        })
        //inserting service
        app.post('/services',async (req,res)=>{
            const service = req.body;
            // console.log(service);
            const result = await serviceCollection.insertOne(service);
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