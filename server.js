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
    console.error('Error fetching messages:', e);
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
    console.error('Error adding message:', e);
    res.status(500).json({ error: 'Failed to add message' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

2. Update your client-side JavaScript (in your HTML file or separate script.js):

```javascript
function loadMessages() {
    fetch('/api/messages')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(messages => {
        if (Array.isArray(messages)) {
            messages.forEach(msg => displayMessage(msg.name, msg.message));
        } else {
            console.error('Received data is not an array:', messages);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function displayMessage(name, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `<strong>${name}:</strong> ${message}`;
    document.getElementById('messageList').prepend(messageElement);
}

// Call loadMessages when the page loads
document.addEventListener('DOMContentLoaded', loadMessages);