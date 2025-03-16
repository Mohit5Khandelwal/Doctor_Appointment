import React, { useContext } from 'react'
// import { doctors } from '../assets/assets_frontend/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { GridLoader, PropagateLoader, PuffLoader, RingLoader } from 'react-spinners';

const TopDoctors = () => {

    const naviagte = useNavigate();
    const { doctors } = useContext(AppContext);

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
            <h1 className='text-3xl font-medium'> Top Doctors to Book  </h1>
            <p className='sm:w-1/3 text-center text-sm'> Simply browse through our extensive list of trusted doctors. </p>

            {/* Doctors List  */}
            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>

                {
                    doctors &&  doctors.slice(0, 10).map( (item, index) => (

                        <div onClick={ () => { naviagte(`/appointment/${item._id}`); scrollTo(0,0) }} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>

                            <img className='bg-blue-50 hover:bg-blue-500' src={item.image} alt='' />

                            <div className='p-4'>
                                <div className='flex items-center gap-2 text-sm text-center '>

                                        <p className={`w-2 h-2 ${ item.available ? 'bg-green-500' : 'bg-red-500'}  rounded-full`}></p>
                                        { item.available && <p className='text-green-500'> Available  </p> }
                                        { !item.available && <p className='text-red-500'> Not Available  </p> }
                                    
                                </div>
                                <p className='text-gray-900 text-lg font-medium' > {item.name} </p>
                                <p className='text-gray-600 text-sm' > {item.speciality}  </p>
                            </div>

                            

                        </div>

                    ))
                }

                { !doctors && (
                                    <div className="flex justify-center mx-auto my-10 ">
                                        <RingLoader loading={ true } color="blue" size={120} />
                                    </div> )
                }


            </div>

                <button onClick={ () => { naviagte('/doctors'); scrollTo(0, 0); } } className='bg-blue-50 text-gray-600 px-12 py-3 mt-7 rounded-full mx-10 font-bold'>
                    more
                </button>

        </div>
    )
}

export default TopDoctors
