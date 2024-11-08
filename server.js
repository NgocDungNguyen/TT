const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const uri = "mongodb+srv://inuyashayt2004:K81GAz3NdaWXUWzv@cluster0.lhks7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (e) {
    console.error('Failed to connect to MongoDB', e);
  }
}

connectToDatabase();

app.get('/api/messages', async (req, res) => {
  try {
    const database = client.db('birthdayApp');
    const messages = database.collection('messages');
    const result = await messages.find().sort({ timestamp: -1 }).toArray();
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const database = client.db('birthdayApp');
    const messages = database.collection('messages');
    const newMessage = {
      name: req.body.name,
      message: req.body.message,
      timestamp: new Date()
    };
    await messages.insertOne(newMessage);
    res.status(201).json(newMessage);
  } catch (e) {
    res.status(500).json({ error: 'Failed to add message' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});