var http = require('http');
var MongoClient = require('mongodb').MongoClient;
//Create a database named "mydb":
var url = "mongodb://localhost:27017/mydb";

http.createServer((req, res)=>{
    res.writeHead(200, {'Content-Type': 'text/plain'});
    console.log('This example is different!');
    res.write('Date and time now is '+myModule());
    res.write('Date and time now is '+myModule());
    
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      console.log("Database created!");
      db.close();
    });
    res.end('Ends here');
}).listen(8080);

var myModule = function() {
  return new Date();
}



