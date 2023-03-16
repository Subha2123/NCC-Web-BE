import Camp,{validateCamp} from '../model/camp.js'
import cloudinary1 from '../utils/cloudinary1.js'
import Student from '../model/student.js'

// import cloudinary from '../utils/cloudinary.js'

const addCamp=async(req,res)=>{
try{
  console.log("hello");
   const {error}=validateCamp(req.body)
   const regNo=await Student.findOne({regimentNo:req.params.regimentNo})
   if(!regNo) return res.send("There is no cadet in this regiment Number")
   else if(error) return res.send(error.details[0].message);
   console.log(req.body.path)
   const  result =await cloudinary1.uploader.upload(req.body.path)

   console.log(result)
   let data={
    cadet_regimentNo:regNo.regimentNo,
    cadet_name:regNo.name,
    camp_name:req.body.camp_name,
    camp_place:req.body.camp_place,
    camp_type:req.body.camp_type,
    start_date:req.body.start_date,
    end_date:req.body.end_date,
    imageName:req.body.imageName,
    camp_img:result.secure_url,
    cloudinary_id:result.public_id
   }
   console.log(data)
   let addCamp=await Camp.insertMany([data])
   if(addCamp) return res.send(addCamp)

}catch(error){
    res.status(400).send(error.message)
}
}


//update camp in Student data

const referCamp=async(req,res)=>{

try{
    const getStudent=await Student.findOne({regimentNo:req.body.regimentNo})
    // console.log(getStudent.camp)
    
    const camp=await Camp.find({cadet_regimentNo:getStudent.regimentNo})
    // console.log(camp)
    if(!camp) res.status(400).send("No cadet")
    
    let arr=[];
    
    if(camp.length<=0){
        return res.send("no data")
    }
    else{
        camp.map(item => {
            arr.push(item._id)
        });
    }
    // console.log(arr);
      const updateCamp=await Student.findByIdAndUpdate({_id:getStudent._id},{new:true})
      updateCamp.camp=arr
      const result=await  updateCamp.save()
      res.send(result)
      console.log(result)
      
}catch(error){
   res.status(400).send(error.message)
}
}

//update camp using  cadet regimentno
const updateCamp=async(req,res)=>{
    try {
      let getCadet=await Camp.findOne({cadet_regimentNo:req.params.cadet_regimentNo})
      // console.log(getCadet)
      if(!getCadet) return res.status(400).send("There is no cadet")
      
      let getdata=await Camp.findOne({_id:getCadet._id})
      // console.log(getdata)
      if(!getdata) return res.send('Camp not found')
      
      let getcamp=await Camp.find({camp_name:req.params.camp_name})
      console.log(getcamp)
      if(!getcamp) return res.send("Camp name not matching")
      
      // await cloudinary1.uploader.destroy(getdata.cloudinary_id);
       
      // const result = await cloudinary1.uploader.upload(req.body.path);
        // console.log(result)

        const data = {
          camp_name:req.body.camp_name || getdata.name,
          camp_place:req.body.camp_place || getdata.place,
          camp_type:req.body.camp_type || getdata.camp_type,
          start_date:req.body.start_date ||getdata.start_date,
          end_date:req.body.end_date || getdata.start_date,
        };
        // console.log(data)
        let fresult=await Camp.findOneAndUpdate({camp_name:req.params.camp_name},{$set:data},{new:true})
        if(fresult) res.send(fresult)
        console.log(fresult)

    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  const updateCampImage=async(req,res)=>{
    try {
      let getCadet=await Camp.findOne({cadet_regimentNo:req.params.cadet_regimentNo})
      console.log(getCadet)
      if(!getCadet) return res.status(400).send("There is no cadet")
      
      let getdata=await Camp.findOne({_id:getCadet._id})
      if(!getdata) return res.send('Camp not found')
        
      await cloudinary1.uploader.destroy(getdata.cloudinary_id);
       
      const result = await cloudinary1.uploader.upload(req.body.path);
        // console.log(result)

        // const data = {
        //   imageName: req.body.imageName || getdata.imageName,
        //   camp_img: result.secure_url || getdata.camp_img,
        //   cloudinary_id: result.public_id || getdata.cloudinary_id,
        // };
        // console.log(data)
        let fresult=await Camp.findOneAndUpdate({cadet_regimentNo:req.params.cadet_regimentNo},{$set:
          {
          imageName: req.body.imageName || getdata.imageName,
          camp_img: result.secure_url || getdata.camp_img,
          cloudinary_id: result.public_id || getdata.cloudinary_id,
        }},{new:true})
        res.send(fresult)

    } catch (error) {
      res.status(400).send(error.message)
    }

  }


//get Event between  dates

const campDate=async(req,res)=>{
try{
 const start_date= req.params.start_date
 const end_date=req.params.end_date

const resent=await Student.aggregate([
 {
   $lookup:{
  from:'camps',
  localField:'camp',
  foreignField:'_id',
  as:'type'
 }
},{
  $unwind:'$type'
},{
  $match:{
    "type.start_date":{ $gte:new Date(start_date)},"type.end_date":{$lte:new Date(end_date)}
  }
},{
      $project: { bankDetails: 0 } 
}
])

if(resent.length<=0) return res.status(400).send("No data between two dates")
return res.send(resent)
 


// let date= new Date (Date.now());
// console.log(date)

}catch(error){
  res.send(error.message)
}
}

//get Date wise camps

const Enddate=async(req,res)=>{
  try{
   let  end_date=req.params.end_date
   
   
      const resent=await Student.aggregate([
        {
          $lookup:{
         from:'camps',
         localField:'camp',
         foreignField:'_id',
         as:'type'
        }
       },{
         $unwind:'$type'
       },{
         $match:{
           "type.end_date":new Date(end_date)
        }
       }
       ])
      if(resent.length<=0) return res.status(400).send("No data in this end date")
      return res.send(resent)
      
  }catch(error){
    res.send(error.message)
  }
}

//get data from date

const Fromdate=async(req,res)=>{
  try{
    let  start_date=req.params.start_date
    
       const resent=await Student.aggregate([
         {
           $lookup:{
          from:'camps',
          localField:'camp',
          foreignField:'_id',
          as:'type'
         }
        },{
          $unwind:'$type'
        },{
          $match:{
            "type.start_date":new Date(start_date)
         }
        }
        ])
       if(resent.length<=0) return res.status(400).send("No data in this start date")
       return res.send(resent)
     
  }catch(error){
    res.send(error.message)
  }
}
//get type wise/place wise/name wise
const Camptype=async(req,res)=>{
  let camp_type=req.params.camp_type
 try {
  
  const resent=await Student.aggregate([
    {
      $lookup:{
     from:'camps',
     localField:'camp',
     foreignField:'_id',
     as:'type'
    }
   },{
     $unwind:'$type'
   },{
     $match:{
       "type.camp_type":camp_type
    }
   },{
    $project: { bankDetails: 0,image:0,camp:0} 
   }
   ])
   console.log(resent)
  if(resent.length<=0) return res.status(400).send("No data in this camp type")
  return res.send(resent)

 } catch (error) {
  res.send(error.message)
 }
}
//get data camp place wise
const Campplace=async(req,res)=>{
  try {
    let camp_place=req.params.camp_place
    const resent=await Student.aggregate([
      {
        $lookup:{
       from:'camps',
       localField:'camp',
       foreignField:'_id',
       as:'type'
      }
     },{
       $unwind:'$type'
     },{
       $match:{
         "type.camp_place":camp_place
      }
     }
     ])
    if(resent.length<=0) return res.status(400).send("No data in this camp place")
    return res.send(resent)
  
    
  } catch (error) {
    res.send(error.message)
  }
}

const Campname=async(req,res)=>{
try{
 
  let camp_name=req.params.camp_name
  const resent=await Student.aggregate([
    {
      $lookup:{
     from:'camps',
     localField:'camp',
     foreignField:'_id',
     as:'type'
    }
   },{
     $unwind:'$type'
   },{
     $match:{
       "type.camp_name":camp_name
    }
   }
   ])
  if(resent.length<=0) return res.status(400).send("No data in this camp name")
  return res.send(resent)
 
}catch(error){
   res.status(400).send(error.message)
}
}


const getAll=async(req,res)=>{
  const viewcamp=await Camp.find().sort({start_date:-1})
  res.send(viewcamp)
}



export {addCamp,referCamp,updateCamp,campDate,getAll,updateCampImage,
Fromdate,Enddate,Camptype,Campplace,Campname}
