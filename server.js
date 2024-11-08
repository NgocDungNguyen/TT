const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const messagesFile = path.join(__dirname, 'messages.json');

// Ensure the messages file exists
if (!fs.existsSync(messagesFile)) {
  fs.writeFileSync(messagesFile, '[]');
}

app.get('/api/messages', (req, res) => {
  const messages = JSON.parse(fs.readFileSync(messagesFile));
  res.json(messages);
});

app.post('/api/messages', (req, res) => {
  const messages = JSON.parse(fs.readFileSync(messagesFile));
  const newMessage = {
    name: req.body.name,
    message: req.body.message,
    timestamp: new Date().toISOString()
  };
  messages.push(newMessage);
  fs.writeFileSync(messagesFile, JSON.stringify(messages));
  res.status(201).json(newMessage);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
