import dbProd from "../dbs/dbProds.js"
import dbMsg from "../dbs/dbMsg.js"
import {normalize} from 'normalizr'
import mySchema from "../normalize/normailize.js"
import logguer from "../logs/logger.js"


const ioServer=(io)=>{
    
    const DB= new dbProd()
    const MdB =new dbMsg()
    io.on('connection',(socket)=>{
        try{
            logguer.info('nuevo cliente conectado '+ socket.id)
        DB.getAll().then(productos =>{
            socket.emit('productos', productos)
        })  
        MdB.getAll().then(mensajes=>{
            let normalizado =normalize(mensajes, mySchema)
            socket.emit('mensajes',normalizado)
        }) 
        }
        catch(error){
            logguer.error('error on connection',error)
        }
         
        
        socket.on('new-prod', (data)=>{
       try{
            DB.save(data)
            DB.getAll().then(productos =>{
                io.sockets.emit('productos', productos)
            }) 
        }
        catch(error){
            logguer.error('error on new-prod',error)
        } 
        }) 
        socket.on('new-msj', (data)=>{
        try{
            MdB.save(data)
            MdB.getAll().then(mensajes=>{
                let normalizado =normalize(mensajes, mySchema)
                io.sockets.emit('mensajes',normalizado)
            }) 
        }
        catch(error){
            logguer.error('error on new-msj',error)
        }
             
        }) 
    })


}



export default ioServer