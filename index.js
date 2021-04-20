
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express()
app.use(cors());
app.use(bodyParser.json())
const port = process.env.PORT || 4500
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const { reset } = require('nodemon');
console.log(process.env.DB_PASS, process.env.DB_USER)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.77ufn.mongodb.net/ProServicing?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const Ordercollection = client.db("ProServicing").collection("Orders");
  const ServiceCollection = client.db("ProServicing").collection("Services");
  const ReviewCollection = client.db("ProServicing").collection("Reviews");
  const AdminCollection = client.db('ProServicing').collection("Admin")
  // perform actions on the collection object

  app.post('/addOrder', (req, res) => {
    const Order = req.body;
    Ordercollection.insertOne(Order)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/service', (req, res) => {
    ServiceCollection.find({})
      .toArray((err, service) => {
        res.send(service);

      })
  })

  app.post('/addService', (req, res) => {
    const Service = req.body;
    ServiceCollection.insertOne(Service)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/review', (req, res) => {
    ReviewCollection.find({})
      .toArray((err, review) => {
        res.send(review);
        if (err) {
          res.send(err)
        }
      })
  })

  app.post('/addReview', (req, res) => {
    const Review = req.body;
    ReviewCollection.insertOne(Review)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  app.post('/orderList', (req, res) => {
    const email = req.body.email;
    AdminCollection.find({ email: email })
      .toArray((err, admin) => {
        const filter = {}
        if (admin.length === 0) {
          filter.email = email;
        }
        Ordercollection.find(filter)
          .toArray((err, documents) => {
            res.send(documents);
          })
      })
  })





  app.post('/addAdmin', (req, res) => {
    const Admin = req.body;
    AdminCollection.insertOne(Admin)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/deleteService/:id', (req, res) => {
    ServiceCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0)
      })
  })

  app.patch('/update/:id', (req, res) => {
    console.log(req.body.status);
    Ordercollection.updateOne({ '_id': ObjectId(req.params.id) },
      {
        $set: { status: req.body.status }
      })
      .then(result => {
        res.send(result.modifiedCount > 0);
      })
  })




  app.post('/isAdmin', (req, res) => {
    const email = req.body.email

    AdminCollection.find({ email: email })
      .toArray((err, doctor) => {
        res.send(doctor.length > 0)
      })
  })
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
