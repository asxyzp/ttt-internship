/*
	Program : Creating a server to respond to user request
	Created by asxyzp (Aashish Loknath Panigrahi)
*/
let http = require('http');		//Importing http module
let fs = require('fs');			//Importing file system module
let mysql = require('mysql');	//Importing MySQL module

http.createServer(function(req, res) {	//Creating a server
	if (req.url == '/') {			//When request URL = '/'
		fs.readFile('index.html', function(err, data) {
			//If there's an error while reading index.html file 
			if (err) {
				res.writeHead(404);
				res.write("CONTENT NOT FOUND!");
				return res.end();
			}
			//If not then the HTML file will be sent
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.write(data);
			return res.end();
		});
	}
	//When the request URL asks for data
	else if (req.url.indexOf('/data?=') != -1) {
		res.writeHead(200, { 'Content-Type': 'application/json' });

		//Creating connection to the database
		let con = mysql.createConnection({
			host: 'remotemysql.com',
			port: 0000,
			user: '',
			password: '',
			database: ''
		});
		con.connect(function(err) {
			if (err)
				return console.log('CONNECTION ERROR : ', err.message);
			console.log("Connected to the database");
		})

		//Getting the value of N from request URL
		let n = Number(req.url.substr(req.url.indexOf('=') + 1));
		let getQuery = "SELECT * FROM wordfreq ORDER BY frequency DESC LIMIT " + n;

		//Making a SQL query
		//Printing the resultant output
		con.query(getQuery, function(err, result) {
			if (err)
				return console.error('', err.message);
			let resObj = {};
			for(let i=0;i<result.length;i++){
				resObj[result[i]["word"]]=result[i]["frequency"];
			}
			console.log(result);
			console.log(JSON.stringify(resObj));
			res.write(JSON.stringify(resObj));
			return res.end();
			console.log("Query obtained from the database");
		});

		//Closing connection to the database 
		con.end(function(err) {
			if (err)
				return console.error(err.message);
			console.log("Data connection closed.")
		});
	}
	
}).listen(8080);
