import React, { useContext, useEffect, useState } from 'react'
import {assets} from '../assets/assets'
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext';
import { RingLoader } from 'react-spinners';

const Login = () => {

    const [state, setState] = useState('Admin');

    const {setAToken, backendUrl} = useContext(AdminContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { setDToken } = useContext( DoctorContext )


    
    const onSubmitHandler = async(event) => {

        event.preventDefault();

        console.log( email );

        setLoading( true );

        try 
        {
            if( state == 'Admin')
            {
                //Call the admin login api 
                const { data } = await axios.post( backendUrl + '/api/admin/login', { email, password } );

                console.log( data )

                if( data.success )
                {
                    setAToken( data.token );
                    // store in the browser local storage refrain from lossing it 
                    localStorage.setItem('aToken', data.token);
                    console.log( data.token );
                    toast.success( data.message )
                    setLoading( false );
                }
                else 
                {
                    toast.error( data.message )
                    setLoading( false );
                }
                
            }
            else
            {
                    //Call the admin login api 
                    const { data } = await axios.post( backendUrl + '/api/doctor/login', { email, password } );

                    console.log( data )
    
                    if( data.success )
                    {
                        setDToken( data.token );
                        // store in the browser local storage refrain from lossing it 
                        localStorage.setItem('dToken', data.token);
                        console.log( data.token );
                        toast.success( data.message )
                        setLoading( false );
                    }
                    else 
                    {
                        toast.error( data.message )
                        setLoading( false );
                    }
            }
        }
        catch (error)
        {
            console.log(error);
            toast.error( error.message )
            setLoading( false );
        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>

            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg bg-black' >

                <p className='text-2xl text-white font-semibold m-auto'>
                    <span className='text-blue-400' > {state}  </span> Login
                </p>

                <div className='w-full'>
                    <p className='text-white text-md'>Email</p>
                    <input className='border border-[#DADADA] rounded w-full p-2 mt-1' onChange={ (e) => setEmail(e.target.value) }  value={email} type='email' required />
                </div>

                <div className='w-full'>
                    <p className='text-white text-md'>Password</p>
                    <input className='border border-[#DADADA] rounded w-full p-2 mt-1' onChange={ (e) => setPassword(e.target.value) }  value={password} type='password' required />
                </div>

                <button className='bg-blue-600 text-white w-full py-2 rounded-md text-base mt-4' type='submit' > Login </button>

                {
                    state === 'Admin' && !loading
                    ?
                    <p className='text-white font-bold '> Doctor Login ? <span className='underline text-blue-400 cursor-pointer' onClick={  () => setState('Doctor') } > Click here </span> </p>
                    :
                    <p className='text-white font-bold '> Admin Login ? <span className='underline text-blue-400 cursor-pointer' onClick={  () => setState('Admin') } > Click here </span> </p>
                }

                { loading && <div className="flex justify-center mx-auto my-10 ">
                                        <RingLoader loading={ true } color="gray" size={120} />
                                    </div>  
                }

            </div>
        </form>
    )
}

export default Login
