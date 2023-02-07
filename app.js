const express=require('express')
const mongoose=require('mongoose')
const router=require('./routes/routes')
const path=require('path')
const session=require('express-session')
const passport = require('passport')
const app=express()

mongoose.connect('mongodb://127.0.0.1:27017/randomUser',{
    useNewUrlParser: true, useUnifiedTopology: true
})
app.use(express.urlencoded({extended:false}))
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:false
}))

app.set(express.static(path.join(__dirname, 'public')))
app.use(passport.initialize())
app.use(passport.session())

app.set('view engine','ejs')

app.use('/assets', express.static(path.resolve(__dirname, 'public')))
app.use('/',router)

app.listen(3000)