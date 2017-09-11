var express=require("express");
var app=express();
var bodyparser=require("body-parser");
var http=require('http').Server(app);
var io=require('socket.io')(http);

function notify(req,res,next)
{
    console.log("request been made"+req.url);
    next();
}

app.use(notify);
app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));


io.on("connection",function(socket)
{
    console.log("A user connected:" + socket.id);


    socket.on("message_full",function(){
        io.sockets.emit("notify",{message:"grocery is full"});
    })


    socket.on("message_low",function(){
        io.sockets.emit("notify",{message:"grocery is level is low"});
    })
});


app.get('/',function(req,res){
    res.send("<marquee>GoLite is online By vivek and his team</marquee>");
});


var server=app.listen(process.env.PORT || 5000,function(){
    console.log("server running in port "+(process.env.PORT || 5000));
});

