import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { Button } from '../components/ui/button';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

const MyAppointments = () => {

    const { backendUrl, token, getDoctorsData } = useContext(AppContext);
    const [appointments, setAppointments] = useState([])
    const months = [ "", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const navigate = useNavigate()

    const slotDateFormat = (slotdate) => {
        const dateArray = slotdate.split('_')
        return dateArray[0] + ' ' + months[ Number( dateArray[1])] + ' ' + dateArray[2] 
    }


    // Calling an api to fetch user appointments 
    const getUserAppointments = async () => {

        try
        {
            const {data} = await axios.get( backendUrl + '/api/user/appointments', { headers: {token}})

            if( data.success )
            {
                setAppointments( data.appointments.reverse() )
                console.log( data.appointments )
            }
            

        }
        catch (error)
        {
            console.log( error )
            toast.error( error.message );
        }
    }

    // Calling an api to cancel the appointments 
    const cancelAppointment = async (appointmentId) => {

        console.log( appointmentId );

        try
        {
            const { data } = await axios.post( backendUrl + '/api/user/cancel-appointment' , { appointmentId }, { headers: {token} } )

            console.log( data  )

            if( data.success )
            {
                toast.success( data.message )

                // Update user appointments 
                await getUserAppointments()
                await getDoctorsData()
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

    // Calling the razorpay ui 
    const initPay = (order) => {

        const options = {

            key : import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount : order.amount,
            currency : order.currency,
            name : 'Appointment Payment', 
            description : 'Appointment Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                console.log( response )

                // Updating the payment callback status 
                try
                {
                    // Callback status for payment 
                    const { data } = await axios.post( backendUrl + '/api/user/verify-payment', response, { headers : { token }})

                    if( data.success )
                    {
                        await getUserAppointments();
                        navigate('/my-appointments');
                        toast.success( data.message )
                    }
                    else
                    {
                        toast.error( data.message )
                    }
                }
                catch (error) {
                    console.log( error )
                    toast.error( error.message )
                }
            }
        }

        const rzp = new window.Razorpay( options )

        // open razorpay as pop up 
        rzp.open()


    }

    // Payment Integration 
    const paymentRazorpay = async (appointmentId) => {

        try
        {
            // Calling an payment api 
            const { data } = await axios.post( backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: {token} })

            if( data.success  )
            {
                console.log( data.order )
                initPay( data.order )
            }
        }
        catch (error) {
            console.log( error )
            toast.error( error.message );

        }
    }


    // Fun run ??
    useEffect( () => {

        if( token )
        {
            getUserAppointments()
        }

    }, [token])

    return (
        <div>

            <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'> My Appointments </p>
            <div>
                {
                    appointments.map( (item, index) => (

                            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b'  key={index}>

                                <div>
                                    <img className='w-40 bg-indigo-100' src={item.docData.image} alt="" />
                                </div>

                                <div className='flex-1 text-sm text-zinc-600'>
                                    <p className='text-neutral-800 font-medium'> {item.docData.name} </p>
                                    <p> {item.docData.speciality } </p>
                                    <p className='text-zinc-700 font-medium mt-1 '> Address: </p>
                                    <p className='text-xs'> {item.docData.address.line1} </p>
                                    <p className='text-xs'> {item.docData.address.line2} </p>
                                    <p className='text-xs mt-1'> <span className='text-sm text-neutral-700 font-medium'> Date & Time : </span> { slotDateFormat(item.slotDate ) } | {item.slotTime} </p>
                                </div>

                            <div>

                            </div>

                            <div className='flex flex-col gap-2 justify-center'>
                                { !item.cancelled && item.payment && !item.isCompleted  && <Button  className='text-white border bg-green-700  border-green-600  hover:bg-green-500' > Online Payment Successful   </Button> }
                                { !item.cancelled && !item.payment && !item.isCompleted  && <Button onClick={ () => paymentRazorpay( item._id ) } > Pay Online </Button> }
                                { !item.cancelled && !item.payment && !item.isCompleted  && <Button variant='destructive' onClick = { () => cancelAppointment(item._id) } > Cancel Appointment  </Button> }
                                { item.cancelled &&  !item.isCompleted  && <Button variant='outline' className='text-white bg-red-700 hover:bg-red-400 hover:text-white border border-red-600 ' > Appointment Cancelled  </Button> }
                                { item.isCompleted  && <Button  className='text-white border bg-green-700  border-green-600  hover:bg-green-500' > Appointment Completed   </Button> }
                            </div>


                        </div>

                    ))
                }
            </div>
        
        </div>
    )
}

export default MyAppointments
