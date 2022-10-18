const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

let tasks = []

//middleware
app.use(express.urlencoded ({ extended:false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/client')));

app.use((req, res) => {
    res.status(404).send('404 not found...');
});

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    
    socket.broadcast.emit('updateData', tasks);
    
    socket.on('addTask', (task) => {
        tasks.push(task);
        socket.broadcast.emit('addTask', tasks);
    });

    socket.on('removeTask', (taskId) => {
        tasks = tasks.filter((task) => task.id !== taskId);
        socket.broadcast.emit('removeTask', taskId);
    });
});






