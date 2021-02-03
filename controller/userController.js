const db = require("../database/")

const { generateQuery, asyncQuery} = require("../helpers/queryHelp")
const { validationResult } = require("express-validator")
const cryptojs = require("crypto-js")
const SECRET_KEY = '!@#$%^&*'
const { createToken } = require('../helpers/jwt')

module.exports={
    register:async(req,res)=>{
        const { username, password, email } = req.body

        const errors = validationResult(req)
        // console.log(errors.array());
        if (!errors.isEmpty()) return res.status(400).send(errors.array().map((item)=>item.msg))


        try {
            const hashpass = cryptojs.HmacMD5(password, SECRET_KEY).toString()
            const queryRegister = `insert into users (username,password,email,uid)
            values('${username}','${hashpass}','${email}',${db.escape(Date.now())})`
            const resultRegister= await asyncQuery(queryRegister)

            const queryResult=`select id,uid,username,email from users where id=${resultRegister.insertId}`
            const result= await asyncQuery(queryResult)
   
            const token = createToken({uid : result[0].uid, role:result[0].role})
            let tempRes=[...result]
            
            tempRes[0].token=token

            res.status(200).send(tempRes[0])
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    login: async(req,res)=>{
        const { username, password,email } = req.body
        try {
            const errors = validationResult(req)
            // console.log(errors.array());
            if (!errors.isEmpty()) return res.status(400).send(errors.array()[0].msg)

            const hashpass = cryptojs.HmacMD5(password, SECRET_KEY).toString()

            const loginQuery = `SELECT id,uid,username,email,status,role FROM users WHERE username = ${db.escape(username)} AND password = ${db.escape(hashpass)}`

            const result= await asyncQuery(loginQuery)
            console.log(result[0]);
            if (result[0].status!==1 ) return res.status(400).send("TIDAK BISA LOGIN")

            const token = createToken({uid : result[0].uid, role:result[0].role})
            let tempRes=[...result]
            tempRes[0].token=token
            console.log(token);
            res.status(200).send(tempRes[0])


        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    deactive:async(req,res)=>{
        try {
            console.log("ayeeeeeee",req.user);
            const queryDeaktif=`select * from users where uid=${db.escape(req.user.uid)}`
            const result= await asyncQuery(queryDeaktif)
            console.log(result);
            if (result.length===0) return res.status(400).send("user tidak ada")

            const querUpdate = `UPDATE users SET status=${db.escape(2)} WHERE id=${result[0].id}`
            const result1= await asyncQuery(querUpdate)

            const queryall=`select u.uid,s.status from users u
            left join status s on u.status=s.id where u.id=${result[0].id}`
            const result2= await asyncQuery(queryall)

            res.status(200).send(result2)
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    active:async(req,res)=>{
        try {
            console.log("ayeeeeeee",req.user);
            const queryAktif=`select * from users where uid=${db.escape(req.user.uid)}`
            const result= await asyncQuery(queryAktif)
            console.log(result);
            if (result.length===0) return res.status(400).send("user tidak ada")

            if (result[0].status===3 ) return res.status(400).send("akun tidak bisa di aktifkan")

            const querUpdate = `UPDATE users SET status=${db.escape(1)} WHERE id=${result[0].id}`
            const result1= await asyncQuery(querUpdate)

            const queryall=`select u.uid,s.status from users u
            left join status s on u.status=s.id where u.id=${result[0].id}`
            const result2= await asyncQuery(queryall)

            res.status(200).send(result2)
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    close:async(req,res)=>{
        try {
            console.log("ayeeeeeee",req.user);
            const queryAktif=`select * from users where uid=${db.escape(req.user.uid)}`
            const result= await asyncQuery(queryAktif)
            console.log(result);
            if (result.length===0) return res.status(400).send("user tidak ada")

            const querUpdate = `UPDATE users SET status=${db.escape(3)} WHERE id=${result[0].id}`
            const result1= await asyncQuery(querUpdate)

            const queryall=`select u.uid,s.status from users u
            left join status s on u.status=s.id where u.id=${result[0].id}`
            const result2= await asyncQuery(queryall)

            res.status(200).send(result2)
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
}