import logguer from "../logs/logger.js"

export default class baseDeDatos {
    constructor(datos){
        this.datos =datos
    }

    async getAll(){
         try{
           return this.datos
          
        }catch(err){
            logguer.error(`hubo un error al leer todos : ${err}`)
            throw err
        } 
    }

    async  save(objeto){
        logguer.info(objeto)
        try{
            this.datos.push(objeto)
        }catch(err){
            logguer.error(`hubo un error al guardar : ${err}`)
            throw err
        } 
    }
 
}


