const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const db= require('./database')
// main app
const app = express()

// apply middleware
app.use(cors())
app.use(bodyparser.json())


db.connect((err)=>{
    if (err) return console.log(`eror connecting :${err.stack}`);
    console.log(` connection as id: ${db.threadId}`);
})

// main route
const response = (req, res) => res.status(200).send('<h1>REST API JCWM1504</h1>')
app.get('/', response)

const {userRouter,movieRouter} =require('./router')

app.use('/user',userRouter)
app.use('/movies',movieRouter)






// bind to local machine
const PORT = 2000
app.listen(PORT, () => console.log(`CONNECTED : port ${PORT}`))