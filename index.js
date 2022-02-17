require('dotenv').config();
const express = require('express');
const app = express();
const connection = require('./database/db')
const bodyParser = require('body-parser');

const port = process.env.PORT || 8000;

//- Using body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//- set view engine //(ejs) 
app.set('view engine', 'ejs')

//- Serving Static files
app.use(express.static('public'))

//- Add Path of Routes

app.use(require('./routes/index'));

//- Add DataBase
connection();




app.listen(port, () => {
    console.log(`Listening to the port ${port}`);
})

