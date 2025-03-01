import express from 'express';
import { addDoctor, loginAdmin } from '../controllers/adminController.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';


const adminRouter = express.Router();

// Using upload.single('image') image will be paresed base 64 using this

adminRouter.post( '/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.post( '/login', loginAdmin)

export default adminRouter