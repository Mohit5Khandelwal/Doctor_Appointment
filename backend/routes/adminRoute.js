import express from 'express';
import { addDoctor, allDoctors, appointmentsAdmin, loginAdmin } from '../controllers/adminController.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailability } from '../controllers/doctorController.js';


const adminRouter = express.Router();

// Using upload.single('image') image will be paresed base 64 using this

adminRouter.post( '/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.post( '/login', loginAdmin)
adminRouter.get( '/all-doctors', authAdmin, allDoctors)
adminRouter.post( '/change-availability', authAdmin, changeAvailability)

// API to fetch all appointments of an user 
adminRouter.get( '/appointments', authAdmin, appointmentsAdmin)


export default adminRouter