const express = require('express');
const { logreqres } = require('./Middleware');
const { connecttoMongoDB } = require('./Connection');
const userrouter = require('./routes/user');

const app = express();
const port = 3000;

// Connection
connecttoMongoDB('mongodb://127.0.0.1:27017/yt-app-1')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Middleware Plugins
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logreqres('log.txt'));

// Routes
app.use('/api/users', userrouter);
app.use('/users', userrouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
