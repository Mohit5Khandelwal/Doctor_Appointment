import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { toast } from 'react-toastify';
import axios from 'axios';
import { ClockLoader, MoonLoader, PuffLoader } from 'react-spinners';

const DoctorProfile = () => {

    const { dToken, getProfileData, doctorData, setDoctorData, backendUrl } = useContext( DoctorContext )
    const [isEdit, setIsEdit] = useState(false);

    useEffect( () => {

        if( dToken )
        {
            getProfileData()
        }

    }, [dToken] );

    // Function to update the user profile 
    const updateProfile = async() => {

        try
        {
            const updateData = {
                fees : doctorData.fees,
                available : doctorData.available
            }

            // calling an api call to update the doctor data 
            const { data } = await axios.post( backendUrl + '/api/doctor/updateProfile', updateData, { headers: { dToken }})

            if( data.success )
            {
                toast.success( data.message)
                setIsEdit( false )
                // refresh the doctor data
                await getProfileData()
            }

            
        }
        catch (error)
        {
            console.log(error);
            toast.error( error.message)
        }
    }

    return !doctorData ?   <div className="flex justify-center mx-auto my-10 h-screen">
                        <PuffLoader loading={ true } color="blue" size={150} />
                        </div> :  (


        <div>

            <div className='flex flex-col gap-4 m-5 '>

                <div>
                    <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={doctorData.image} />
                </div>

                <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>

                    {/* ---- Doc Info : name, degree, experience */}

                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'> { doctorData.name } </p>
                    
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p> {doctorData.degree} - {doctorData.speciality} </p>
                        <button className='py-0.5 px-2 border border-blue-500 text-xs rounded-full'> {doctorData.experience} </button>
                    </div>


                    {/* ---- Doc About ----- */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'> About : </p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
                            {doctorData.about}
                        </p>
                    </div>

                    <p className='text-gray-600 font-medium mt-4'>
                    Appointment Fee: <span className='text-gray-800'> 
                    ₹ { isEdit ? 
                        <input 
                        type='number' 
                        value={doctorData.fees || ''} 
                        onChange={(e) => setDoctorData((prev) => ({ ...prev, fees: Number(e.target.value) }))} 
                        /> 
                        : doctorData.fees 
                    } 
                    </span>
                    </p>

                    <div className='flex gap-2 py-2 sm:hidden md:block'>
                        <p> Address :  </p>

                        <p className='text-sm'>
                            { doctorData.address.line1 }
                            <br />
                            { doctorData.address.line2 }
                        </p>



                    </div>

                    <div className='flex gap-1 pt-2'>
                        <input onChange={ () => isEdit && setDoctorData((prev) => ({ ...prev, available: !prev.available }))} checked={doctorData?.available} type='checkbox' name='' id='' />
                        <label htmlFor=''>
                            Available
                        </label>
                    </div>


                    {
                        isEdit 
                        ?
                        <button onClick={ () => { setIsEdit(false); updateProfile() } } className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all duration-300'> Save  </button>
                        :
                        <button onClick={ () => setIsEdit(true)} className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all duration-300'> Edit  </button>
                    }



                </div>

            </div>

        </div>
    )
}

export default DoctorProfile