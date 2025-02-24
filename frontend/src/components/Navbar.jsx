import React, { useState } from 'react'
import { assets } from '../assets/assets_frontend/assets';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {

    const naviagte = useNavigate();
    const [token, setToken] = useState(true);
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
            {/* *** Unqiue way to import it  */}
            <img onClick={ () => naviagte('/') } className='w-44 cursor-pointer' src={assets.logo} />
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to={'/'}>
                    <li className='py-1'> Home </li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
                </NavLink>
                <NavLink to={'/doctors'}>
                    <li className='py-1'> All Doctors </li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to={'/about'}>
                    <li className='py-1'> About </li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to={'/contact'}>
                    <li className='py-1'> Contact </li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
            </ul>
            <div className='flex items-center gap-4'>

                {
                    token 
                    ? 
                    <div className='flex items-center gap-2 cursor-pointer group relative'> 
                        <img className='w-8 rounded-full' src={assets.profile_pic} />
                        <img className='w-2.5' src={assets.dropdown_icon} />
                        <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                            <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                <p  onClick={ () => naviagte('/my-profile')} className='hover:text-black cursor-pointer'> My Profile </p>
                                <p  onClick={ () => naviagte('/my-appointments')} className='hover:text-black cursor-pointer'> My Appointments </p>
                                <p  onClick={ () => setToken(false) } className='hover:text-black cursor-pointer'> Logout </p>
                            </div>
                        </div>
                    </div>
                    :
                    <button onClick={ () => naviagte('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block font-bold'> Create account</button>

                }

                <img onClick={ () => setShowMenu(true) } className='w-6 md:hidden' src={assets.menu_icon} />
                {/* ------------------ Mobile Menu ----------- */}
                <div className={` ${showMenu ? 'fixed w-full' : 'h-0 w-0'}   md:hidden right-0 top-3 left bottom-0 z-20 overflow-hidden bg-white transition-all `}>

                    <div className='flex items-center justify-between'>
                        <img className='w-36' src={assets.logo} alt='' />
                        <img   onClick={ () => setShowMenu(false) } className='w-7' src={assets.cross_icon} />
                    </div>

                    <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium' >
                        <NavLink  onClick={ () => setShowMenu(false) } to='/'> <p className='px-4 py-2 rounded full inline-block' > Home </p> </NavLink>
                        <NavLink onClick={ () => setShowMenu(false) } to='/doctors'> <p className='px-4 py-2 rounded full inline-block'> All Doctors </p></NavLink>
                        <NavLink onClick={ () => setShowMenu(false) } to='/about'> <p className='px-4 py-2 rounded full inline-block' > About </p> </NavLink>
                        <NavLink onClick={ () => setShowMenu(false) } to='/contact'> <p className='px-4 py-2 rounded full inline-block' > Contact </p> </NavLink>
                    </ul>


                </div>

            </div>
        
        </div>
    )
}

export default Navbar