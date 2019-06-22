const request = require('request');
// app.js
const express = require('express')

const fs = require('fs');

var path = require('path')

// Create Express app
const app = express()

const URL = 'https://api.1mb.site'

const BASE_PATH = __dirname + '/'

//root path
app.get('/', (req, res) => res.send('Hello World!'))


const config = {
    headers: { 'Content-Type': 'multipart/form-data' }
};

const params = {
    "action": "keyverify",
    "username": "landing",
    "key": ""
}


app.get('/keyverify', (req, res) => {

    request.post({
            url: URL,
            formData: params
        },
        (err, httpResponse, body) => {
            if (err) {
                res.status(500).send('Error Respnse => ' + err)
                //return console.error('upload failed:'+ err);
            }
            res.status(200).send('Valid response => ' + body)
            // console.log('Success!! Server responded with:', body);
        });
})

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

    readDirectory(BASE_PATH, onFileContent, onError,res)


})



const readDirectory = (dirName, onFileContent, onError,response) => {

    fs.readdir(dirName, function(err, filenames) {

        console.log('filename Loop => ', filenames)
        if (err) {
            onError(err);
            return;
        }
        filenames.forEach(function(filename) {

            console.log('filename Loop => ', filename)
            fs.readFile(dirName + filename, 'utf-8', function(err, content) {
                if (err) {
                    onError(err);
                    return;
                }
                onFileContent(filename, content,response);
            });
        });

        // response 
        response.status(200).send('All files updated  successfully => ')
    });
}



/**
 **
 * file content 
 **/
const onFileContent = function(filename, content,response) {


    //console.log('on file content with filename ',filename)


    const file_ext = path.extname(filename)
    console.log('file_ext => ', file_ext)

    if (file_ext === '.html' || file_ext === '.js' || file_ext === '.css') {


        console.log('onfilecontent => read file => ', filename)
        //process

        const deployparamsonloop = {
            "action": "deploy",
            "site": "landing",
            "key": "92213815df30a4e0f13d4dc96a5ec353",
            "resource": filename,
            "code": content
        }

        request.post({
            url: URL,
            formData: deployparamsonloop
        }, (err, res, body) => {
            if (err) {
                response.status(500).send('Error Respnse => ' + err)
                //return console.error('upload failed:', err);
            }
            
            console.log(filename + ' updated successfully!  Server responded with:', body);
        });

    } // endif file_ext

}

const onError = function(err) {
    console.log('failed  onerror() =>' + err)

}



//start the server
app.listen(3000, () => console.log('Server running on port 3000!'))