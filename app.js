var express=require("express");
var app=express();
var http=require('http').Server(app);
var io=require('socket.io')(http);




function notify(req,res,next)
{
    console.log("request been made"+req.url);
    next();
}

app.use(notify);



io.on("connection",function(socket)
{
    console.log("A user connected:" + socket.id);

    socket.join("room-golite");

    socket.emit("notify",{'message':"Welcome to Golite"});

});


app.get('/',function(req,res){
    res.send("<marquee>GoLite is online By vivek and his team</marquee>");
});
app.get('/high',function(req,res){
    console.log("high");
    res.send("done");
})

app.get('/low',function(req,res){
    console.log("low");
    res.send("done");
})


var server=http.listen(process.env.PORT || 5000,function(){
    console.log("server running in port "+(process.env.PORT || 5000));
});

