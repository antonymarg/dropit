const mysql = require('mysql')
const bcrypt = require('bcrypt');


var db = mysql.createConnection({
    host     : '35.226.124.199',
    user     : 'root',
    password : 'password',
    database : 'dropit'
  });  


exports.register = async (req,res)=>{
    //Parse data and validation
    const { name, mail, username, password }= req.body;
    
    db.query("SELECT email FROM `user` where email = ? ", [mail] ,async (error,results)=>{
       //error check
        if(error){
            console.log(error)
            return;
        }
 
        else {
            //do we have that email?
            if (results.length>0){
                res.send("That email is already in use");
                return
            }
            else{
                //hash
                const salt = await bcrypt.genSalt()
                const hashedPassword = await bcrypt.hash(password,salt)

                //register
                db.query("INSERT INTO `user` SET ?", {name : name ,email : mail ,username:username,password: hashedPassword}, (error,results)=>{
                    if(error){
                        console.log(error)
                    }
                    else{
                        res.send("User registered!")
                    }
                })
            }
        }
        
    });
}


exports.login = async (req,res)=>{
    const {username,password} = req.body

    db.query("select password from user where username =?",[username],async (error,results)=>{
        if(error){
            console.log(error)
        }
        else{
            console.log(results.length)
            if (results.length == 0){
                res.send("No such user");
                return;
            }
            else{
                let hashedPassword = results[0].password
               
                if(await bcrypt.compare(password,hashedPassword)){
                    res.send("Access allowed")
                }
                else{
                    res.send("Access forbiden")
                }
            }
        
        }
    });
};