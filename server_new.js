const request = require('request');
// app.js
const express = require('express')

const fsPromises = require('fs').promises;

const path = require('path')

const rp = require('request-promise');

// Create Express app
const app = express()

const URL = 'https://api.1mb.site'

const BASE_PATH = __dirname + '/'

const deployparams = {

    "action": "deploy",
    "site": "landing",
    "key": "",
    "resource": "second.html",
    "code": "<p>second.html updated</p>"
}

/**
 *
 * Deploy the code for the 
 **/
app.get('/deploy', (req, res) => {

    
    (async () => {
        const dirArr = await fsPromises.readdir(BASE_PATH, { withFileTypes: true })
        for (const dirent of dirArr) {
            
            const file_ext = path.extname(dirent.name)
            if (file_ext === '.html' || file_ext === '.js' || file_ext === '.css' 
            	     || dirent.name !== 'server.js' || dirent.name !== 'server_new.js') {

				console.log("processing file  => ", dirent)
				const fileContent = await fsPromises.readFile(dirent.name)
                

                let options = {
                    method: 'POST',
                    uri: URL,
                    formData: {
	                	action: 'deploy',
	                    site: 'landing',
	                    key: '92213815df30a4e0f13d4dc96a5ec353',
	                    code: fileContent,
	                    resource: dirent.name
	                                        	
                	}
                }


                rp(options)
                    .then(function(data) {
                        console.log('response ', data);
                        //res.status(200).send('All files updated  successfully => ',data)
                        res.status(200).send(data);

                    })
                    .catch(function(err) {
                        // API call failed...
                        console.log("failed ** ");
                        //res.status(500).send('Files  updated  failed => ',err)
                        res.status(500).send(err)
                    });
            } // end of if 

        }

    })();



})


// const readDirectory = async function(dirName) {



// }





//start the server
app.listen(3000, () => console.log('Server running on port 3000!'))