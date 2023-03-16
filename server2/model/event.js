import mongoose from 'mongoose';
import Joi from 'joi'

const eventSchema={

       eventImages:[{
        profile_img:{
          type:String,
          required:true,
        } ,
        cloudinary_id:{
          type:String,
          required:true,
        },  
     }],
      event_name:{
        type:String,
        required:true
      },
      event_place:{
        type:String,
        required:true
      },
      event_date:{
        type:Date,
        required:true
      },
      total_students:{
        type:Number,
        required:true
      },
      inAssociationWith:{
        type:String,
        required:true
      },
      description:{
        type:String,
        required:true
      }
}


const Event=mongoose.model('Event',eventSchema)

const validateEvent=(event)=>{
  const schema=Joi.object({
    event_name:Joi.string().required(),
    event_place:Joi.string().required(),
    event_date:Joi.date().raw().required(),
    total_students:Joi.string().required(),
    inAssociationWith:Joi.string().required(),
    description:Joi.string().required()
  }).options({ allowUnknown: true });
  return schema.validate(event)
}

export {validateEvent}
export default Event