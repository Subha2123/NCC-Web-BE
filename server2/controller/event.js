import Event ,{validateEvent} from '../model/event.js'
import cloudinary1 from '../utils/cloudinary1.js'

//Add new Event and joi validation
const addEvent=async(req,res)=>{
    
    try {
      const {error}=validateEvent(req.body)
      if(error) return res.status(400).send(error.details[0].message)

      let imagePayload=req.body.path
      // console.log(imagePayload);
      let eventImage=[]

      for (let i = 0; i < imagePayload.length; i++) {
    
        const result = await cloudinary1.uploader.upload(imagePayload[i]);
        console.log(result);
        eventImage.push({
          profile_img: result.secure_url,
          cloudinary_id: result.public_id,
        })
        
      }
      // console.log(eventImage);
    
      // const result = await cloudinary1.uploader.upload(req.body.path);
        let add={   
          eventImages:eventImage,
          event_name:req.body.event_name,
          event_place:req.body.event_place,
          event_date:req.body.event_date,
          total_students:req.body.total_students,
          inAssociationWith:req.body.inAssociationWith,
          description:req.body.description
          }
          // console.log(add);
          let addData=await Event.insertMany([add])
          res.send(addData)

    } catch (error) {
    res.status(400).send(error.message)
    }
}

//view a single event using event_name
// const viewEvent=async(req,res)=>{
//     try {
//       let getDate=await Event.findOne({event_name:req.params.event_name})
//       const view=await Event.find({_id:getDate._id},{_id:0,__v:0})
//       res.send(view)
      
//     } catch (error) {
//       res.status(400).send(error.message)
//     }
//   }
 

//view all the event
const allEvent=async(req,res)=>{
    try{
      const view=await Event.find().sort({event_date:-1})
      res.send(view)
  
    }catch(error){
      res.status(400).send(error.message)
    }
 
  }

//update event using event date

  const updateEvent=async(req,res)=>{
    try {
      let getDate=await Event.findOne({event_name:req.params.event_name})
     
     
        let fresult=await Event.findOneAndUpdate({event_name:getDate.event_name},{$set:data},{new:true})
        res.send(fresult)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  const updateEventImage=async(req,res)=>{
    try {
      let getDate=await Event.findOne({event_name:req.params.event_name})
      // console.log(event.imageName)
      let event=await Event.findOne({_id:getDate._id})

        if(!event) return res.send('Event not found')
        
        await cloudinary1.uploader.destroy(event.cloudinary_id);
       
        const result = await cloudinary1.uploader.upload(req.body.path);
        // console.log(result)

        // const data = {

        //   profile_img: result.secure_url || event.profile_img,
        //   cloudinary_id: result.public_id || event.cloudinary_id,
        // };
        // console.log(data)
        let fresult=await Event.findOneAndUpdate({event_name:event.event_name},{$set:{
          profile_img: result.secure_url || event.profile_img,
          cloudinary_id: result.public_id || event.cloudinary_id,
        }},{new:true})
        res.send(fresult)
      
    } catch (error) {
      res.status(400).send(error.message)
    }
  }


//Event date wise
// const dateWise=async(req,res)=>{
//   try {
//       const event_date=req.body.event_date
//       console.log(event_date);
//       const findDate=await Event.find({event_date:new Date(event_date)})
//       res.send(findDate)
      
//   } catch (error) {
//       console.log(error.message);
//   }
 
// }


//get Event between  dates
const eventDate=async(req,res)=>{
  const from= req.params.from
  const to=req.params.to

  const findDate=await Event.aggregate(
      [{$match: {event_date: { $gte:new Date(from),$lte:new Date(to)}}},
      {$project:{'_id':0}}
      ])
    if(findDate.length<=0) return res.status(400).send("Data not found")
    res.send(findDate);
}

const EventName=async(req,res)=>{
  try {
    let event_name=req.params.event_name
    const getEvent=await Event.find({event_name:event_name})
    if(getEvent.length<=0) return res.status(400).send("No data in this event name")
    return res.send(getEvent)
    
  } catch (error) {
    res.status(400).send(error.message)
  }
}

const EventPlace=async(req,res)=>{
  try {
    let event_place=req.params.event_place
    const getEvent=await Event.find({event_place:event_place})
    if(getEvent.length<=0) return res.status(400).send("No data in this event place")
    return res.send(getEvent)    
  } catch (error) {
    res.status(400).send(error.message)
  }
}

const EventAssociation=async(req,res)=>{
  try {
    let inAssociationWith=req.params.inAssociationWith
    const getEvent=await Event.find({inAssociationWith:inAssociationWith})
    if(getEvent.length<=0) return res.status(400).send("No data in this Association")
    return res.send(getEvent)    
  } catch (error) {
    res.status(400).send(error.message)
  }
}


const Eventonedate=async(req,res)=>{
  try {
    let event_date=req.params.event_date
    const getEvent=await Event.find({event_date:event_date})
    if(getEvent.length<=0) return res.status(400).send("No data in this Ḍate")
    return res.send(getEvent)    
  } catch (error) {
    res.status(400).send(error.message)
  }
}

const recentEvent=async(req,res)=>{
  try{
    const view=await Event.find()
    // res.send(view)
    // console.log(view)
    let data=view.slice(Math.max(view.length - 5, 0))
    res.send(data)

  }catch(error){
    res.status(400).send(error.message)
  }

}


export {addEvent,allEvent,updateEvent,eventDate,updateEventImage,EventName,EventPlace,EventAssociation,Eventonedate,recentEvent}