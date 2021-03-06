import express, {Application} from "express";
import { createServer, Server as HttpServer } from "http"
import cors, { CorsOptions } from "cors";
import logger from 'morgan';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import { connectDb } from "./config";
import indexRouter from './routes/index';
import { ERROR_MESSAGES } from "./constants";

dotenv.config();


const app: Application = express();

// middelware
const corsOptions: CorsOptions = { credentials: false};
app.use(logger('dev'))
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const PORT: string | number = process.env.PORT || 8000;
// app.listen(PORT, () => console.log(`server started on ${PORT}`))
const server: HttpServer = createServer(app);

connectDb().then(async () => {
    const URL_PREFIX= '/api/v1'
    app.use(`${URL_PREFIX}`, indexRouter)

    // error handeling
    app.use('*', (req, res) => {
        return res.status(404).json({
            success: false,
            message: ERROR_MESSAGES.ENDPOINT_NOT_FOUNT
        })
    })

    server.listen(PORT, () => console.log(`server started on ${PORT}`))
});



