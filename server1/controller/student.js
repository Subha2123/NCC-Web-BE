import Student,{validateStudent} from '../model/student.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cloudinary from '../utils/cloudinary.js'



// admin add a student
const addStudent=async(req,res)=>{
  try {
  
    let cryptPass= await  bcrypt.hash(req.body.password,10) 
  
    const {error}=validateStudent(req.body)
    const regNo=await Student.findOne({$or:[{regimentNo:req.body.regimentNo},{email:req.body.email},{mobileNo:req.body.mobileNo}]})
    
    if(regNo) return res.send("Regiment Number or Email or Mobile Number must be unique")

    else if(error) return res.send(error.details[0].message);
  
    else{

      const  result =await cloudinary.uploader.upload(req.body.url)
      // console.log(result)

    let student={
      name: req.body.name,
      email:req.body.email,
      password:cryptPass,
      regimentNo:req.body.regimentNo,                                                                                                                    
      batch:req.body.batch,
      mobileNo: req.body.mobileNo , 
      rank:req.body.rank,
      dateOfEnroll:req.body.dateOfEnroll,
      EnrollingOfficer:req.body.EnrollingOfficer,
      dob:req.body.dob,
      bg:req.body.bg,
      vegOrNonveg:req.body.vegOrNonveg,
      aadharNo:req.body.aadharNo,
      incharge:req.body.incharge,
      bankDetails:req.body.bankDetails, 
      image:{  
        img_name: req.body.img_name,
        profile_img: result.secure_url,
        cloudinary_id: result.public_id
      }
    }
  let addData=await Student.create(student)
     
  if(addData)  return res.send(addData)

  }
  } catch (error) {
    return res.send(error.message)
  }
}


//admin update student profile image in cloudinary and db
const updateStudent=async(req,res)=>{

 try {
  let user=await Student.findOne({regimentNo:req.query.regimentNo})
  if(!user) return res.send('user not found')
 
  // const updatedata={  
  //   name: req.body.name || user.name,
  //   mobileNo: req.body.mobileNo || user.mobileNo,
  //   batch:req.body.batch || user.batch,
  //   EnrollingOfficer:req.body.EnrollingOfficer || user.EnrollingOfficer,
  //   rank:req.body.rank || user.rank ,
  //   incharge:req.body.incharge || user.incharge,
  //   dob:req.body.dob || user.dob,
  //   bg:req.body.bg || user.bg,
  //   vegOrNonveg:req.body.vegOrNonveg || user.vegOrNonVeg,
  //   aadharNo:req.body.aadharNo ||user.aadharNo,
  //     holdername:req.body.holdername ||user.bankDetails.holdername,
  //     accNo:req.body.accNo|| user.bankDetails.accNo,
  //     bankName:req.body.bankName|| user.bankDetails.bankName,
  //     branch:req.body.accNo|| user.bankDetails.branch,
  //     ifscCode:req.body.ifscCode || user.bankDetails.ifscCode
  //   }


let result=await Student.findOneAndUpdate({regimentNo:req.query.regimentNo},{$set:req.body},{new:true})
res.send(result)
    
  
 } catch (error) {
  res.status(400).send(error.message)
 }

}

const updateProfileImg=async(req,res)=>{
  try {
    let user=await Student.findOne({regimentNo:req.query.regimentNo})
  if(!user) return res.send('user not found')
  //delete image cloud
 await cloudinary.uploader.destroy(user.image.cloudinary_id);
 //insert image cloud
   const result = await cloudinary.uploader.upload(req.body.url);

 let fresult=await Student.findOneAndUpdate({regimentNo:req.query.regimentNo},{
  $set:{image:{
    name: req.body.name || user.name,
    profile_img: result.secure_url || user.image.profile_img,
    cloudinary_id: result.public_id || user.image.cloudinary_id,
  }
 }},{new:true})

 res.send(fresult)
 

  } catch (error) {
    res.status(400).send(error.message)
  }
}

//admin a view a particular student
// const viewStudent=async(req,res)=>{
//   try {
//     const view=await Student.find({regimentNo:req.params.regimentNo},{_id:0,__v:0}).populate('camp')
//     if(view.length<=0) return res.status(400).send("There is No student")
//     res.send(view)
    
//   } catch (error) {
//     res.status(400).send(error.message)
//   }
// }

//admin view all student data
const viewAll=async(req,res)=>{
  const {match='{}'}=req.query
  try{

    const view=await Student.find(JSON.parse(match)).populate('camp')
    res.send(view)
    // const view=await Student.distinct('email')
    // res.send(view)

  }catch(error){
    res.status(400).send(error.message)
  }
}




//student login with their email /password  provided by admin
const loginUsers=async(req,res)=>{
  try {
    // console.log( req.body.email);
    let userData=await Student.findOne({email:req.body.email});
    console.log(userData)
    if (!userData) {
        return res.status(400).send("email Not found")
    }
    let validpassword =await bcrypt.compare(req.body.password,userData.password)
   if(!validpassword) {
    return res.status(400).send("Not a valid password")
   }
   const id=userData._id
   const isStudent=userData.isStudent
  const token =await jwt.sign({id:id,isStudent:isStudent},process.env.JWTKEY);

  res.header('auth',token).send({
    message:'Logged in successfully',
    token:token,
    data:userData
  })
} catch (error) {
    res.status(400).send(error.message)
}
}


//student update their password
const updatePassword=async(req,res)=>{
  try {
    let new_pass=req.body.new_pass
    let confirm_pass=req.body.confirm_pass

    let student=await Student.findOne({_id:req.user.id})
    // console.log(student.password)
    let stuPwd=student.password
    
    let validpassword =await bcrypt.compare(req.body.password,stuPwd)
    //console.log(validpassword)

    if(!validpassword) return res.status(400).send("Invalid Old password")
    if(new_pass!==confirm_pass) return res.status(400).send("Password Missmatch")

    let hash=await bcrypt.hash(new_pass,10);

    let update=await Student.findOneAndUpdate({_id:req.user.id},{$set:{password:hash}},{new:true})
    res.status(200).send("updated Successfuly")
    
} catch (error) {
    res.status(400).send(error.message)
}
}


//admin delete a student data from db

const deleteStudent=async(req,res)=>{
  try {
    let student=await Student.findOne({regimentNo:req.params.regimentNo})

    let user = await Student.findOne({_id:student._id});
    if(!user) return res.send('no user found')

    await cloudinary.uploader.destroy(user.image.cloudinary_id);

    await Student.deleteOne({_id:student._id});

    res.send(`${req.params.regimentNo} data deleted`);

  } catch (error) {
    res.status(400).send(error.message)
  }
}

//student view their profile only
const ViewProfile=async(req,res)=>{
  try {
    let result=await Student.findById({_id:req.user.id}).populate('camp')
    return res.status(200).send(result)
  } catch (error) {
    res.status(400).send(error.message)
  }
}
 

export {addStudent,updateStudent,viewAll,updatePassword,loginUsers,deleteStudent,ViewProfile,updateProfileImg}



