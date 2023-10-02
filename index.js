const express = require('express');
const bodyParser = require('body-parser'); //for post submits
const urlencodedParser = bodyParser.urlencoded({ extended: false }) // POST: create application/x-www-form-urlencoded parser
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs'); //npm install ejs (https://ejs.co/)

app.listen(8090);

function buildUserScreen(userName){
    const privateScreen = `
    <html>
    <body>
         Welcome, <b>${userName}</b>!<br />You are in the administrative area.
         <br/>
         <a href="/logout" >Logout</a><br />
         <a href="/download_manual?userName=${userName}" >Download manual</a><br />
         
    </body>
    </html>`;
    return privateScreen;
}

app.get("/download_manual", function (request, response){
    console.log(`Manual been downloaed by ${request.query.userName}`);
    console.log("__dirname",__dirname);
    response.sendFile(__dirname +'/private/application_manual.pdf'); //transfers the file at the given path and it sets the Content-Type response HTTP header field based on the filename extension
});


app.get("/", function(request, response){
    let cookie = request.headers.cookie;
    if(cookie !== undefined && cookie.indexOf("currentUser") !== -1){
        let userName = cookie.split("currentUser=")[1];
        userName = userName.indexOf(";") !== -1 ? userName.split(";")[0] : userName;
        let output = buildUserScreen(userName);
        response.send(output);
    }else{
      /*
        response.status(302);//302 = moved temporarily to a new location
        response.setHeader("location", "http://127.0.0.1:5500/login.html");
        response.send();
        */
       response.redirect("/login.html");
    }
    
});

app.get("/logout", function(request, response){
    //response.setHeader("set-cookie","currentUser="+login+";expires=Fri, 5 Oct 1970 14:28:00 GMT");
    response.clearCookie("currentUser");
    response.redirect("/login.html");
});

app.post("/login",urlencodedParser, function (request, response) {
    let login = request.body.login;
    let password = request.body.password;
    let keep =  request.body.keep;
    let output = "";
    if(login === "admin" && password === "123"){
        response.status(200);
        if(keep === "1"){
            response.setHeader("set-cookie","currentUser="+login);
        }
        //output = buildUserScreen(login);
        response.render('admin_area', { userName: login });
    }else{
        response.status(401);
        output = "Invalid credentials";
    }
    response.send(output);
});