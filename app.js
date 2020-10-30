const express = require('express');
const bodyParser = require('body-parser')
const sock = require("socket.io");
const ejs = require("ejs");
const session = require('express-session')
const path = require("path")
const mysql = require("mysql");
const fs = require("fs");
const moment = require('moment')
const uuid = require("uuid")

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
const server = app.listen(3000)

app.use(session(
    {
        secret: '343ji43j4n3jn4jk3n',
        saveUninitialized: true,
        resave: false



    }
));

app.use(express.static(path.join(__dirname,"public")))
app.use(logger)
app.use(express.urlencoded({
    extended: true
}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());





app.get("/",(req,res)=>{
    sess = req.session;
    if (sess.login){
        con.query("select * from data where user = ?",[sess.login],(error,results,feilds)=>{
            res.render("main.ejs",{data:results})
        })
    }
    else{
        res.redirect("/login")
    }
})

app.post("/create",(req,res)=>{
    let sess = req.session;
    let id = uuid.v1();
    if (sess.login){
        var name = req.body.name;
        con.query("insert into data (name,apikey,user,value) values(?,?,?,?)",[name,id,sess.login,""])
        // res.status(200).send("Ok")
        res.write({"apikey":id})
        res.end();
    }
    else{
        res.status(401).send("Not logged in")
    }
});
app.get("/login",(req,res)=>{
    sess = req.session;
    if (sess.login){
        res.redirect("/")
    }
    else{
        if(sess.error){
            res.render("login.ejs",{error:sess.error})
        }
        else{
            res.render("login.ejs")
        }
    }
})


app.post("/login",(req,res)=>{
    username = req.body.username;
    password = req.body.password;
    con.query("select COUNT(1) from users where username = ? and password = ?",[username,password],(err,result,feilds)=>{
        if (result){
            req.session.login = username
            res.redirect("/")
        }
        else{
            console.log(result[0])
        }
    })
})

// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
app.get("/api/:apikey",function(req,res){
    apikey = req.params.apikey;
    user = req.headers.user;
    pass = req.headers.password;
    authsql = `select  COUNT(1) from users where username = ? and password = ?`;
    existsql = `SELECT COUNT(1) FROM data WHERE apikey = ? and user = ?`
    getsql = `select value from data where apikey = ? and user = ?`;

    con.query(authsql,[user,pass],(err,result,feilds) =>{
        if (result[0]["COUNT(1)"]){
        con.query(existsql,[apikey,user],(error,re,feilds) =>{ 
            if (re[0]['COUNT(1)']){
                con.query(getsql,[apikey,user],(erro,resu,feilds) =>{
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
    existsql = `select COUNT(1) from data where user = ? and apikey = ?`;
    altersql = `update  data set value = ? where apikey = ? and user = ?`;
    con.query(authsql,[user,password],(error,resul,fei) =>{
        if (resul){
            con.query(existsql,[user,apikey],(err,resu,feil)=>{
                if (resu){
                    con.query(altersql,[newValue,apikey,user],(erro,result,fe) =>{
                        res.status(200).send("Ok Done")
                    })

                }
                else{
                    console.log(feil)
                    console.log(resu)
                    console.log(existsql)
                    res.status(404).send("No record found")
                }
            })
        }
        else{
            console.log(result)
            res.status(401).send("Username or password is incorrect")
        }       
    })
})
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||





app.use((req,res) => {
    res.status(404).send("Not Foud")
})
