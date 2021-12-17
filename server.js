const express = require('express')
const app = express()
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt')
const myPlaintextPassword = 'nadir';
const saltRounds = 10;
const mysql = require('mysql')

const { v4: genrateId } = require('uuid')

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send("Server is working")
})

///////// connecting to mysql database  /////////

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'testing_server'
});

connection.connect((err) => {
    if (err) {
        console.log("err " + err)
    }
});

//// create user ////

app.post('/createuser', (req, res) => {
    const useruniqueid = genrateId()
    try {
        const { email, password, fullName, type, loggedIn } = req.body
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                const userdata = { email, password: hash, fullName, type, useruniqueid, loggedIn }
                const values = [[email, hash, fullName, type, useruniqueid, loggedIn]]
                const query = `INSERT INTO user (email , password , fullName , type , userId , loggedIn) VALUES ?`
                connection.query(query, [values], (err, result) => {
                    if (err) res.json({ success: false, message: "something went wrong in creating user" })
                    return res.json({ success: true, message: "successfully createed user ", userdata })
                })
            })
        })
    } catch (err) {
        if (err) {
            res.json({ success: false, message: "something went wrong in creating user" })
            console.log(err)
        }
    }
})

///// edit user ///////

app.post('/edituser', (req, res) => {
    try {
        const { fullName, userId } = req.body
        const newName = fullName
        const user = userId
        const query = `UPDATE user set fullName = ? WHERE userId = ?`
        connection.query(query, [newName, user], (err, results) => {
            if (err) res.json({ success: false, message: "something went wrong in adding user" })
            return res.json({ success: true, message: "successfully edit user " })
        })
    }
    catch (err) {
        if (err) {
            res.json({ success: false, message: "something went wrong in adding user" })
            console.log(err)
        }
    }
})

///// delete user ////

app.post('/deleteuser', (req, res) => {
    try {
        const { userId } = req.body

        const deleteUser = userId
        const query = `DELETE FROM user WHERE userId = ?`
        connection.query(query, deleteUser, (err, results) => {
            if (err) res.json({ success: false, message: "something went wrong in deleting user" })
            return res.json({ success: true, message: "successfully deleted user", deleteUser })
        })
    } catch (err) {
        if (err) {
            res.json({ success: false, message: "something went wrong in deleting user" })
            console.log(err)
        }
    }
})

///// get all users /////

app.get('/getallusers', (req, res) => {
    try {
        connection.query('SELECT * FROM `user` WHERE 1', (error, result, fields) => {
            if (error) throw error
            const users = result
            res.json({ success: true, message: "successfully get all users", users })
        })
    } catch (err) {
        if (err) {
            res.json({ success: false, message: "somenthing went wrong in getting all users" })
        }
    }
})

////// add location ///////

app.post('/addlocation', (req, res) => {
    try {
        const uniquelocationid = genrateId()
        const { date, geoPoint, message, userId, userName } = req.body
        const locationData = [[date, JSON.stringify(geoPoint), message, userId, userName, uniquelocationid]]
        const query = `INSERT INTO locations (date , geoPoint , message , userId , userName , uniquelocationid) VALUES ?`
        connection.query(query, [locationData], (err, result) => {
            if (err) {
                console.log(err)
                return res.json({ success: false, message: "something went wrong in adding location" })
            }
            return res.json({ success: true, message: "successfully added location", locationData })
        })
    }
    catch (err) {
        if (err) {
            res.json({ success: false, message: "something went in location" })
            console.log(err)
        }
    }
})

/////// get location ///////

app.get('/getlocation', (req, res) => {
    try {
        const { userId } = req.body
        const userlocationdata = { userId }
        const query = 'SELECT * FROM `locations` WHERE userId = ?'
        connection.query(query, userId, (err, results, fields) => {
            if (err) res.json({ success: false, message: "smething went wrong in getting location" })
            return res.json({ success: true, message: "successfully get location", data: results })
        })
    }
    catch (err) {
        if (err) {
            res.json({ success: false, message: 'something went wrong in getting location' })
            console.log(err)
        }
    }
})

//////// get all location //////////

app.get('/getalllocations', (req, res) => {
    try {
        connection.query('SELECT * FROM `locations` WHERE 1', (err, results, fields) => {
            if (err) res.json({ success: false, message: "something went during get all location" })
            return res.json({ success: true, message: "successfully get all location", data: results })
        })
    } catch (err) {
        if (err) {
            res.json({ success: false, message: "something went wrong  in getting other location" })
            console.log(err)
        }
    }
})

/////// get monthly report ///////

app.post('/getmonthlyreport', (req, res) => {
    try {
        const monthlyReport = []
        const weeklyReport = []
        const dailyReport = []
        const data = { monthlyReport, weeklyReport, dailyReport }
        res.json({ success: true, message: "successfully get monthly report", data })
    } catch (err) {
        if (err) {
            res.json({ success: false, message: "something went wrong in getting monthly report" })
            console.log(err)
        }
    }
})

///// login user ///////

app.post('/login',(req,res)=>{
    try{
        const {userId} = req.body

    }catch(err){
                if(err){
                    res.json({success: false , message: "somenthing went wrong in login user"})
                    console.log(err)
                }
    }
})

///// logout user //////
app.post('/logout', (req, res) => {
    try {
        const { userId } = req.body
        const log = 0
        const query = 'UPDATE `user` set loggedIn = ?  WHERE  userId = ?'
        connection.query(query, [log, userId], (err, result, fields) => {
            if (err) res.json({ success: false, message: "something went wrong in loging out user" })
            return res.json({ success: true, message: "successfully logout user" })
        })
    } catch (err) {
        if (err) {
            res.json({ success: false, message: "something went wrong in logout user" })
            console.log(err)
        }
    }
})
const server = http.createServer(app)
server.listen(5000, () => console.log('server is working'))