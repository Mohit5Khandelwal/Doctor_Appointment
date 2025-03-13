import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";


export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '' )
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);
    const [doctorData, setDoctorData] = useState(false);
    

    // API To fetch all doctors appointments 
    const getAppointments = async() => {

        try
        {
            const { data } = await  axios.get( backendUrl + '/api/doctor/appointments', { headers: { dToken }})

            if( data.success )
            {
                setAppointments( data.appointments )
                console.log( data.appointments )
            }
            else
            {
                toast.error( data.message )
            }
        }
        catch ( error )
        {
            console.log( error )
            toast.error( error.message )
        }
    }

    // API To get dash data for all the doctor 
    const getDashData = async() => {

        try
        {
            const { data } = await  axios.get( backendUrl + '/api/doctor/dashData', { headers: { dToken }})

            if( data.success )
            {
                setDashData( data.dashData );
                console.log( data.dashData );
            }
            else
            {
                toast.error( data.message )
            }


        }
        catch (error)
        {
            console.log( error )
            toast.error( error.message )
        }
    }

    const getProfileData = async() => {

        const { data } = await  axios.get( backendUrl + '/api/doctor/doctorProfile', { headers: { dToken }})

        try{
            if( data.success )
            {
                setDoctorData( data.doctorData )
                console.log('data.doctorData :', data.doctorData);

            }
            else 
            {
                toast.error( 'Something went wrong')
            }
        }
        catch(error)
        {
            console.log( error )
            toast.error( error.message )
        }
    }


    const value = {
        backendUrl, dToken, setDToken,
        appointments, setAppointments,
        getAppointments, getDashData, dashData,
        getProfileData, doctorData, setDoctorData

    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider;

// Here we can access value object to any component where 
// use this AppContext 