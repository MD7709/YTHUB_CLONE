import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('offer', (data) => {
    console.log('Received offer from', socket.id, 'to', data.target);
    socket.broadcast.emit('offer', data);
  });

  socket.on('answer', (data) => {
    console.log('Received answer from', socket.id, 'to', data.target);
    socket.broadcast.emit('answer', data);
  });

  socket.on('ice-candidate', (data) => {
    console.log('Received ice-candidate from', socket.id, 'to', data.target);
    socket.broadcast.emit('ice-candidate', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
