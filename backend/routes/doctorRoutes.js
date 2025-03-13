import express from 'express'
import { appointmentCancel, appointmentComplete, appointmentsDoctor, doctorDashboard, doctorList, getDoctorProfile, loginDoctor } from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js';

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList);

// Login API 
doctorRouter.post('/login', loginDoctor);


// API to fetch doctor appointments 
doctorRouter.get( '/appointments', authDoctor, appointmentsDoctor);

// API to update appointment status 
doctorRouter.post( '/complete', authDoctor, appointmentComplete );

// API to cancel appointment 
doctorRouter.post( '/cancel', authDoctor, appointmentCancel );

// API to get dashboard data 
doctorRouter.get( '/dashData', authDoctor, doctorDashboard );

// API to get user profile 
doctorRouter.get( '/doctorProfile', authDoctor, getDoctorProfile );




export default doctorRouter