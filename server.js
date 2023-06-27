const express = require("express");
const requests = require("requests");
var app = express();

const port = 3000;
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));
let city="London";



app.get('/',(req,res)=>
{
res.status(200).render('home');
});


app.get("/search", (req, res) => {
  requests(
    "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&appid=b167c4ccb205bab637d5bad9e8194e42"
  )
    .on("data", function (chunk) {
      // console.log(chunk);

      var objdata = JSON.parse(chunk);
      console.log(objdata);
      objdata = [objdata];
      var currtemp = objdata[0].main.temp;
      var maxtemp = objdata[0].main.temp_max;
      var mintemp = objdata[0].main.temp_min;
      var country=objdata[0].sys.country;
      var status=objdata[0].weather[0].main;
      var image="";
      if(status=="Sunny")
      {
        image="sunny.jpg";
      }
      else if(status=="Clouds")
      {
        image="blackclouds.png";
      }
      else if(status=="Rainy")
      {
        image="rain.png";
      }
      else{
        image="whiteclouds.png";
      }
      res
        .status(200)
        .render("index", {
          currtemp: currtemp,
          maxtemp: maxtemp,
          mintemp: mintemp,
          city:city,
          country:country,
          image:image,
        });
    })
    .on("end", function (err) {
      if (err) {
        console.log("Connection closed due to errors ", err);
        res
          .status(404)
          .send(
            "<h1>Unable to collect data about the city</h1><br><h2>Please enter fresh details :))</h2>"
          );
      }
      // console.log('end');
    });
});

app.post('/search',(req,res)=>
{
  city=req.body.city;
  res.redirect('/search');
});

app.listen(port, () => {
  console.log("Server successfully started at port ", port);
});
