const db = require('../database')

var endOfTheDay = `UPDATE user SET pointsCollected = pointsCollected + 1 \
 WHERE id in ( \
 SELECT u.id FROM (SELECT u.id, SUM(fValue) as dailyConsumption,u.goalOfTheDay \
 from measurement AS m \
 JOIN sensor AS s ON m.sensorID=s.id \
 JOIN gateway as g ON s.gatewaySensorID = g.id \
 JOIN user as u on u.gatewayID=g.id \
 WHERE (datetime > curdate()) AND (datetime <curdate()+1)\
 GROUP BY id \
 HAVING (dailyConsumption< goalOfTheDay)) AS u)`


exports.pointReward = async (req,res) => {
    db.query(endOfTheDay, (err, result) => {
        if (err) { console.log(err); return res.sendStatus(404); }
        console.log(result) 
        return res.sendStatus(200);
    });

  
} 

