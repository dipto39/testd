import dotenv from 'dotenv'
dotenv.config({ path: process.env.NODE_ENV === 'production' ? './.env.production' : './.env' })

import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import { Server } from "http";
import express from 'express';
import mongoose from 'mongoose';
import apiRoutes from './routes/api'
// import { decodeToken } from './middlewares/auth.middleware'


const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined');
}

mongoose.connect(databaseUrl).then(() => {
    console.log('MongoDB Connected Successfully.')
}).catch((err) => {
    console.log('Database connection failed.')
})


const PORT = process.env.PORT || 8000;
const app = express();

const server = new Server(app);


app.use(compression(
    {
        level: 9,
        threshold: 100 * 1000,
        filter: (req, res) => {
            if (req.headers['x-no-compression']) {
                return false
            }
            return compression.filter(req, res)
        }
    }
))
app.use(helmet())
app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    )
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    next()
});
app.use(cors())
// app.use(decodeToken)
app.use('/api', apiRoutes)
app.get('*', (req, res) => {
    res.send('Welcome to Pet-pals backend!');
})

server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})