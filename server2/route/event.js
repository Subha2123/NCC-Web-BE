import express from 'express'
import auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../utils/multer.js'

import {addEvent,allEvent,updateEvent,eventDate,updateEventImage,EventName,EventPlace,EventAssociation,Eventonedate,recentEvent} from '../controller/event.js'
import { addCamp,referCamp, updateCamp ,campDate, getAll,updateCampImage,
Camptype,Campplace,Campname,Fromdate,Enddate} from '../controller/camp.js'


const router=express.Router()

//add events

router.post('/event/add',upload.single('image'),addEvent)

// router.get('/event/view/:event_name',[auth,admin],viewEvent)

router.get('/event/all',allEvent)

router.post('/update/event/:event_name',updateEvent)

router.post('/update/event/image/:event_name',[auth,admin],upload.single('image'),updateEventImage)

router.get('/event/name/:event_name',[auth,admin],EventName)

router.get('/event/place/:event_place',[auth,admin],EventPlace)

router.get('/event/associate/:inAssociationWith',[auth,admin],EventAssociation)

router.get('/event/between/:from/:to',[auth,admin],eventDate)

router.get('/event/date/:event_date',[auth,admin],Eventonedate)

router.get('/event/recent',recentEvent)


//add camps

router.post('/camp/add/:regimentNo',upload.single('image'),addCamp)

router.post('/camp/refer',referCamp)

router.post('/update/camp/:cadet_regimentNo/:camp_name',[auth,admin],updateCamp)

router.post('/update/camp/image/:cadet_regimentNo/:camp_name',[auth,admin],upload.single('image'),updateCampImage)

router.get('/camp/between/:start_date/:end_date',[auth,admin],campDate)

router.get('/camp/enddate/:end_date',[auth,admin],Enddate)

router.get('/camp/fromdate/:start_date',[auth,admin],Fromdate)

router.get('/camp/filter/type/:camp_type',[auth,admin],Camptype)

router.get('/camp/filter/place/:camp_place',[auth,admin],Campplace)

router.get('/camp/filter/name/:camp_name',[auth,admin],Campname)

router.get('/camp/getall',getAll)

export default router