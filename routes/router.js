const express = require('express');
const authController = require('../controllers/auth');
const dataController = require('../controllers/data');
const achController = require('../controllers/achievement');
const jwt = require('jsonwebtoken');
const db = require('../database')


function authorizeToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user.userID;
        next();
    })
}

//Create Connection
const router = express.Router();


router.get('/', (req, res) => {
    res.sendStatus(200)
});

router.post('/auth/register', authController.register)
router.post('/auth/login', authController.login)
router.get('/auth/userData',authorizeToken,authController.userData)


router.get('/goalOfTheDay/value', authorizeToken, dataController.goalVal)
router.get('/goalOfTheDay/update', authorizeToken, dataController.goalUpdate)
router.get('/dailyConsumption', authorizeToken, dataController.dailyConsumption)

router.get('/dashboard', authorizeToken, dataController.dashboard)
router.get('/dashboard/insert',authorizeToken, dataController.insertSensor)
router.get('/sensorsOfUser',authorizeToken, dataController.sensorsOfUser)
router.get('/measurementsOfTheDay',authorizeToken, dataController.measurementsOfTheDay)


router.get('/leaderboard', authorizeToken, dataController.leaderboard)

router.get('/points/update',achController.pointReward)

module.exports = router; 