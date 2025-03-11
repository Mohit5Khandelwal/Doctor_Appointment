import express from 'express'
import { doctorList, loginDoctor } from '../controllers/doctorController.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList);

// Login API 
doctorRouter.post('/login', loginDoctor);

export default doctorRouter