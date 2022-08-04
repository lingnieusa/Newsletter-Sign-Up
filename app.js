const express = require("express");
const bp = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bp.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html")
})

app.post("/",function(req,res){
  var firstname = req.body.fName;
  var lastname = req.body.lName;
  var email = req.body.email;
  console.log(firstname+" "+lastname+" "+email);

  var data = {
    members:[
      {
        email_address:email,
        status:"subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname
        }
      }
    ]
  };
  var jsonData = JSON.stringify(data);
  const url = "https://us14.api.mailchimp.com/3.0/lists/d59bb2cb4b";
  const options = {
    method: "POST",
    auth:"ling:c1b7639f5bb0ec581e85f570efb6df92-us14"
  };
  const request = https.request(url,options,function(response){
    if(response.statusCode === 200){
      res.sendFile(__dirname+"/success.html");
    }else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data",function(data){
      console.log(JSON.parse(data));
    })
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure",function(req,res){
  res.redirect("/");
});
app.listen(process.env.PORT||3000,function(){
  console.log("listening");
});

// const mailchimp = require("@mailchimp/mailchimp_marketing");
//
// mailchimp.setConfig({
//   apiKey: "c1b7639f5bb0ec581e85f570efb6df92-us14",
//   server: "us14",
// });
//
// const run = async () => {
//     const response = await mailchimp.lists.addListMember("d59bb2cb4b",
//         {
//             email_address: email,
//             status: "subscribed",
//             merge_fields: {
//                 FNAME: firstname,
//                 LNAME: lastname,
//                 // BIRTHDAY: "01/22",
//                 // ADDRESS: {
//                 //     addr1: "123 Freddie Ave",
//                 //     city: "Atlanta",
//                 //     state: "GA",
//                 //     zip: "12345",
//                 // },
//             },
//         },
//         {
//             skipMergeValidation: false
//         }
//     );
//     console.log(response.status);
// };
//
//
// run();

// const run = async () => {
  // const response = await mailchimp.lists.getAllLists();
  // console.log(response);

  // const response = await mailchimp.lists.getList("d59bb2cb4b");
  // console.log(response);
// };
//id
//d59bb2cb4b
//API key
//c1b7639f5bb0ec581e85f570efb6df92-us14
