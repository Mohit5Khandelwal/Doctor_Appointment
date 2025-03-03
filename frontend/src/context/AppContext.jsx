import React, { createContext, useEffect, useState } from 'react'
//import { doctors } from '../assets/assets_frontend/assets'
import axios from 'axios'
import { toast } from 'react-toastify';


export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currencySymbol = '₹';
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [ doctors, setDoctors ] = useState([])
    const [ token, setToken ] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    const [userData, setUserData] = useState(false)

    // getting all doctors data 
    const getDoctorsData = async() => {

        try
        {
            const { data } = await axios.get( backendUrl + '/api/doctor/list')

            if( data.success )
            {
                setDoctors(data.doctors)
            }
            else 
            {
                console.log(data.error)
                toast.error( data.message )
            }
        }
        catch (error)
        {
            console.log(error)
            toast.error( error.message)
        }
    }

    // Fetch user profile data 

    const loadUserProfileData = async () => {

        try
        {
            const { data } = await axios.get( backendUrl + '/api/user/get-profile', { headers: { token } } )

            if( data.success )
            {
                setUserData( data.userData)
            }
            else 
            {
                toast.error( data.message )
            }
        }
        catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    useEffect( () => {

        getDoctorsData()

    }, [])


    // when the user is  log in the fetch it's data 
    useEffect( () => {

        if( token )
        {
            loadUserProfileData()
        }
        else 
        {
            // now user is logout 
            setUserData(false)
        }

    }, [token] )



    const value = {

        doctors, currencySymbol, 
        token, setToken, backendUrl,
        userData, setUserData,
        loadUserProfileData, getDoctorsData

    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider