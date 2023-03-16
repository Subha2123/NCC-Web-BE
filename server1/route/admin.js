import express from 'express'
import { adminReg,adminLogin } from '../controller/admin.js'
import {addStudent,updateStudent,viewAll,deleteStudent,updateProfileImg} from '../controller/student.js'


import auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../utils/multer.js'



const router=express.Router()

//admin register/login
router.post('/register',adminReg)

router.post('/login',adminLogin)

//admin manage student data

router.post('/add',[auth,admin],upload.single('image'),addStudent)

router.patch('/update',updateStudent)

router.post('/update/image',[auth,admin],upload.single('image'),updateProfileImg)

// router.get('/view/:regimentNo',viewStudent)

router.get('/viewall',viewAll)

router.delete('/delete/:regimentNo',deleteStudent)

export default router

