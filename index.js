const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const {
  MongoClient,
  ServerApiVersion,
  ObjectId
} = require('mongodb');
const res = require('express/lib/response');
const port = process.env.PORT || 5000;



app.use(express.json());
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tiivm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});
async function run() {
  try {
    await client.connect();
    const projectCollection = client.db("projects").collection("project");
    console.log('connected');
    // read all data
    app.get('/omar/projects', async (req, res) => {
      const q = req.query;
      const coursor = projectCollection.find(q);
      const result = await coursor.toArray();
      res.send(result);
    });

    app.post('/omar/project', async (req, res) => {
      const data = req.body;
      const result = projectCollection.insertOne(data)
      res.send(result);
    });
    // read a data by id
    // http://localhost:5000/bikes/626c843b9e3c0e5df2c06ce9
    app.get('/omar/projects/:id', async (req, res) => {
      const id = req.params.id;
      const find = {
        _id: ObjectId(id)
      };
      const result = await projectCollection.findOne(find)
      res.send(result)
    });

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/omar', (req, res) => {
  res.send('Hi, I am your awesome server');
});

app.listen(port, () => {
  console.log(`server running ${port}`);
});