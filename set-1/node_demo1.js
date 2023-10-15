const console = require("console");

console.info("Welcome to Node world");

var http = require("http");
var events = require("events");

http.createServer((req, res)=>{
   res.writeHead(200, { "Content-Type": "text/plain"});
   res.write("Hello New World");
   
   res.end();
}).listen(8080)

var eventEmitter = new events.EventEmitter();

var myEventHandler = () => {
    console.log("New Event Handler");
}

eventEmitter.on("demo", myEventHandler);

eventEmitter.emit("demo");