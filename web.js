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

//start app 
// const port = process.env.PORT || 3000;

// app.listen(port, () => 
//   console.log(`App is listening on port ${port}.`)
// );
const http = require('http')
const hostname = '127.0.0.1';
const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World! NodeJS \n');
// });

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/servertest', async (req, res) => {
  res.send({server:"working"})
})

app.get('/getpdf', async (req, res) => {


  
  fs.readdir('./uploads/', (err, files) => {
           var merger = new PDFMerger();
           let uniquefilename = Date.now() + Math.random() + "file";
                   (async () => { 
                    files.map(val=>{
                      console.log('get sec arr',val);
                            merger.add('./uploads/'+val);
                          });
                     await merger.save('./uploadspdf/'+uniquefilename+'.pdf'); 
                     res.send({result:"success",url:uniquefilename+'.pdf'});
              })();
           })
  })
       

app.post('/uploadpdf', async (req, res) => {
          // for remove files in folder
  fs.readdir('./uploads/', (err, files) => {
    console.log('get sec arr gettt',files.length);
    if (err) throw err;
    if(files.length > 0){
      i = 0;
    for (const file of files) {
      fs.unlink('./uploads/'+file, err => {
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
            photo.mv('./uploads/' + photo.name);
            
            data.push({
                  name: photo.name,
                  mimetype: photo.mimetype,
                  size: photo.size
              });
           // sec - 2 *****************************************
           if(index == req.files.pdffiles.length-1){ 
           
                    if(mainfilesArray.length>0){
                      var i=0;
                     mainfilesArray.map(async (val,index)=>{
                      console.log('Success in writing file 999',val.pdffullpath);
                    let pdfBuffer = await request.get({uri: val.pdffullpath, encoding: null});
                    // fs.writeFileSync('./uploads/'+val.pdfname, pdfBuffer);
                            try {
                              fs.writeFileSync('./uploads/'+val.pdfname, pdfBuffer);
                              console.log('Success in writing file');
                              i++
                              console.log('new success',fileseqArray.length,i);
                              if(mainfilesArray.length == i){ 
                                fs.readdir('./uploads/', (err, files) => {
                                  if(fileseqArray.length == files.length){
                                    console.log('run meargin code with aside files //////');
                                        // sec - 4 ******************
                                        res.send({
                                          status: true,
                                          message: 'Success with files'
                                         });
                                           
                                      
                                    //     test();
                                    // try{
                                    //     var merger = new PDFMerger();
                                    //       (async () => { 
                                    //           fileseqArray.map(val=>{
                                    //             console.log('check it with ar','./uploads/'+val.oldname)
                                    //             merger.add('./uploads/'+val.oldname);
                                    //           });
                                    //           await merger.save('./uploads/'+'uniquefilenametest.pdf'); 
                                    //         })();
                                    //       }catch{console.log('cj er')}
                                          // sec - 4 *****************
                                    }
                                }) 
                               }
                                } catch (err) {
                                    console.log('Error in writing file')
                                    console.log(err)
                              }
                         })
                     
                }else{
                   fs.readdir('./uploads/', (err, files) => {
                    if( req.files.pdffiles.length == files.length){
                      // run without file mearging code-
                    console.log('run without file mearging code-',files.length);
                     // sec - 4 ******************
                    //  res.send( {result:'Success without files'});
             
                     res.send({
                      status: true,
                      message: 'Success without files'
                     });
                       
                       
                      // var merger = new PDFMerger();
                      // (async () => { 
                      //     fileseqArray.map(val=>{

                      //       merger.add('./uploads/'+val.oldname);
                      //     });
                      //     await merger.save('./uploads/'+'uniquefilenametest.pdf'); 
                      //   })();

                      // sec - 4 *****************
                    }
                  });
                
                }
              }
         else{ 
          
          }
        

       // sec - 2 *****************************************
              // if(req.files.pdffiles.length == data.length){
              //    res.send({
              //   status: true,
              //   message: 'Files are uploaded',
              //   data: data
              // });
              // }
          })

          function test(){
            try{
              var merger = new PDFMerger();
                (async () => { 
                    fileseqArray.map(val=>{
                      console.log('check it with ar','./uploads/'+val.oldname)
                      merger.add('./uploads/'+val.oldname);
                    });
                    await merger.save('./uploads/'+'uniquefilenametest.pdf'); 
                  })();
                }catch{console.log('cj er')}
          }

      // sec - 3 get all file name available in folder *****************************************
  
      // fs.readdir('./uploads/', (err, files) => {
      //   console.log('ffff length 1',files.length);
      //     console.log('ffff length 2',fileseqArray.length);
      //   if(files.length == fileseqArray.length){
      //     console.log('ffff length ',files.length);
      //     console.log('ffff length ',fileseqArray.length);
      //   }
      //   files.forEach((file,index) => {
      //   });
      // });
      
      // sec - 3 *******************************************************************************

      // sec - 4 ******************

      // fileseqArray.map(val=>{val.newfinalpath = './uploads/'+val.oldname});
      // console.log('test array',fileseqArray);
      // var merger = new PDFMerger();
      // (async () => { 
      //     merger.add('./uploads/abcd1.pdf');
      //     merger.add('./uploads/abc1.pdf');
      //     await merger.save('./uploads/'+'uniquefilenametest.pdf'); 
      //   })();
      // sec - 4 *****************
  }
  } catch (err) {
    res.status(500).send(err);
}
}

});




