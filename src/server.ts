import express, {Application} from "express";
import { createServer, Server as HttpServer } from "http"
import cors, { CorsOptions } from "cors";
import logger from 'morgan';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import { connectDb } from "./config";

dotenv.config();


const app: Application = express();

// middelware
const corsOptions: CorsOptions = { credentials: false};
app.use(logger('dev'))
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

connectDb();



const PORT: string | number = process.env.PORT || 8000;

// app.listen(PORT, () => console.log(`server started on ${PORT}`))
const server: HttpServer = createServer(app);
server.listen(PORT, () => console.log(`server started on ${PORT}`))