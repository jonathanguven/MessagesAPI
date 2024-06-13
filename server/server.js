import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(cors())

let clients = {}
let userId = 0

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

  res.write(`Client connected to room ${room} as user ${id} (total: ${clients[room].length})\n\n`)

  req.on('close', () => {
    console.log(`User disconnected from room ${room}`)
    clients[room] = clients[room].filter(client => client.id !== id)
    res.end()
  })
});

const sendToClients = (room, message) => {
  if (!clients[room]) {
    return
  }
  clients[room].forEach(client => {
    client.res.write(`data: ${JSON.stringify({ message })}\n\n`)
  })
}

app.post('/send', (req, res) => {
  const { key, room, message } = req.body
  console.log(req.body)
  if (key == '123') {
    const chatRoom = room || 'general'
    sendToClients(chatRoom, message)
    res.json({ 'clients': clients[room]?.length || 0 })
  } else {
    res.json({ 'error': 'invalid API key' })
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
