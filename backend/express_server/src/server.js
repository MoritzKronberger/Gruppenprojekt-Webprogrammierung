/* from https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_express_01a 
and https://gitlab.multimedia.hs-augsburg.de/kowa/wk_express_hello_world_01 */

import express from "express";
import cors from "cors";

import * as uuid from "uuid";
//import auth      from './routes/auth.js'
import { auth } from "./routes/auth.js";
import { accounts } from "./routes/accounts.js";
import { ValidationError } from "express-json-validator-middleware";

const { PORT = 3000, SERVER = `http://localhost:${PORT}` } = process.env;
const c_app = express();
const c_uuid = uuid.v4;

c_app.use('/v1',          auth);
c_app.use("/v1/accounts", accounts);

c_app.get("/v1/uuid", (req, res) => res.status(200).json(c_uuid()));

//c_app.get("/v1", (req, res) => res.status(200).json("hello world"));

c_app.use((error, req, res, next) => {
  if (error instanceof ValidationError) {
    res.status(400).send(error.validationErrors);
    next();
  } else {
    next(error);
  }
});

c_app.listen(PORT);

//c_app.use(cors());

console.log(`Running on ${SERVER}`);