const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const PDFMerger = require('pdf-merger-js');

const app = express();
var https = require('https');
var fs = require('fs');
const { pipeline } = require('stream');
const request = require("request-promise-native");
// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(express.static('public'));
const path = require('path');
//start app 
const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);


app.get('/imgfileview', function(request, response) {
   const today = new Date().getHours();
   const img = today <= 13 ? 'flooop.png' : 'flooop.png';
   console.log(__dirname);
   console.log(path.join(__dirname, '/public', img))
   response.send({newpath:path.join(__dirname, '/public', img)})
  //  response.sendFile(path.join(__dirname, '/public', img));
});
// const http = require('http')
// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World! NodeJS \n');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

app.get('/servertest', async (req, res) => {
  res.send({server:"working 99+ test"});
});

//  Main Api
app.post('/getpdf', async (req, res) => {
  uploadfolderid = req.headers.loggeduserid;
  mergefolderid = req.headers.userpdfdir;
   let mergeUploadDir = path.join(__dirname, '/public/uploadspdf/'+mergefolderid);
   let mergeUploadInside = path.join(__dirname, '/public/uploadspdf/'+mergefolderid+'/');

  if (!fs.existsSync(mergeUploadDir)){
    // for create folder
    fs.mkdirSync(mergeUploadDir);
  }
    else{

    }
  let fileseqArray =  JSON.parse(req.body.uniquedata);
  // +++++++++++++
  let filespathUpload = path.join(__dirname, '/public/uploadsmaster/'+uploadfolderid);
  fs.readdir(filespathUpload, (err, files) => {
           var merger = new PDFMerger();
           let uniquefilename = Date.now() + Math.random() + "file";
                   (async () => { 
                    fileseqArray.map(val=>{
                            console.log('get files',val);
                            merger.add(path.join(__dirname, '/public/uploadsmaster/'+uploadfolderid+'/',val.oldname));
                                });
                      await merger.save(path.join(mergeUploadInside,uniquefilename+'.pdf')); 
                     res.send({result:"success",url:uploadfolderid+'/'+uniquefilename+'.pdf'});
              })();
           })
  })

app.post('/uploadpdf', async (req, res) => {
  console.log('All headers value +-', req.files.pdffiles);
  uploadfolderid = req.headers.loggeduserid;
  let filespathUpload = path.join(__dirname, '/public/uploads/');
  let filespathMerged = path.join(__dirname, '/public/uploadspdf/');
   var masterhUploadDir = path.join(__dirname, '/public/uploadsmaster/'+uploadfolderid);
   var masterhUploadInside = path.join(__dirname, '/public/uploadsmaster/'+uploadfolderid+'/');
  console.log('here is header value',mergeUploadDir,masterhUploadInside)
  // console.log(JSON.stringify('All headers value',req.headers));

  // +++++ check folder exist or not

  if (!fs.existsSync(masterhUploadDir)){
    // for create folder
    fs.mkdirSync(masterhUploadDir);

      // for remove files in folder

    storeFiles();console.log('check test')
 
// close remove folders
}
// if folder already exist
else{
    // for remove files in folder
    fs.readdir(masterhUploadDir, async (err, files) => {
      console.log('get sec arr gettt',files.length);
      if (err) throw err;
      if(files.length > 0){
        i = 0;
      for (const file of files) {
        fs.unlink(masterhUploadInside+file, err => {
          if (err) throw err;
          console.log('get sec arr gettt 01',files.length);
          i++
          if(files.length == i){ 
            
            console.log('check test',i); 
            storeFiles()}
          // started new code for 
         
        });
    }
      }else{  storeFiles();console.log('check test');}
    });
  // close remove folders
          
}
  // +++++ check folder exist or not closed

 

// close remove folders
        
         
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  function storeFiles(){
  let mainfilesArray = JSON.parse(req.body.newpdffiles);
  let fileseqArray =  JSON.parse(req.body.uniquedata);
  fileseqArray.map(val=>{console.log(val.oldname)});
   
  try {
    if(!req.files) {
      res.send({
          status: false,
          message: 'No file uploaded'
      });
  } else {
    let data = []; 
         req.files.pdffiles.forEach((val,index)=>{
          
            let photo = req.files.pdffiles[index];
            //move photo to uploads directory
            photo.mv(masterhUploadInside + photo.name);
            console.log('here is header value with',mergeUploadDir,masterhUploadInside,photo.name)
            data.push({
                  name: photo.name,
                  mimetype: photo.mimetype,
                  size: photo.size
              });
             
              
      if(index == req.files.pdffiles.length-1){ 
           
        if(mainfilesArray.length>0){
          var i=0;
         mainfilesArray.map(async (val,index)=>{
          console.log('Success in writing file 999',val.pdffullpath);
        let pdfBuffer = await request.get({uri: val.pdffullpath, encoding: null});
        // fs.writeFileSync('./uploads/'+val.pdfname, pdfBuffer);
                try {
                  fs.writeFileSync(masterhUploadInside+val.pdfname, pdfBuffer);
                  console.log('Success in writing file');
                  i++
                  console.log('new success',fileseqArray.length,i);
                  if(mainfilesArray.length == i){ 
                    fs.readdir(masterhUploadDir, (err, files) => {
                      if(fileseqArray.length == files.length){
                        console.log('run meargin code with aside files //////');
                            // sec - 4 ******************
                            res.send({
                              status: true,
                              message: 'Success with files'
                             });
                          
                        }
                    }) 
                   }
                    } catch (err) {
                        console.log('Error in writing file')
                        console.log(err)
                  }
             })
         
    }else{
      
       fs.readdir(masterhUploadDir, (err, files) => {
        console.log('here is header value with one',mergeUploadDir,masterhUploadInside,files)
        if( req.files.pdffiles.length == files.length){

          // run without file mearging code-
         // sec - 4 ******************
         res.send({
          status: true,
          message: 'Success without files'

         });
          // sec - 4 *****************
        }
      });
    
    }
  }
else{ 

}
      
           // sec - 2 *****************************************
      
          })
  }
  } catch (err) {
    res.status(500).send(err);
}
}

});




