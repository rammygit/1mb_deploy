const request = require('request');
// app.js
const express = require('express')

const fsPromises = require('fs').promises;

const path = require('path')

const rp = require('request-promise');

// Create Express app
const app = express()

const URL = 'https://api.1mb.site'

const BASE_PATH = __dirname

const DIRECTORY_IGNORE = ['node_modules','.git']

const FILE_IGNORE = ['.gitignore','server.js','server_new.js','package-lock.json','package.json']

// const BASE_PATH = '/Users/ram/Documents/projects/quickstart_hugo/public'

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


        readDirectory(res,BASE_PATH + '/')



    })();



})




/**
 * 
 * @param {*} basePath 
 */
const readDirectory = async function (res,basePath) {

    console.log('printing the base path at the start => ',basePath)
    const dirArr = await fsPromises.readdir(basePath, { withFileTypes: true })

    // console.log('dirArr => ',dirArr)
    for (const dirent of dirArr) {

        const file_ext = path.extname(dirent.name)
        const stat = await fsPromises.lstat(basePath+dirent.name);

        // console.log(" file list   => ", dirent)
        //  console.log('dirent stat =  is file  =>', stat.isFile())
        if (stat.isFile()) {
            console.log(' it is a file => ', dirent.name)
            if (file_ext === '.html' || file_ext === '.js' || file_ext === '.css') {
                if(FILE_IGNORE.indexOf (dirent.name ) == -1) {
                    console.log('reading the file => ',dirent.name)
                    process(res,basePath, dirent)
                } else {
                    // console.log('ignore else => ',dirent.name)
                }
                
            } else {
                //  console.log('in the else part of not matching file extension ')
                // console.log('not processing this file  => ', dirent)
            }

        } else {
            // console.log('reading the child directory => ', basePath + dirent.name + '/')
            if(DIRECTORY_IGNORE.indexOf (dirent.name ) == -1) {
                console.log('reading the directory => ',dirent.name)
                readDirectory(res,basePath + dirent.name + '/')
            }
            
        }




    } // end of for


    res.status(200).send();
}


/**
 * process the dirent
 * @param {*} dirent 
 */
const process = async function (res,basePath, dirent) {
    // console.log("processing file  => ", dirent)
    const fileContent = await fsPromises.readFile(basePath+dirent.name)


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
        .then(function (data) {
            console.log('success response =>  ', data);
            //res.status(200).send('All files updated  successfully => ',data)
            // res.status(200).send(data);

        })
        .catch(function (err) {
            // API call failed...
            console.log("failed ** ");
            //res.status(500).send('Files  updated  failed => ',err)
            // res.status(500).send(err)
            
        });
}


//start the server
app.listen(3000, () => console.log('Server running on port 3000!'))