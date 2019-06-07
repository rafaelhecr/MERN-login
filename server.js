const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json())
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
)

const mongoURI = 'mongodb://localhost:27017/mernloginreg'

mongoose
    .connect(mongoURI, {useNewUrlParser: true})
    .then(() => console.log('Conectado a MongoDB'))
    .catch(()  => console.log(`Error a conectar a MongoDB: ${err}`))

const Users = require('./routes/Users');

app.use('/users', Users)

app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto ${PORT}`);
})