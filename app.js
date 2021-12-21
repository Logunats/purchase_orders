const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
    limit: '50mb',
}));
app.use(cors({
  origin: '*',
  methods: 'GET,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
// app.use(routes);

app.use('/', routes);

app.listen(config.port, () => {
  console.log(`Server listening at port:${config.port}`);
});
