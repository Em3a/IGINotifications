const PORT = process.env.PORT || 3000;

var urlsToShow = [];
var interruptUrls = [];
var urlToShow = '';

var urlsDirectory = 'public';

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var path = require("path");
var INDEX =  path.join(__dirname, '/public/NotificationPage.html');
//app.use(express.static('/public/NotificationPage.html'));
app.use((req, res) => res.sendFile(INDEX))
app.set('view engine', 'html');
//app.use(express.static(urlsDirectory));

/*
app.get('/', function(request, response) {
  response.render('NotificationPage');
});*/

/*
app.get('/',function(req,res){
    res.sendFile(INDEX); 
});
*/

app.get('*', function (req, res) {
   if (urlsToShow.includes(req.query.url))	
   {
	     res.sendFile(INDEX);
   }
});

/// param ?url=
app.get('/register', function (req, res) {
	
   if (!urlsToShow.includes(req.query.url))	
   {
		console.log('registered: ' + urlsToShow);
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
	console.log('all urls: ' + urlsToShow);
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
	
server.listen(PORT, () => console.log(`Listening on ${ PORT }`));





