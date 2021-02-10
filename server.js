require('dotenv').config()
const express = require('express');
const app = express();
const busboy = require('connect-busboy');
const mongoose = require('mongoose');
const cors = require('cors')
app.use(cors());
app.use(busboy()); 
const routes = require('./routes/routes');
app.use(routes)
require('./services/cache');

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
    console.log("Connection Successful!");
});


module.exports = {
    app,
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`listen on port: ${PORT}`)
})
