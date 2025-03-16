import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';
import { RingLoader } from 'react-spinners';

const AllApointments = () => {

    const { aToken, appointments, getAllAppointments, backendUrl } = useContext( AdminContext )
    const { calculateAge, slotDateFormat } = useContext( AppContext )
    



    useEffect( () => {

        getAllAppointments()

    }, [aToken])

    // Function to cancel user appointment 
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


    return (
        <div className='w-full max-w-6xl m-5'>

            <p className='mb-3 text-lg font-medium'> All Appointments </p>

            <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll '>

                <div className='max-sm:hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-cols py-3 px-6 border-b'>

                    <p>#</p>
                    <p>Patient</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Doctor</p>
                    <p>Fees</p>
                    <p>Actions</p>

                </div>

                {
                    appointments.length > 0 && appointments.reverse().map( (item, index) => (

                        <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-blue-100 hover:text-black hover:font-bold' key={index}>
                            <p className='max-sm:hidden'> {index + 1 } </p>

                            <div className=' flex items-center gap-2 '>
                                <img className='md:w-8 max-sm:hidden  rounded-full sm:w-2 bg-gray-200' src={ item.userData.image } alt='' /> <p> { item.userData.name} </p>
                            </div>

                            <p className='max-sm:hidden'> { calculateAge( item.userData.dob )} </p>

                            <p className='max-sm:hidden'> { slotDateFormat(  item.slotDate )} , {item.slotTime} </p>

                            <div className=' flex items-center gap-2 max-sm:hidden'>
                                <img className='lg:w-10 md:w-8 rounded-full bg-gray-200' src={ item.docData.image } alt='' /> <p> { item.docData.name} </p>
                            </div>

                            <p> ₹ {item.docData.fees} </p>
                            {
                                item.cancelled 
                                ?
                                <p className='w-10 p-3 rounded-full text-lg' > ❌  </p>
                                :
                                item.isCompleted 
                                ? 
                                <p className='w-10 p-3 rounded-full text-xl' > ✔️</p>
                                :
                                <img onClick={ () => cancelAppointment( item._id, item.userData._id ) } src={assets.cancel_icon} />
                            }
                        
                        </div>

                        
                    ) )
                }

                { appointments.length == 0 && (
                                    <div className="flex justify-center mx-auto my-10 ">
                                        <RingLoader loading={ true } color="blue" size={120} />
                                    </div> )
                }

            </div>
        
        </div>
    )
}

export default AllApointments
