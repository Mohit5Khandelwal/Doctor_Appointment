import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {

    const { aToken } = useContext(AdminContext);

    return (
        <div className='min-h-screen bg-white border-r'>
            {
                aToken && <ul className='text-[#515151] mt-5 px-2 py-3' >

                    <NavLink className={ ({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 rounded-md cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}` } to = {'/admin-dashboard'}>
                        <img src={assets.home_icon} alt='' />
                        <p className='md:block hidden'> Dashboard  </p>
                    </NavLink>

                    <NavLink className={ ({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 rounded-md cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}` } to = {'/all-appointments'} >
                        <img src={assets.appointment_icon} />
                        <p className='md:block hidden'> Appointment </p>
                    </NavLink>

                    <NavLink className={ ({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 rounded-md cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}` } to = {'/add-doctor'}>
                        <img src={assets.add_icon} />
                        <p className='md:block hidden'> Add Doctor </p>
                    </NavLink>

                    <NavLink className={ ({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 rounded-md cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}` } to = {'/doctor-list'} >
                        <img src={assets.people_icon} />
                        <p className='md:block hidden'> Doctor List </p>
                    </NavLink>



                </ul>
            }
        </div>
    )
}

export default Sidebar
