const bcrypt = require('bcryptjs');
const MongoClient = require('mongodb');
const Binary = require('mongodb').Binary;
const ObjectId = require('mongodb').ObjectId;
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const path = require('path');
const fs = require('fs');
const slug = require('slugify');

/**
 * NPM Module dependencies.
 */
const express = require('express');
const trackRoute = express.Router();
const multer = require('multer');

const mongodb = require('mongodb');

const options = require('gridfs-stream');
const {number} = [options.chunkSizBytes] //Optional overwrite this bucket's chunkSizeBytes for this file
const {string} = [options.contentTpe] //Optional string to store in the file document's `contentType` field
const {array} = [options.aliases] //optional array of strings to store in the file document's `aliases` field
const {boolean} = [options.disableD5=false] //If true, disables adding an md5 field to file data
const {GridFSBucket} =require('mongodb');
const { Readable } = require('stream');
const { pathToFileURL } = require('url');


const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
     process.env.DATABASE_PASSWORD);
//mongoose.connect(proccess.env.DATABASE_LOCAL,{})

// mongoose.connect(DB, {
//     useNewUrlParser:true,
//     useCreateIndex:true,
//     // useFindAndModify:true,
//     useUnifiedTopology: true
// })
/**
     * GET /tracks/:trackID
     */
    const audiofile = function() {
        let downloadStream = bucket.openDownloadStream(trackID);

        downloadStream.on('data', (chunk) => {
        res.write(chunk);
        });
    
        downloadStream.on('error', () => {
        res.sendStatus(404);
        });
    
        downloadStream.on('end', () => {
        res.end();
        });
    
    
        /**
        * POST /tracks
        */
        trackRoute.post('/', (req, res) => {
        const storage = multer.memoryStorage()
        const upload = multer({ storage: storage, limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 }});
        upload.single('track')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: "Upload Request Validation Failed" });
        } else if(!req.body.name) {
            return res.status(400).json({ message: "No track name in request body" });
        }
        
        let trackName = req.body.name;
        
        // Covert buffer to Readable Stream
        const readableTrackStream = new Readable();
        readableTrackStream.push(req.file.buffer);
        readableTrackStream.push(null);
    
        let bucket = new mongodb.GridFSBucket(db, {
            bucketName: 'tracks'
        });
    
        let uploadStream = bucket.openUploadStream(trackName);
        let id = uploadStream.id;
        readableTrackStream.pipe(uploadStream);
    
        uploadStream.on('error', () => {
            return res.status(500).json({ message: "Error uploading file" });
        });
    
        uploadStream.on('finish', () => {
            return res.status(201).json({ message: "File uploaded successfully, stored under Mongo ObjectID: " + id });
        });
        });
        });
    return audiofile;
    }
   

 const audioSchema = new mongoose.Schema({
    audioname : {
        type: String,
        trim:true,
        required: [true, 'pls provide audio name']
    },
    Artist:{
        type:String,
        trim:true,
        required:[true, 'pls provide artist name']
    },
    audiofile: {
        contentTpe:audiofile,
          type: String,
          trim:true,
          required:[true, 'please check ur audio file']
        
    }
},
    {
        toJSON: { virtuals: true },
        toJSON: { virtuals: true }
     }
    );

 //DOCUMENT MIDDLEWARE :runs before .save() and .create()
 audioSchema.pre('save',function() {
    this.slug = slugify(this.name, {lower:true});
    next();
})

// GridFSBucket.prototype.openUploadStream = function(filename, options) {
//     if (options) {
//       options = shallowClone(options);
      
//     } else {
//       options = {};
//     }
//     if (!options.chunkSizeBytes) {
//       options.chunkSizeBytes = this.s.options.chunkSizeBytes;
//     }
//     return new GridFSBucketWriteStream(this, filename, options);

//   };


// var audiopath = pathToFileURL.Request.String;
// connection.once('open', function () {
//     console.log('__Connection Open');
//     var gfs = Grid(connection.DB);

//     //whn connction open , create write stream with
//     // the name to store file as in the DB

//     var writestream = gfs.createWriteStream({
//         filename:'7rings.mp3'
//     });
//     var readstream = gfs.createReadStream({
//         filename:'7rings.mp3'
//     });

//     //pipe the read-stream in to the write stream
//     readstream.pipe(writestream);

//     //create aa read stream from where the audio currently is(qudiopath)
//     //and pipe it into the database {through writ stram}
//     fs.createReadStream(audiopath).pipe(writestream);

//     writestream.on('close', function() {
//         console.log("file has been written successfully!" );
//     })
// })

// MongoClient.connect(DB, (err, database) => {
//   if (err) {
//     console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
//     process.exit(1);
//   }
//   db = database;
// });



const audio = mongoose.model('audio', audioSchema);
 
module.exports = audio;

