import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(cors())

let clients = {}
let userId = 0

if (!clients['general']) {
  clients['general'] = [];
}

const logClientAction = (action, room, id) => {
  console.log(`${action} - Room: ${room}, User ID: ${id}`);
};

const checkRoomExists = (req, res, next) => {
  const room = req.body.room || 'general';
  if (room !== 'general' && !clients[room]) {
    return res.status(404).json({ error: `Room '${room}' does not exist` });
  }
  next();
};

app.get('/listen', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const room = req.query.room || 'general'

  if (!clients[room]) {
    clients[room] = []
  }

  userId += 1
  let id = userId
  clients[room].push({ id, res })
  logClientAction('Connected', room, id);
  res.write(`Client connected to room ${room} as user ${id} (total: ${clients[room].length})\n\n`)

  req.on('close', () => {
    logClientAction('Disconnected', room, id);
    clients[room] = clients[room].filter(client => client.id !== id)
    res.end()
  })
});

const sendToClients = (room, message) => {
  if (!clients[room]) {
    return
  }
  clients[room].forEach(client => {
    client.res.write(`data: ${JSON.stringify({ id: client.id, message })}\n\n`)
  })
}

app.post('/send', checkRoomExists, (req, res) => {
  const { key, room, message } = req.body
  if (!key || !message) {
    res.status(400).json({ error: 'Missing required fields' });
  }
  if (key !== '123') { 
    res.status(401).json({ error: 'Invalid API key' });
  }
  const chatRoom = room || 'general'
  console.log(`Sending message to room ${chatRoom}: ${message}`);
  sendToClients(chatRoom, message)
  res.json({ 'clients': clients[chatRoom]?.length || 0 })
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
