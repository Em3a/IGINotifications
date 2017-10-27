var urlsToShow = [];
var interruptUrls = [];
var urlToShow = '';

var urlsDirectory = 'C:/Users/emma chapple.DEV/Documents/Dev Days/Node server/public';

var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(urlsDirectory));


/// param ?url=
app.get('/register', function (req, res) {
	
   if (!urlsToShow.includes(req.query.url))	
   {
	    urlsToShow.push(req.query.url);
		res.send('register url: ' + req.query.url);
   }
});



// param ?url=
app.get('/deregister', function (req, res) {
   if (urlsToShow.includes(req.query.url))	
   {
	    var index = urlsToShow.indexOf(req.query.url);
		urlsToShow.splice(index, 1);
		
		res.send('deregister url: ' + req.query.url);
   }
});

app.get('/get_all_registered_urls', function (req, res) {
   res.send('all urls: ' + urlsToShow);
});

app.get('/get_current_url', function (req, res) {
	// TODO read up on CORS
	// where to leave, what to allow access to?
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
 	res.send(urlToShow);
});

// param ?url=
// TODO: have timeout for interrupt? i.e half a day, an hour? 
app.get('/register_interrupt', function (req, res) {
   if (!urlsToShow.includes(req.query.url))	
   {
		 interruptUrls.push(req.query.url);
		 res.send('register interupt url: ' + req.query.url);
   }
});

app.get('/deregister_interrupt', function (req, res) {
   if (interruptUrls.includes(req.query.url))	
   {
	    var index = interruptUrls.indexOf(req.query.url);
		interruptUrls.splice(index, 1);
		
		 res.send('deregister interupt url: ' + req.query.url);
   }
});

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
   console.log('A user connected');

   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
});

var currentIndex = -1;
var currentInterruptIndex = -1;

// Iterate over the registered urls and set the current url to show every 5 seconds 
setInterval(function () {
	urlToShow = GetNextUrl();
	io.emit("messages_newUrlToShow", urlToShow);
}, 5000)

function GetNextUrl()
{	
	if (urlsToShow.length == 0) 
	{
		return "";
	}
	
	if (interruptUrls.length != 0)
	{
		currentInterruptIndex = (currentInterruptIndex + 1)%interruptUrls.length;
		return interruptUrls[currentInterruptIndex];
	}
	
	currentIndex = (currentIndex + 1)%urlsToShow.length;
	return urlsToShow[currentIndex];
	
}
	
server.listen(8081);




