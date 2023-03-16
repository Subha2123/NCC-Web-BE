import express from 'express'
import { adminReg,adminLogin } from '../controller/admin.js'

//import {addStudent,updateStudent,viewStudent,viewAll,deleteStudent} from '../controller/student.js'


// import auth from '../middleware/auth.js'
// import admin from '../middleware/admin.js'
// import upload from '../utils/multer.js'



const router=express.Router()

// //admin register/login

router.post('/register',adminReg)

router.post('/login',adminLogin)


// //admin manage student data

// router.post('/add',[auth,admin],upload.single('image'),addStudent)

// router.put('/update',[auth,admin],updateStudent)

// // router.put('/update/image',[auth,admin],upload.single('image'),updateImage)

// router.get('/view',[auth,admin],viewStudent)

// router.get('/viewall',[auth,admin],viewAll)

// router.delete('/delete',[auth,admin],deleteStudent)

// export default router

