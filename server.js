require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/connectMongoDB'); 

const app = express();

connectDB();


app.use(cors()); 
app.use(express.json());


app.get('/', (req, res) => {
    res.send('API port is running');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));