const http = require('http');
const fs = require("fs");
const gpxParse = require('gpx-parse');
var formidable = require('formidable');
var waitUntil = require('wait-until');
const hostname = '127.0.0.1';
const port = process.env.PORT | 3000;
console.log(port);
var data="[";
var filesRead=0;
var filesFound=0;
var doit=true;
var done=false;
var gpxs=[];
var fileCache=[];
function pullData(){
  data="[";
  filesRead=0;
  filesFound=0;
  doit=true;
  done=false;
  gpxs=[];
  fileCache=[];
  fileCache=fs.readdirSync("gpx");
  filesFound=fileCache.length;
  fileCache.forEach(file => {
    //data=data+"[";
    gpxParse.parseGpxFromFile("./gpx/"+file, function(error, gpx) {

      //console.log(data);
      gpxs[filesRead]=gpx;
      filesRead++;
      console.log(filesRead);
    });

  });
  waitUntil()
      .interval(500)
      .times(Infinity)
      .condition(function() {
          return (filesFound==filesRead ? true : false);
      })
      .done(function(result) {
    for(var i2=0;i2<filesRead;i2++){
      data=data+"[";
      for(let i=0;i<gpxs[i2].tracks[0].segments[0].length;i++){
        if(doit){
          let x=gpxs[i2].tracks[0].segments[0][i];
          //console.log("["+x.lon+","+x.lat+","+x.elevation+"],");
          data=data+"["+x.lon+","+x.lat+","+x.elevation+"],"+"\n";

        }
        doit=!doit;
      //console.log(data);
      }
      data=data.substring(0,data.length-2);
      data=data+"],\n";
    }
  data=data.substring(0,data.length-2);
  data=data+"]";
  console.log(filesFound);
  return data;
});
}
pullData();
http.createServer(function (req, res) {

    if (req.url == '/fileupload') {
      let done=false;
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        try {
          var oldpath = files.filetoupload.path;
          var newpath = "gpx/" + filesFound+".gpx";
          fs.rename(oldpath, newpath, function (err) {
            if (err) {throw err;}else{
            //pullData();
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write("File uploaded!");
            return res.end();
            }
          });
        } catch (e) {
        }
   });
 }else{
    fs.readFile('index.html','utf8', function(err, htm) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(htm.replace("['ImportGPX']",data));
      return res.end();
    });
  }
}).listen(port);
