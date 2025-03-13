import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorDashboard = () => {

    const { getDashData, dashData, dToken, backendUrl, getAppointments } = useContext( DoctorContext )
    const { slotDateFormat } = useContext( AppContext )


    useEffect( () => {

        if( dToken )
        {
            getDashData()
        }
    }, [dToken])

    // Calling an API to cancel the appointment 
    const cancelAppointment = async (docId, appointmentId) => {

        try
        {
            // Calling an api to complete the appointment 
            const { data } = await axios.post( backendUrl + '/api/doctor/cancel' , { appointmentId, docId }, { headers: {dToken} } )

            if( data.success )
            {
                toast.success( data.message );
                await getAppointments();
            }
            else
            {
                toast.error( data.message );
            }

        }
        catch (error)
        {
            console.log( error)
            toast.error( error.message )
        }
    }

    // Calling an API to complete the appointment 
    const completeAppointment = async (docId, appointmentId) => {

        try
        {
            // Calling an api to complete the appointment 
            const { data } = await axios.post( backendUrl + '/api/doctor/complete' , { appointmentId, docId }, { headers: {dToken} } )

            if( data.success )
            {
                toast.success( data.message );
                await getAppointments();
            }
            else
            {
                toast.error( data.message );
            }

        }
        catch (error)
        {
            console.log( error)
            toast.error( error.message )
        }
    }

    return dashData && (


        <div className='md:m-5 m-3'>

            <div className='flex flex-wrap gap-4'>

                <div className='flex  items-center gap-2 bg-white p-4 sm:p-2 min-w-52 rounded border-2 border-blue-300 hover:border-blue-600 cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-gray-200'>
                    <img className='w-14' src={ assets.earning_icon} alt='' />
                    <div>
                        <p className='text-xl font-bold text-gray-700'> ₹ {dashData.earning} </p>
                        <p className='text-gray-500' > Earnings </p>
                    </div>
                </div>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-blue-300 hover:border-blue-600  cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-gray-200'>
                    <img className='w-14' src={ assets.appointments_icon} alt='' />
                    <div>
                        <p className='text-xl font-bold text-gray-700'> {dashData.appointment} </p>
                        <p className='text-gray-500'> Appointments </p>
                    </div>
                </div>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-blue-300 hover:border-blue-600  cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-gray-200'>
                    <img className='w-14' src={ assets.patients_icon} alt='' />
                    <div>
                        <p className='text-xl font-bold text-gray-700'> {dashData.patients} </p>
                        <p className='text-gray-500'> Patients </p>
                    </div>
                </div>


            </div>

            <div className='bg-white hidden md:block'>

                    <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border bg-gray-100'>
                        <img src={assets.list_icon} alt='' />
                        <p className='font-semibold'> Latest Bookings </p>
                    </div>

                    <div className='pt-4 border border-t-0'>

                        {
                            dashData?.latestAppointments.map( (item, index) => (

                                <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-200' key={index}>
                                    <img className='rounded-full w-10 bg-gray-300' src={item.userData.image} alt='' />
                                    <div className='flex-1 '>
                                        <p className='text-gray-800 font-medium'> {item.userData.name} </p>
                                        <p className='text-gray-600'> { slotDateFormat( item.slotDate ) } </p>

                                    </div>
                                    {
                                        item.cancelled 
                                        ?
                                            <p>  ❌  </p>
                                            :
                                            item.isCompleted 
                                                ?
                                                <p className="text-xl">✔️</p>
                                                :
                                                <div className='flex'>
                                                    <img className='w-10 cursor-pointer' src={ assets.cancel_icon} onClick={ ( ) => cancelAppointment( item.docData._id, item._id )} />
                                                    <img className='w-10 cursor-pointer' src={ assets.tick_icon} onClick={ () => completeAppointment( item.docData._id, item._id ) } />
                                                </div>
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

export default DoctorDashboard
