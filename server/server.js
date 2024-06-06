import express from 'express'
import bodyParser from 'body-parser'

const app = express()
const port = 3000

app.use(bodyParser.json())

let clients = []

app.get('/listen', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  console.log('Client connected')

  clients.push(res)

  req.on('close', () => {
    res.end()
  })
});

const sendToClients = () => {
  clients.forEach(client => {
    client.write('data: ' + JSON.stringify({ 'message': 'hi :3' }) + '\n\n')
  })
}

app.post('/send', (req, res) => {
  if (req.body.apikey == '123') {
    sendToClients()
    res.json({ 'yay': clients.length })
  } else res.json({ 'asd': 'asd' })
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
