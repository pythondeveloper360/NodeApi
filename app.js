const express = require('express');
const mysql = require("mysql");
const fs = require("fs");
const moment = require('moment')

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: "3306",
    password: "qsa-1299",
    database: "api",
});



con.connect(function (err){
if (err) throw err;
fs.appendFileSync('logs.txt',`${moment().format('MMMM Do YYYY, h:mm:ss a')}      ${err}\n`)
});

logger = (req,res,next) => {
file = fs.appendFileSync("logs.txt",`${moment().format("MMMM Do YYYY, h:mm:ss a")}      ${req.path}\n`)
    next();
}

const app = express();
app.use(logger)

// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
app.get("/api/:apikey",function(req,res){
    apikey = req.params.apikey;
    user = req.headers.user;
    pass = req.headers.password;
    authsql = `select  COUNT(1) from users where username = '${user}' and password = '${pass}'`;
    existsql = `SELECT COUNT(1) FROM data WHERE apikey = '${apikey}' and user = '${user}'`
    getsql = `select value from data where apikey = '${apikey}' and user = '${user}'`;

    con.query(authsql,(err,result,feilds) =>{
        if (result[0]["COUNT(1)"]){
        con.query(existsql,(error,re,feilds) =>{ 
            if (re[0]['COUNT(1)']){
                con.query(getsql,(erro,resu,feilds) =>{
                    res.status(200).send(resu[0].value)
                })
            }
            else{
                console.log(re)
                res.status(404).send("Not Found")
            }
            }



        );
        }
    

        else{
            res.status(401).send('Username or password may be incorrect')
        }
    })
});
// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

app.post("/api/:apikey",(req,res)=>{
    apikey = req.params.apikey;
    user = req.headers.user;
    password = req.headers.password;
    newValue = req.headers.value;

    authsql = `select  COUNT(1) from users where username = ? and password = ?`;
    existsql = `select COUNT(1) from data where username = ${user} and apikey = ${apikey}`;
    altersql = `update from data set value = ${newValue} where apikey = ${apikey} and user = '${user}`;
    con.query(authsql,[user,password],(error,resul,fei) =>{
        if (resul){
            con.query(existsql,(err,resu,feil)=>{
                if (resu){
                    con.query(altersql,(erro,result,fe) =>{
                        res.status(200).send("Ok Done")
                    })

                }
                else{
                    console.log(feil)
                    console.log(resul)
                    console.log(existsql)
                    res.status(404).send("No record found")
                }
            })
        }
        else{
            console.log(result)
            res.status(401).send("Username or password is correct")
        }       
    })
})



app.use((req,res) => {
    res.status(404).send("Not Foud")
})
app.listen(3000)
