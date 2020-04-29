const http = require('http');
const fs = require("fs");
const gpxParse = require('gpx-parse');
var waitUntil = require('wait-until');
const hostname = '127.0.0.1';
const port = 3000;
var data="[";
var filesRead=0;
var done=false;
var gpxs=[];
fs.readdirSync("gpx").forEach(file => {
  //data=data+"[";
  gpxParse.parseGpxFromFile("./gpx/"+file, function(error, gpx) {

    //console.log(data);
    gpxs[filesRead]=gpx;
    filesRead++;
  });

});


setTimeout(()=>{
  for(var i2=0;i2<filesRead;i2++){
    data=data+"[";
    for(let i=0;i<gpxs[i2].tracks[0].segments[0].length;i++){
      let x=gpxs[i2].tracks[0].segments[0][i];
      //console.log("["+x.lon+","+x.lat+","+x.elevation+"],");
      data=data+"["+x.lon+","+x.lat+","+x.elevation+"],"+"\n";

    //console.log(data);
    }
    data=data.substring(0,data.length-2);
    data=data+"],\n";
  }
data=data.substring(0,data.length-2);
data=data+"]";
console.log(data);
http.createServer(function (req, res) {
  fs.readFile('index.html','utf8', function(err, htm) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(htm.replace("['ImportGPX']",data));
    return res.end();
  });
}).listen(port);
},5000);
