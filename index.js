const http = require('http');
const fs = require('fs');
const requests = require('requests');

const port = process.env.PORT || 3000;

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);          //need to bring those values from output JSON object
    temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);

    return temperature;
}

const server = http.createServer((req, res) => {
    if(req.url == "/"){
        requests(
          "https://api.openweathermap.org/data/2.5/weather?q=Guwahati&appid=31a1cd39d202630e9dfbe667f6de34fd"
          )
.on("data", (chunk) => {
  const objdata = JSON.parse(chunk);
  const arrData = [objdata];
  //console.log(arrData[0].main.temp);
  const realtimeData = arrData.map(val => replaceVal(homeFile, val)).join("");
  res.write(realtimeData);
  console.log(realtimeData);  
})
.on("end", (err) => {
  if (err) return console.log("connection closed due to errors", err);
     res.end();
}); 
    }
})

// server.listen(3000, "127.0.0.1");

server.listen(port, () => {
  console.log(`server is running at port no ${port}`);
})