
/**
 * Module dependencies.
 */

//var monModule = require('./routes/');
//console.log(monModule());

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , friends = require('./friends')
  , async   = require('async')
  , request   = require('request')
  , http = require('http')
  , fs	 = require('fs')
  , path = require('path');
  
function getImgPath(friend){
	return './public/'+friend.uid+".jpg";
}

function _onImgFileWritten(fn, friend, err){
	if(err){fn(err);return;}
 
	friend.pic_big = getImgPath(friend);
	console.log('Downloaded', friend.pic_big);
	fn(null, friend);
}
 
function _onFriendImgData(fn, friend, err, resp, body){
  if(err){fn(err);return;}
 
  // MDC .bind() (same as partial function application)
  fs.writeFile(getImgPath(friend), body, 'binary',
    _onImgFileWritten.bind(null, fn, friend));
}

function friendIter(friend, fn){
  request({
    url:friend.pic_big,
    encoding:'binary'
  },
  // MDC .bind() (same as partial function application)
  _onFriendImgData.bind(null, fn, friend));
}
 

function done(err, updatedFriends){
	friends = updatedFriends;
	console.log("done");
}

async.mapLimit(friends, 5, friendIter, done); //paramètres : tableau, iterateur, callback éxécuté une fois que le tableau a été parcouru en entier OU rencontre 1ère erreur

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.engine('htm', require('ejs').renderFile);
  //app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req,res){
fs.readFile("./views/index.html", function(err,data){
	if(err){
		console.error();
		res.send();
		return;
		}
		res.set('Content-Type', 'text/html');
		res.send(data);
	});

});

app.get('/friends', function(req, res){
	res.json(friends); //retourne au client ce json
});

app.get('/users', user.list);
app.get('/generate', function(req, res) {
console.log(req.query, req.params);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
