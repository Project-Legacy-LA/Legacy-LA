import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import https from "https"
import dotenv from "dotenv"
import {Pool} from "pg"
import { listTables } from "./models/pg.js";


dotenv.config()

const app = express();
const port = process.env.APP_PORT || 400;

// database config
const pool = new Pool({user:process.env.DB_USER,
                      host: process.env.DB_HOST,
                      database: process.env.DB_DATABASE,
                      password: process.env.DB_PASSWORD,
                      port: process.env.DB_PORT,
                    })

app.use(bodyParser.json())
app.use(cors)

app.listen(port, ()=>{
  console.log(`the server is running on port: ${port}`)
})

listTables(pool)