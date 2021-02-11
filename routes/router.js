const express = require('express');
const authController = require('../controllers/auth')

//Create Connection
const router = express.Router();




router.get('/',(req,res)=>{
    res.send("Cute")
});


router.get('/test',(req,res)=>{
    res.send("Test")
});

router.post('/auth/register',authController.register )
router.post('/auth/login',authController.login)



module.exports= router; 