var express=require("express");
var app=express();
var bodyparser=require("body-parser");

var http=require('http').Server(app);
var io=require('socket.io')(http);

var mqtt=require('mqtt');
var broker=require('mosca');

var settings={
    port:1883
};

var s=new broker.Server(settings);


s.on('ready',function(){
    console.log("Broker started in port 1883");
});

s.on('clientConnected',function(client){
    console.log('client connected',client.id);

});
s.on('subscribed',function(topic,client){
    console.log('subscibed:'+topic+' '+client.id);
})


s.on('published',function(data){
    console.log('published:'+data.payload.toString()+' ');
})



s.on('unsubscribed',function(topic,client){
    console.log('unsubscibed:'+topic+' '+client.id);
})

s.on('clientDisconnected',function(client){
    console.log('clientDisconnected:'+client.id);


});


var option={
    keepalive:10,
    clientId:'coordinator',
    port:1883,
    host:'http://golite.herokuapp.com',
    will: {
        topic: 'WillMsg',
        payload: 'Connection Closed abnormally..!',
        qos: 0,
        retain: false
    }
}

var client=mqtt.connect('tcp://localhost:1883',option);


client.on("connect",function(){

    /*setInterval(function(){
     client.publish('intopic','hi every one',function(){
     console.log("published");
     });

     },10000);*/


    client.subscribe('/status');




    /*    client.subscribe('fire_fighter/kitchen/status');
        client.subscribe('doorlock/front/status');
        client.subscribe('house_hold/living/status');
        client.subscribe('thor/8754623583/status');



        client.subscribe('fire_fighter/kitchen/msg');
        client.subscribe('doorlock/front/msg');
        client.subscribe('house_hold/living/msg');
        client.subscribe('thor/8754623583/msg');
        client.subscribe('device/disconnect');


    */


    client.on('message',function(topic,message){

        console.log("{Coordinator} "+topic+"sending :"+message);


        //socket.emit("rasp", {message: message.toString()});   //socket
        io.to('room-golite').emit('notify',{messge:message.toString()});
    })


});






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

    socket.join("room-golite");

    socket.emit("notify",{'message':"Welcome to Golite"});

});


app.get('/',function(req,res){
    res.send("<marquee>GoLite is online By vivek and his team</marquee>");
});


var server=app.listen(process.env.PORT || 5000,function(){
    console.log("server running in port "+(process.env.PORT || 5000));
});

