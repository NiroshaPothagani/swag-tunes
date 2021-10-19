const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        maxlength:[40, 'must have lessthan 40 characters '],
        minlength:[10, 'must have  graterthan 10 characters '],
        
    },
   
    emailid: {
        type:String,
        required:[true, 'An email must have special character'],
        trim:true
    //rquired called  validator means simply a fun() it returns either true or false
    }, /* own ustom valiator --
           this only points to current doc on NEW documeent creation
           --syntax --
           validate: function(....){
               return .....
           } */
    password: {
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    // createdAt:{
    //     type:Date,
    //     default:Date.now()
    // }
},  
 //here using schema object as ...
 {
    toJSON: { virtuals: true },
    toJSON: { virtuals: true }
 });



 //DOCUMENT MIDDLEWARE :runs before .save() and .create()
 tourSchema.pre('save',function() {
    this.slugified = this.slugify(this.name, {lower:true});
    next();
})

//whole middleware called as .. pre save HOOK...

// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// })

const restaurent = mongoose.model('restaurent', tourSchema);

module.exports = restaurent;

/* there are types of middlewares
    1.document,
    2.model,
    3.query,
    4.aggregate
*/