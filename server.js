const express = require('express')
const app = express()
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt')
const myPlaintextPassword = 'nadir';
const saltRounds = 10;
const {v4 : userId} = require('uuid')
const {v4 : locationId} = require('uuid')
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send("Server is working")
})

//// create user ////

app.post('/createuser', (req, res) => {
    const useruniqueid = userId()
    try {
        const { email, password, fullName, type ,} = req.body
        bcrypt.genSalt(saltRounds,(err,salt)=>{
            bcrypt.hash(password,salt,(err,hash)=>{
                const userdata = { email, password: hash, fullName, type , useruniqueid }
                return res.json({ success: true, message: "successfully createed user ", userdata })
            })
        })
    } catch(err) {
        if (err) {
            res.json({ success: false, message: "something went wrong in creating user" })
            console.log(err)
        }
    }
})

///// edit user ///////

app.post('/edituser', (req, res) => {
    try {
        const { fullName } = req.body
        const edituserdata = { fullName }
        res.json({ success: true, message: "successfully edit user ", edituserdata })
    }
    catch(err) {
        if (err) {
            res.json({ success: false, message: "something went wrong in adding user" })
            console.log(err)
        }
    }
})

///// delete user ////

app.post('/deleteuser',(req,res)=>{
    try{
        const {userId} = req.body
        const deleteUser = {userId}
        res.json({success: true , message:"successfully deleted user" , deleteUser})
    }catch(err){
        if(err){
            res.json({success: false, message:"something went wrong in deleting user"})
            console.log(err)
        }
    }
})

////// add location ///////

app.post('/addlocation',(req,res)=>{
    const uniquelocationid = locationId()
    try{
         const {geoPoint,message,userId,userName} = req.body
         const locationData = {geoPoint,message,userId,userName,uniquelocationid}
         res.json({success: true , message: "successfully added location",locationData})
    }
    catch(err){
        if(err){
            res.json({success: false, message: "something went in location"})
            console.log(err)
        }
    }
})

/////// get location ///////

app.get('/getlocation',(req,res)=>{
    try{
        const {userId} = req.body
        const userlocationdata = {userId}
        res.json({success: true , message: "successfully get location",userlocationdata})
    }
    catch(err){
        if(err){
            res.json({success: false ,message:'something went wrong in getting location'})
            console.log(err)
        }
    }
})

//////// get all location //////////

app.get('/getalllocation',(req,res)=>{
    try{
        res.json({success: true , message: "successfully get other location"})
    }catch(err){
        if(err){
            res.json({success: false , message: "something went wrong  in getting other location"})
            console.log(err)
        }
    }
})

/////// get monthly report ///////

app.post('/getmonthlyreport',(req,res)=>{
    try{
        const monthlyReport = []
        const weeklyReport = []
        const dailyReport = []
        const data = {monthlyReport,weeklyReport,dailyReport}
        res.json({success: true , message: "successfully get monthly report",data}) 
    }catch(err){
        if(err){
            res.json({success: false , message: "something went wrong in getting monthly report"})
            console.log(err)
        }
    }
})


///// logout user //////
app.post('/logout',(req,res)=>{
    try{
        const {userId} = req.body
        res.json({success: true,message:"succefully logout user" ,userId})
    }catch(err){
        if(err){
            res.json({success: false , message: "something went wrong in logout user"})
            console.log(err)
        }
    }
})
const server = http.createServer(app)
server.listen(5000, () => console.log('server is working'))