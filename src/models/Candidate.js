const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const  candidateSchema = mongoose.Schema({
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
    jobTitle: { 
        type: String,
        // required: true,
    
    },
    experience: { 
        type: String,
        // required: true,
    
    },
    skills: { 
        type: [],
        // required: true,
    
    },
    roles: { 
        type: [],
        // required: true,
    
    },
    resume: { 
        type: String,
        // required: true,
    
    },
    qualifications: { 
        type: String,
        // required: true,
    
    },
    jobLocation: { 
        type: String,
        // required: true,
    
    },
    workType: { 
        type: String,
        // required: true,
    
    },
    salary: { 
        type: String,
        // required: true,
    
    },
    availability: { 
        type: String,
        // required: true,
    
    },

    currentJob: { 
        type: String,
        required: true,
    
    },
     professionalExperience: { 
        type: String,
        enum: [], 
        required: true,
    },
    professionalSkill: { 
        type: String,
        enum: [], 
        required: true,
    },
    preferredRole: { 
        type: String,
        enum: [], 
        required: true,
    },

  

    
},
{
    timestamps: true,
}
)

candidateSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try{
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }

 catch (error) {
    next(error);
}
  
});

candidateSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};



module.exports = mongoose.model('Candidate', candidateSchema);

