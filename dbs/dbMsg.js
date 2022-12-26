import logguer from '../logs/logger.js'
import fs from 'fs'


export default class dbMsg {
    constructor(){
    }
    async  save(objeto){
        let objetos=[]
        try{
            let leer = await fs.promises.readFile(`./db/mensajes.json`, 'utf-8')
            objetos =  JSON.parse(leer)
            
       /*      if(objetos.length > 0){
                let maxId = objetos[0].id
                for(let i =0; i< objetos.length; i++){
                    if(maxId < objetos[i].id){
                        maxId=objetos[i].id
                    }
                objeto.id = maxId+1
                }
             }
             else objeto.id = 1 */

            
            objetos.push(objeto)
            await fs.promises.writeFile(`./db/mensajes.json`, JSON.stringify(objetos))
            return objeto.id
        }catch(err){
            logguer.error(`hubo un error al guardar el archivo : ${err}`)
        }
    }
    async getAll(){
        try{
            let leer = await fs.promises.readFile(`./db/mensajes.json`, 'utf-8')
            let encontrado =  JSON.parse(leer)
            if(encontrado){
                    return encontrado
                }else{
                    return null
                } 
       
        }catch(err){
            logguer.error(`hubo un error al buscar todos : ${err}`)
        } 
    }
}
