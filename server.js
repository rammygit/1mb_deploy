

const request = require('request');
// app.js
const express = require('express')

// Create Express app
const app = express()

const URL = 'https://api.1mb.site'

//root path
app.get('/', (req, res) => res.send('Hello World!'))


const config = {
  headers: {'Content-Type': 'multipart/form-data'}
};

const params = {
	"action":"keyverify",
	"username":"landing",
	"key":""
}


app.get('/keyverify', (req, res) => {

	request.post(
		{
			url:URL, 
			formData: params
		}, 
		(err, httpResponse, body) => {
			if (err) {
				res.status(500).send('Error Respnse => '+err)
				//return console.error('upload failed:'+ err);
			}
			res.status(200).send('Valid response => '+body)
			// console.log('Success!! Server responded with:', body);
		});
})

const deployparams = {

	"action":"deploy",
	"site":"landing",
	"key":"",
	"resource":"second.html",
	"code":"<p>second.html updated</p>"
}

/**
*
* Deploy the code for the 
**/
app.get('/deploy', (req, res) => {
	
	request.post(
		{
			url: URL, 
			formData: deployparams
		}, (err, httpResponse, body) => {
					  if (err) {
					  	res.status(500).send('Error Respnse => '+err)
					    //return console.error('upload failed:', err);
					  }
					  res.status(200).send('Valid response => '+body)
					  //console.log('code updated successfully!  Server responded with:', body);
			});
})



//start the server
app.listen(3000, () => console.log('Server running on port 3000!'))  




