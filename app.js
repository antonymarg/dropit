const express = require('express');
const app = express();

require('dotenv').config()


app.use(express.json())

//Define Routes
app.use('/',require('./routes/router'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });




