const { query } = require('../database');
const db = require('../database')

exports.goalVal = async (req, res) => {
    db.query("SELECT goalOfTheDay from user where id=" + req.user.toString(), (err, result) => {
        if (err) return res.sendStatus(404)
        return res.json(result[0].goalOfTheDay)
    })

};

exports.goalUpdate = async (req, res) => {
    console.log(req.headers);
    db.query("UPDATE user SET goalOfTheDay=" + req.headers['value'] + " where id=" + req.user.toString(), (err, result) => {
        if (err) { console.log(err); return res.sendStatus(404) }
        return res.sendStatus(200);
    })

};


exports.dailyConsumption = async (req, res) => {
    db.query("select SUM(fValue) as dailyConsumption,u.id from measurement AS m JOIN sensor AS s ON m.sensorID=s.id JOIN gateway as g ON s.gatewaySensorID = g.id JOIN user as u on u.gatewayID=g.id where (datetime > curdate()) AND (datetime <curdate()+1) AND u.id=" + req.user.toString() + "  group by id", (err, result) => {
        if (err) { console.log(err); return res.sendStatus(404) }
        if (!result[0]){
            return res.json(0)
        }
        return res.json(result[0].dailyConsumption)
    })

};


exports.leaderboard = async (req, res) => {
    db.query("SELECT username,pointsCollected from user ORDER by pointsCollected DESC LIMIT 10", (err, result) => {
        if (err) { console.log(err); return res.sendStatus(404); }
        return res.json(result)

    })
}

exports.dashboard = async (req, res) => {
    let query = `select AVG(fvalue) as waterConsumption, AVG(pHValue) as pHValue, st.img_url, st.name, s.name\
    FROM measurement AS m \
    JOIN sensor AS s ON m.sensorID=s.id\
    JOIN sensorType as st on st.id = s.type\
    JOIN gateway as g ON s.gatewaySensorID = g.id \
    JOIN user as u on u.gatewayID=g.id\
    WHERE (datetime > curdate()) AND (datetime <curdate()+1) AND u.id =` + req.user.toString() + " GROUP BY s.id"
    db.query(query, (err, result) => {
        if (err) { console.log(err); return res.sendStatus(404); }
        return res.json(result)
    })
}


exports.sensorsOfUser = async (req, res) => {
    let query = `select SUM(fValue) as totalConsumption,AVG(pHValue) avgpH,s.name \
    from measurement AS m JOIN sensor AS s ON m.sensorID=s.id \
    JOIN gateway as g ON s.gatewaySensorID = g.id \
    JOIN user as u on u.gatewayID=g.id \
    where (datetime > curdate()) AND (datetime <curdate()+1) AND u.id= `+ req.user.toString()
    query += " group by s.id"
    db.query(query, (err, result) => {
        if (err) return res.sendStatus(400)
        else return res.json(result)
    })

}

exports.measurementsOfTheDay = async (req, res) => {
    let query = `select s.name, fValue,pHValue,time(m.datetime) as time \
    from measurement AS m JOIN sensor AS s ON m.sensorID=s.id \
    JOIN gateway as g ON s.gatewaySensorID = g.id \
    JOIN user as u on u.gatewayID=g.id \
    where (datetime > curdate()) AND (datetime <curdate()+1) AND u.id= ` + req.user.toString()
    db.query(query, (err, result) => {
        if (err) return res.sendStatus(400)
        else return res.json(result)
    })
}

exports.insertSensor = async (req, res) => {
    var gatewayID;
    db.query("SELECT gatewayID from user where id=" + req.user.toString(), (err, result1) => {
        if (err) { console.log(err); return res.sendStatus(500); }
        gatewayID = result1[0].gatewayID;
        
        db.query("INSERT INTO `sensor` SET ?", { type : req.headers['type'], name: req.headers['name'], gatewaySensorID: gatewayID }, (err, result) => {
            if (err) { console.log(err); return res.sendStatus(500); }
            return res.sendStatus(200)
        });
    })

}