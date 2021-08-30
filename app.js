const express = require("express");
const bodyParser = require("body-parser");
const request = require("request"); // ovo mora da se instalira
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public")); //Zbog koriscenja reltivnih putanja u html za CSS i IMG, pored ovoga ne moram nista pored da pisem ili menjam

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const forename = req.body.forename;
    const surname = req.body.surname;
    const mail = req.body.mail;


    const data = {
      members: [
        {
          email_address: mail, //definisao mailchimp
          status:"subscribed", //definisao mailchimp
          merge_fields:{ //definisao mailchimp
            FNAME:forename, //definisao mailchimp
            LNAME:surname //definisao mailchimp
          }
        }
      ]
    };

    var jsonData = JSON.stringify(data);


    const url = "https://us5.api.mailchimp.com/3.0/lists/82347731a0";

    const options = {
      method: "POST",
      auth: "damjan1:809ee2df610a363e5873c39be1297b76-us5"
    }


    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });

      if(response.statusCode != 200){
        res.sendFile(__dirname + "/failure.html");
      }else{
          res.sendFile(__dirname + "/success.html");
      }


});

request.write(jsonData);
request.end();


});



app.post("/failure", function(req, res){
 res.redirect("/");
});



app.listen(process.env.PORT, function(){
  console.log("Server start");
});
