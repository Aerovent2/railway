import passport from "passport"
import {Strategy} from 'passport-local'
import {  Users } from "../dbs/dbUsers.js"
import bcrypt from 'bcrypt'



passport.use('register', new Strategy({passReqToCallback:true},
    (req,username,password, done)=>{
        const {email}=req.body
        Users.findOne({username},(err,user)=>{
            if(user) return done(null,false)
            let hashPass= bcrypt.hashSync(password,bcrypt.genSaltSync(10))
            Users.create({username,password:hashPass,email},(err,user)=>{
                if(err) return done(err)
                return done(null,user)
            })
        })
    }
))

passport.use('login', new Strategy({},
    (username,password, done)=>{
        Users.findOne({username},(err,user)=>{
            if(err) return done(err)
            if(!user) return done(null,false)
            bcrypt.compareSync(password,user.password)? done(null,user): done(null,false)           
        })
    }
))

passport.serializeUser((user,done)=>{
    done(null,user._id)
})

passport.deserializeUser((id,done)=>{
    Users.findById(id,done)
})

export default passport