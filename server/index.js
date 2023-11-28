const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const businessSchema = require("./models/business");


require("dotenv").config();

const useRoutes = require("./routes/user");
const businessRoutes = require("./routes/business");

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000', // o la URL de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // habilitar credenciales de cookies
    optionsSuccessStatus: 204, // algunos navegadores 204 o 200 para las solicitudes OPTIONS
  };


app.use(cors(corsOptions));

const port = process.env.PORT || 9000 ;

//middleware
app.use(express.json());
app.use('/api', useRoutes);
app.use('/api', businessRoutes);
app.use(cors());


// connection to mongoDB
mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'estructuras'
})
.then(() => console.log('Connected Mongo DB Atlas'))
.catch((error) => console.log(error));


app.listen(port, () => console.log('server listening on port', port));