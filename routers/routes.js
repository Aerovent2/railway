
import express from 'express'
import url from 'url'
import { join } from 'path' 
import {cpus} from "os"
import passport from '../sessions/passport.js'
import compression from 'compression'
const {Router}= express
const router=Router()


const __dirname = url.fileURLToPath(new url.URL('.',import.meta.url))
const rutaProdHtml=join(__dirname,"../views/products.html")
const rutaLogin =join(__dirname,"../views/login.html")
const rutaRegister =join(__dirname,"../views/register.html")
const rutaRegisterError =join(__dirname,"../views/registerError.html")
const rutaLoginError =join(__dirname,"../views/loginError.html")

const auth = (req,res,next)=>{
 req.isAuthenticated()? next(): res.redirect('/login')
}


router.get('/',auth,(req,res)=>{
    res.redirect("/productos")
})

router.get('/login', (req,res)=>{
    res.sendFile(rutaLogin)
}) 
router.post('/',passport.authenticate('login',{failureRedirect:'/loginError'}),(req,res)=>{
    res.redirect('/productos')
})

router.get('/register', (req,res)=>{
    res.sendFile(rutaRegister)
}) 

router.post('/register', passport.authenticate('register',{failureRedirect:'/registerError'}),(req,res)=>{
    res.redirect('/productos')
})

router.get('/productos',auth,  (req,res)=>{
    
    res.sendFile(rutaProdHtml)
}) 
router.get('/loginError',  (req,res)=>{
    res.sendFile(rutaLoginError)
}) 
router.get('/registerError',  (req,res)=>{
    res.sendFile(rutaRegisterError)
})

router.get('/user',auth, (req,res)=>{
    
    res.send({usuario:req.user.username})
}) 

const cpu = cpus()

router.get('/info',(req,res)=>{
   let info ={
    process: cpu.length,
    args:process.argv.slice(2),
    So:process.platform,
    nodeVersion:process.version,
    Mem:process.memoryUsage().rss,
    path:process.argv[0],
    Pid:process.pid,
    Folder:process.cwd()
   }
    console.log(info)
    res.send({info})
}) 

router.get('/logout', (req,res)=>{
    req.session.destroy()
    res.redirect("/")
}) 


/* router.get('/api/productos-test',async (req,res)=>{
    //await DB.getAll().then(productos =>{res.send(productos)})
})  */

export default router