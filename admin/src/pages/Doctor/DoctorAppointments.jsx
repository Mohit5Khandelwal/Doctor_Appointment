import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';

const DoctorAppointments = () => {

    const { dToken, appointments, getAppointments, backendUrl} = useContext( DoctorContext );
    const { calculateAge, slotDateFormat } = useContext( AppContext )

    useEffect( () => {

        if( dToken )
        {
            getAppointments();
        }

    }, [dToken])

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



    return (
    
        <div className='w-full max-w-6xl m-5'>

            <p className = 'mb-3 text-lg font-medium'>  All Appointments </p>

            <div className='bg-white border border-gray-500 rounded text-sm max-h-[90vh] min-h-[50vh] overflow-y-scroll'>

                <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-2 py-3 px-6 border-b-2 border-b-gray-400 '>

                    <p> # </p>
                    <p> Patient </p>
                    <p> Payment </p>
                    <p> Age </p>
                    <p> Date & Time </p>
                    <p> Fees </p>
                    <p> Action </p>


                </div>

                {
                    appointments.length > 0 && appointments.reverse().map( (item, index) => (

                        <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-700 py-3 px-6 border-b-2 border-b-gray-700 hover:font-bold hover:bg-gray-100' key={index}>

                            <p className='max-sm:hidden'> {index + 1 } </p>

                            <div className='flex items-center gap-2'>

                                <img className='w-8 rounded-full' src={item.userData.image} alt='' /> <p> {item.userData.name} </p>

                            </div>

                            <div>
                                <p className='text-md inline border border-primary px-2 rounded-full '>
                                    { item.payment ? 'Online' : 'CASH' }
                                </p>
                            </div>

                            <p className='max-sm:hidden' > { calculateAge( item.userData.dob ) } </p>

                            <p> { slotDateFormat(  item.slotDate )} , {item.slotTime} </p>

                            <p> ₹ { item.amount } </p>

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

                        </div>
                    ))
                }
            </div>

        </div>
    )
}

export default DoctorAppointments