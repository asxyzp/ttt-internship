//Program to fetch text file from the required URL & populating the remote database with individual words & it's respective frequencies
//Created by asxyzp (Aashish Loknath Panigrahi) 

let fetch = require('node-fetch');	//Since, fetch() is part of window, so to use it in node js, we have to use node-fetch module
let mysql = require('mysql');

//Fetching the text file
//Splitting the string into an array containing words.
fetch("http://terriblytinytales.com/test.txt")
.then(res=>res.text())
.then(data=>{
	//Will store the words with their frequency
	let refObj = {};
	
	//Converting all words to lowercase to observe frequency of words properly
	data = data.toLowerCase();
	data = data.replace(/"/g,/'/g);
	
	
	//Using split() w/ regex to get reqd. output
	let dataArr = data.split(/ |,|\n|\?|;|\(|\)|\t|\./i);

	//Array would only contain words w/ length >=1
	//This is because '' isn't a word
	dataArr = dataArr.filter(function(word){
		if(word.length>=1)
			return true;
		else
			return false;
	});

	//Iterating through the dataArr array & storing the frequency of each value
	let newWord='';	//Will store a new word
	while(dataArr.length!=0){
		newWord = dataArr.shift();		//Will store the first value of the array
		//When refObj is empty
		if(Object.keys(refObj).length==0){
			refObj[newWord]=1;
		}
		//When refObj is not empty
		else{
			//When the word already exists in refObj then increase it's value by 1
			if(newWord in refObj == true){
				++refObj[newWord];
			}
			//else set the newWord's count to 1
			else{
				refObj[newWord]=1;
			}
		}
	}
	
	//console.log(refObj);
	//for(let i=0;i<Object.keys(refObj).length;i++){
	//	console.log(Object.keys(refObj)[i],refObj[Object.keys(refObj)[i]]);
	//}
	
	//Storing values required for connection to a MySQL database on remotemysql.com
	let con = mysql.createConnection({
		host:'remotemysql.com',
		port:3306,
		user:'zsdGsYEfZK',
		password:'iGOqgSnlIC',
		database:'zsdGsYEfZK'
	});

	//Function to make a connection to the database
	//If there's an error, then the error message will be displayed in the console
	//Else success message will be displayed
	con.connect(function(err){
		if (err)
			return console.error(err.message);
		console.log("Connected to Database.")
	});

	//SQL command for creating a table, if one does not already exists
	let tableCreate = "CREATE TABLE IF NOT EXISTS wordfreq(word TEXT, frequency INT)";

	//Making a query to the remote database for creating a table
	//If there's an error, then the error message will be displayed
	//Else success message will be displayed
	con.query(tableCreate,function(err){
		if(err)
			return console.error(err.message);
		console.log("Table created (if one already doesn't exists).")
	});


	for(let i=0;i<Object.keys(refObj).length;i++){
		let addToTable = "INSERT INTO wordfreq (word, frequency) VALUES('"+Object.keys(refObj)[i]+"',"+refObj[Object.keys(refObj)[i]]+")";
		con.query(addToTable,function(err){
			if(err)
				return console.error(err.message);
			console.log("Element added");
		});
	}

	//Ending the connection to the database to avoid resource leaks
	//If there's an error, then the error message will be displayed
	//Else success message will be displayed
	con.end(function(err){
		if(err)
			return console.error(err.message);
		console.log("Data connection closed.");
	});
	
});