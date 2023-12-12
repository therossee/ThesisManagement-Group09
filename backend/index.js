'use strict';

/*** Setup Environment ***/
const dotenv = require("dotenv");
dotenv.config({ DOTENV_KEY: process.env.TM_DOTENV_KEY });

const app = require('./app');

/*** Starting server ***/
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
