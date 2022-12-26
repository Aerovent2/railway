import express from 'express'
import numerosRandom from '../workers/generateRandom.js'
const {Router}= express
const routerRandom=Router()
//import {fork} from 'child_process'
//import { join } from 'path' 
//import url from 'url'
/* const __dirname = url.fileURLToPath(new url.URL('.',import.meta.url))
const rutaRandom=join(__dirname,'../workers/generateRandom.js') */

/* routerRandom.get('/', (req,res)=>{
    let cant= req.query.cant?req.query.cant: 100000000  
    if(isNaN(req.query.cant) )cant=100000000 
    const child= fork(rutaRandom)
    child.send({cant})
    child.on('message',msj=>{
      res.send(msj.numeros)
    })
})  */


routerRandom.get('/', (req,res)=>{
  let cant= req.query.cant?req.query.cant: 100000000  
  if(isNaN(req.query.cant) )cant=100000000 
  let numeros = numerosRandom(cant)
  res.send({numeros})
}) 
export default routerRandom