import  express from "express"
import {Server as HTTPServer} from "http"
import {Server as SocketServer} from "socket.io"
import router from "./routers/routes.js"
import session from "express-session"
import sessionOptions from "./sessions/session.js"
import {  DBConnect } from "./dbs/dbUsers.js"
import passport from "./sessions/passport.js"
import ioServer from "./io/io.js"
import * as dotenv from 'dotenv'
import ParseArgs from 'minimist'
import routerRandom from "./routers/routerRandom.js"
import cluster from "cluster"
import logger from "./logs/logger.js"
//import { cpus } from "os"

let{modo}=ParseArgs(process.argv.slice(2))
const PORT = process.env.PORT|| 8081



const serverExpress = ()=>{
    dotenv.config()

    const app = express()
    const httpServer= new HTTPServer(app)
    const io = new SocketServer(httpServer)
    ioServer(io)

    app.use((req,res,next)=>{
        logger.info(`Request ${req.method} at ${req.url}`)
        next()
    })

    app.use(express.static('views'))
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(session(sessionOptions)) 

    app.use(passport.initialize())
    app.use(passport.session())

    app.use('/',router)
    app.use('/api/randoms',routerRandom)

    app.all('*',(req,res)=>{
        logger.warn(`Request ${req.method} at ${req.url} not found`)
        res.send({error:'Ruta no implementada'})
    })
    DBConnect()
    httpServer.listen(PORT, ()=>{logger.info(`servidor con pid ${process.pid} escuchando en el puerto ${httpServer.address().port}`)})
    httpServer.on('error',error=>logger.error(`Error en servidor ${error}`))
}

    if(modo === 'cluster'){
        if(cluster.isPrimary){
            for(let i =0; i<3/* cpus().length */;i++){// Si le pongo todos los nucleos me crashea mongo atlas
                cluster.fork()
            }
            logger.info(`primary pid ${process.pid}`)
            cluster.on('exit',(worker,code,signal)=>{
                logger.warn(`Worker with id ${worker.process.pid} Killed`)
                cluster.fork()
            })
        }else{
           serverExpress()
        }
    }else{
        serverExpress()
    }
    


