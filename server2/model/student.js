import mongoose from 'mongoose';
import Joi from 'joi'


const studentSchema =
  {
    name: {
       type: String ,
       required: true,
      
      },
    email: {
      type: String,
      required: true,
      unique: true,
    }, 
    password: { type: String, required: true },
    mobileNo: {
      type: Number,
      required: true,
      unique: true,
    },
    batch:{ 
      type:String,
      required:true
    },
    dateOfEnroll:{ 
      type:Date,
      required:true
    },
    EnrollingOfficer:{ 
      type:String,
      required:true
    },
    regimentNo:{ 
      type:String,
      required:true,
      unique: true
    },
    rank:{ 
      type:String,
      required:true
    },
    incharge:{ 
      type:String,
      required:true
    },
    dob:{ 
      type:Date,
      required:true
    },
    bg:{ 
      type:String,
      required:true
    },
    vegOrNonveg:{ 
      type:String,
      required:true,
    },
     aadharNo:{ 
      type:Number,
      required:true
    },
    bankDetails:[{
     holdername:{
       type:String,
      required:true
     },
     bankName:{
      type:String,
      required:true
     },
     accNo:{
      type:Number ,
      required:true
     },
     branch:{
       type:String,
      required:true
     },
     ifscCode:{
       type:String,
      required:true
     }
  }],
  image:[{
    img_name:{
      type:String,
    },
    profile_img:{
      type:String,
      required:true,
    } ,
    cloudinary_id:{
      type:String,
      required:true
    } 

  }],
  camp:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Camp',
    default:null
  }],
 
  regNo: { type: String, required: false },
  dept: { type: String, required: false },

  isStudent:{
      type:Boolean,
      default:true
    }
}


const Student=mongoose.model('Student',studentSchema)

const validateStudent = (value) => {
    const schema = Joi.object({
      name:Joi.string().required(),
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
      password: Joi.string().required().min(6).required(),
      mobileNo:Joi.string().length(10).required(),
      batch:Joi.string().length(4).required(),
      dateOfEnroll:Joi.date().raw().required(),
      EnrollingOfficer:Joi.string().required(),
      regimentNo:Joi.string().required(),
      dob:Joi.date().raw().required(),
      rank:Joi.string().required(),
      incharge:Joi.string().required(),
      bg:Joi.string().required(),
      vegOrNonveg:Joi.string().required(),
      aadharNo:Joi.string().length(12).required(),
      bankDetails:Joi.array().items(
        {
          holdername: Joi.string().required(),
          bankName: Joi.string().required(),
          accNo: Joi.number().required(),
          branch:Joi.string().required(),
          ifscCode:Joi.string().length(11).required()
        },
      ),
      image:Joi.array().items(
        {
          img_name: Joi.string(),
        },
      ),
      dept:Joi.string().min(3),
      regNo:Joi.string(),

    }).options({ allowUnknown: true });
    const result = schema.validate(value)
  
    return result  
  };
export default Student
export {validateStudent}