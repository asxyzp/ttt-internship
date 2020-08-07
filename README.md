# ttt-internship
__Screenshot__:<br>
<img src="https://i.ibb.co/tYmt887/ttt-ss.png"/><br>
__Task__ : Building a full stack application, which has a front end which accepts a number input N with a submit button. On entering a value and pressing  the submit button, a request should be sent to the backend which returns the top N most frequently occurring words in the file http://terriblytinytales.com/test.txt & the result is displayed in the frontend, in a tabular format.   
__Technologies used__ : NodeJS (for backend), HTML, CSS, Bootstrap, JQuery (for frontend) & MySQL (for database).<br>
__Application hosted on https://repl.it :__ http://ttt-internship.asxyzp.repl.co/<br>
__Programs on https://repl.it :__ https://repl.it/@asxyzp/ttt-internship<br>

<br><br>__Full length explanation on architecture of the application :__
<img src="https://i.imgur.com/05Vzmuu.png"/><br>

__The application can be divided into two simple components :__<br>
__(A) Component A :__ This component (involving the propgram fetchData.js) fetches the text file from the provided URL using fetch() (which can be accessed using node-fetch module in NodeJS) & store the contents of the text file into a string using response => response.text(). Once the content is stored in a string, then we have to convert every character in the string to lowercase, so that there's no error while getting frequency of each word, as, for example, the words text, TEXT & tExT will give different frequencies, unless they are converted to lowercase using toLowerCase(). Once the string is converted to lower case, then we have to split the string into individual elements using split() w/ appropriate regex, which is / |,|\n|\?|;|\(|\)|\t|\./i. Once splitting is done, then we have an array of all the words in the text, but since the array contains plenty of empty strings (''), so we have to use filter() function to remove all the strings with length=0.

<br>Once, we have obtained a filtered array, we have to store the words with their respective frequencies in an object. This is achieved by a simple process w/ O(n) :<br>
1. Create an empty object, which will store word-frequency pair (as a key-value pair).<br>
2. Now, we have to iterate through each each element of the array & checking whether the given element is present as a key in our object. If so, then the object's key's value (which will store frequency in this case) will be increased by 1, otherwise a key-value pair will be created & it's frequency will be assigned as 1. 

<br>Once, we have obtained an object containing all the possible word-frequency pair, we have to store this information in a database (, so that querying information from the database becomes easier. For achieving this, I have used a remote database since https://repl.it doesn't provides a way to store database in localhost. NodeJS has a simple mechanism for creating a connection to database, connecting to database, making queries & ending the connection using createConnection(), connect(), query() & end(). For creating a table, if one already doesn't exists, we have use the SQL query, "CREATE TABLE IF NOT EXISTS wordfreq(word TEXT, frequency INT)" where wordfreq will be the table, word will store keys of the object & frequency will store value of each object. This completes the role of our first component.

**TL;DR**
Component (A) fetches text from .txt file, obtains frequency of each unique word in the text file & stores this data in a remote database, which can be accessed by other programs.

__Component (B) :__ This component (involving the program index.js & index.html) handles the server request. An http server can be created using http.createServer() in NodeJS & in the server, we have to handle requests & response. when the request url='/' then the index.html is accessed using fs (file system) module & is served using res.write() w/ it's header being res.writeHead(200, { 'Content-Type': 'text/html' }). Else if request url contains '/data?=', which can be requested using fetch() within index.html document, then we will be once again connect to the database using createConnection() & connect(). Now, the task is to query the topmost N words by frequency. This can be achieved by an extremely simple SQL query "SELECT * FROM wordfreq ORDER BY frequency DESC LIMIT " + n, where n is the input (e.g. 1,10,12) sent when request URL is '/data?=n'. ORDER BY frequency DESC, orders the words in the database by frequency in the descending order & LIMIT n, limits the number of elements in the query to N. Now, coming to the frontend application. The frontend application has input validation & the request won't be sent to the server when the input contains even a single __non-numeric character__ & the error will be displayed.

**TL;DR** Component (B) handles appropriate server requests & sent proper response after querying the database.

__Test case for input containing non-numeric character :__<br>
<img src="https://imgur.com/gOr1reX.png"/><br>
__Test case for input containing -ve symbol :__<br>
<img src="https://imgur.com/gSiuk0x.png"/><br>
__Test case for input containing input = 0 :__<br>
<img src="https://imgur.com/07VvG0f.png"/><br>
__Test case for input containing input = 4 :__<br>
<img src="https://imgur.com/r2g1TvB.png"/><br>
__Test case for input containing input = 6 :__<br>
<img src="https://imgur.com/5sTpSJt.png"/><br>
