const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const recruiterSchema = mongoose.Schema({
    name: { 
        type: String,
        required: true,
    
    },
    username: { 
        type: String,
        required: true,
    
    },
    email: { 
        type: String,
        unique: true,
        required: true,
    
    },
    password: { 
        type: String,
        required: true,
    
    },
      avatar: { 
        type: String,
        default:  "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",

      },

    companyName: { 
        type: String,
        required: true,
    
    },
    companySize: { 
        type: String,
        required: true,
    
    },
    industry: { 
        type: String,
        required: true,
    
    },
    roles: { 
        type: String,
        required: true,
    
    },
    jobTitle: { 
        type: String,
        required: true,
    
    },
    qualification: { 
        type: String,
        required: true,
    
    },
    briefIntroduction: { 
        type: String,
        required: true,
    
    },
   
  

    
},
{
    timestamps: true,
}
)
recruiterSchema.pre('save', async function (next) {
    if(!this.isModified('password'))
         return next();
        
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

recruiterSchema.methods.comparePassword = async function (password){
    return bcrypt.compare(password, this.password);
}
module.exports = mongoose.model('Recruiter', recruiterSchema);

