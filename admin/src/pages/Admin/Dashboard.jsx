import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';



const Dashboard = () => {

    const { aToken, getDashboardData, dashData, backendUrl, getAllAppointments } = useContext( AdminContext )
    const { slotDateFormat } = useContext( AppContext )

    useEffect( () => {
        
        if( aToken )
        {
            getDashboardData()
        }

    }, [aToken]) 

    // Calling an api to cancel the appointments 
    const cancelAppointment = async (appointmentId, userId) => {

        console.log( appointmentId );

        try
        {
            const { data } = await axios.post( backendUrl + '/api/admin/cancel-appointment' , { appointmentId, userId }, { headers: {aToken} } )

            console.log( data  )

            if( data.success )
            {
                toast.success( data.message )

                // Update user appointments 
                await getAllAppointments()

                // update the dashboard data 
                await getDashboardData()

            }
            else 
            {
                toast.error( data.message )
            }
        }
        catch (error)
        {
            console.log( error )
            toast.error( error.message );
        }

    }


    return dashData && (
        <div className='m-5'>

            <div className='flex flex-wrap gap-4'>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-blue-300 hover:border-blue-600 cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-gray-200'>
                    <img className='w-14' src={ assets.doctor_icon} alt='' />
                    <div>
                        <p className='text-xl font-bold text-gray-700'> {dashData.doctors} </p>
                        <p className='text-gray-500' > Doctors </p>
                    </div>
                </div>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-blue-300 hover:border-blue-600  cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-gray-200'>
                    <img className='w-14' src={ assets.appointments_icon} alt='' />
                    <div>
                        <p className='text-xl font-bold text-gray-700'> {dashData.appointments} </p>
                        <p className='text-gray-500'> Appointments </p>
                    </div>
                </div>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-blue-300 hover:border-blue-600  cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-gray-200'>
                    <img className='w-14' src={ assets.patients_icon} alt='' />
                    <div>
                        <p className='text-xl font-bold text-gray-700'> {dashData.users} </p>
                        <p className='text-gray-500'> Users </p>
                    </div>
                </div>


            </div>

            <div className='bg-white'>

                <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border bg-gray-100'>
                    <img src={assets.list_icon} alt='' />
                    <p className='font-semibold'> Latest Bookings </p>
                </div>

                <div className='pt-4 border border-t-0'>

                    {
                        dashData?.latestAppointments.map( (item, index) => (

                            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-200' key={index}>
                                <img className='rounded-full w-10 bg-gray-300' src={item.docData.image} alt='' />
                                <div className='flex-1 '>
                                    <p className='text-gray-800 font-medium'> {item.docData.name} </p>
                                    <p className='text-gray-600'> { slotDateFormat( item.slotDate ) } </p>

                                </div>
                                {
                                    item.cancelled 
                                    ?
                                    <p className='text-white text-sm font-medium bg-red-600 border hover:border-white hover:bg-red-400 border-red-400 p-3 rounded-full'> Cancelled  </p>
                                    :
                                    <img onClick={ () => cancelAppointment( item._id, item.userData._id ) } src={assets.cancel_icon} />
                                }

                                <hr />

                            </div>
                        ))
                    }

                </div>
            </div>

        
        </div>
    )
}

export default Dashboard
