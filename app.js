const express = require('express');

const app = express();

app.use(express.json())

//Define Routes
app.use('/',require('./routes/router'));

app.listen(3000);
console.log("Server started on port 3000")
