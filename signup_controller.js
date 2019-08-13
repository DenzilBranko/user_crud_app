const express = require('express')
const router = express.Router()
const model = require('./crud_model');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const config = require('./config')
const verifyToken = require('./service')


router.post('/signUp',async(req,res) => {
    let { data } = req.body
    try {
        let result = await model.userSignUp(data)
        if(result) {
            res.status(200).send({message: "ok"})
        }
    } catch(err) {
       res.status(500).send(err) 
    }
})


router.post('/signIn',async(req,res) => {
    let { email,password } = req.body.data
    try {
        let result = await model.userLogin(email)
        if(result.length>0){
            let validPassword =  bcrypt.compareSync(password, result[0].password);
            if (!validPassword) return res.status(401).send({ auth: false, token: null });
                let token = JWT.sign({ id: result.email }, config.secret, {
                    expiresIn: '24h' // expires in 24 hours
                });
                res.status(200).send({ auth: true, token: token,user_id:result.id });;
            } else {
                res.status(400).send({"message":"Data not found"})
            }
    } catch(err) {
        res.status(500).send({message: "fail"}) 
    }
 })

 router.get('/get-user-list',verifyToken,async(req,res) => {
    try {
        let result = await model.getUserData()
        if(result.length>0) {
            res.status(200).send(result)
        }else {
             res.status(204).send([{message: "empty"}])
        }
    } catch(err) {
        res.status(500).send(err) 
    } 
 })

 router.put('/update-user/:id',verifyToken,async(req,res) => {
    let id = req.params.id
    let data = req.body.data
    try { 
        let succes_result = await model.updateUser(data,id)
        if(succes_result[0].status === 'updated') {
            res.status(200).send([{message: "ok"}])
        } else {
            res.status(404).send([{message: "no record"}])
        }
    } catch(err) {
       res.status(500).send({error: err}) 
    }
})

router.delete('/delete-user/:id',verifyToken,async(req,res) => {
    let id = req.params.id
    try {
        let succes_result = await model.deleteUser(id)
        if(succes_result[0].status === 'deleted') {
            return res.status(200).send([{message: "ok"}])
        } else {
            return res.status(403).send([{message: "no record"}])
        }
    } catch(e) {
        return res.status(500).send(e)
    }
})


module.exports = router