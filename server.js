const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const uri = "mongodb+srv://inuyashayt2004:K81GAz3NdaWXUWzv@cluster0.lhks7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let database;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    database = client.db('birthdayApp');
  } catch (e) {
    console.error('Failed to connect to MongoDB', e);
    process.exit(1); // Exit the process if we can't connect to the database
  }
}

app.get('/api/messages', async (req, res) => {
  try {
    if (!database) {
      await connectToDatabase();
    }
    const messages = database.collection('messages');
    const result = await messages.find().sort({ timestamp: -1 }).toArray();
    res.json(result);
  } catch (e) {
    console.error('Error fetching messages:', e);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    if (!database) {
      await connectToDatabase();
    }
    const messages = database.collection('messages');
    const newMessage = {
      name: req.body.name,
      message: req.body.message,
      timestamp: new Date()
    };
    await messages.insertOne(newMessage);
    res.status(201).json(newMessage);
  } catch (e) {
    console.error('Error adding message:', e);
    res.status(500).json({ error: 'Failed to add message' });
  }
});

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(error => {
  console.error('Failed to start the server:', error);
});