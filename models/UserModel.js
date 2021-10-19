const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
var bcrypt = require('bcryptjs');
// bcryptjs will salt our password i.e., that gone add random string
//To the password so that two(2) equal passwords do not generate same "HASH"


const userSchema = new mongoose.Schema({
    ofObjectId: [mongoose.Schema.Types.ObjectId],
    username : {
        type: String,
        required: [true, 'pls provide ur name'],

    },
    emailid:{
        type:String,
        required: [true, 'email is required..'],
        unique:true,
        lowercase:true,
        validate: [validator.isEmail, 'please provide valid email']
    },
    password:{
        type:String,
        required: [true, 'password required'],
        minlength:5,
        select:false

    },
    passwordConfirm:{
    type: String,
    required: [true, 'please confirm ur password'],
    validate: {
        //this only works on CREATE and SAVE 
        validator: function(el) {
            return el === this.password;
        },
        message: 'passwords are not  the same'
      }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type:Boolean,
        default:true,
        select:false
    },
    
   },
   //here using schema object as ...
   {
    toJSON: { virtuals: true },
    toJSON: { virtuals: true }
 }
);


//async used because ... thats why use await hash returns  promise..
//and also sync version will block our 
userSchema.pre('save', async function(next) {

    //Only run this function if password was actually modified

    //this refers current document here is current user
    if(!this.isModified('password')) return next();

    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12)
   
    //Delete passwordConfirm  field
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew)
    return next(); 

    this.passwordChangedAt = Date.now() -1000;
    next();


})

userSchema.pre(/^find/, function(next) {
    //this points to current query
    this.find({ active: {$ne : false} });
    next();
})

userSchema.methods.correctPassword = async function(
    candidatePassword, 
    userPassword
    ) {
    return await bcrypt.compare(candidatePassword,userPassword);
}

userSchema.methods.changePasswordAfter = async function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changeTimestamp = parseInt(
            this.passwordChangedAt.getTime()/1000, 10);
            return JWTTimestamp < changeTimestamp; 
        }

    return false; //false means not changed
}

userSchema.methods.createPassWordResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    this.passwordResetExpires = Date.now() +10*60*1000;

    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports  =User;