const bcrypt = require('bcrypt');
const db = require('../database');
const jwt = require('jsonwebtoken');
const { query } = require('../database');

exports.register = async (req, res) => {
    //Parse data and validation
    const { name, mail, username, password, imgURL } = req.body;

    db.query("SELECT email FROM `user` where email = ? ", [mail], async (error, results) => {
        //error check
        if (error) {
            console.log(error)
            return;
        }

        else {
            //do we have that email?
            if (results.length > 0) {
                res.send("That email is already in use");
                return
            }
            else {
                //hash
                const salt = await bcrypt.genSalt()
                const hashedPassword = await bcrypt.hash(password, salt)

                //register
                db.query("INSERT INTO `user` SET ?", { name: name, email: mail, username: username, password: hashedPassword, imgURL: imgURL }, (error, results) => {
                    if (error) {
                        console.log(error)
                    }
                    else {
                        res.sendStatus(200)
                    }
                })
            }
        }

    });
}


exports.login = async (req, res) => {
    const { username, password } = req.body

    db.query("select password,id from user where username =?", [username], async (error, results) => {
        if (error) {
            console.log(error)
        }
        else {
            if (results.length == 0) {
                res.sendStatus(404);
                return;
            }

            else {
                let hashedPassword = results[0].password

                if (await bcrypt.compare(password, hashedPassword)) {
                    let user = { userID: results[0].id }
                    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10h' })
                    return res.json ({accessToken: accessToken});
                }
                else {
                    res.sendStatus(403)
                }
            }

        }
    });
};


exports.userData = async (req,res) =>{
    db.query("select name, username, imgURL from user where id = " + req.user.toString() , (err, results) => {
            if (err) { return res.sendStatus(404) }
            else {
                return res.json({
                    name: results[0].name,
                    username: results[0].username,
                    imgURL: results[0].imgURL
                })
            }

        })
}