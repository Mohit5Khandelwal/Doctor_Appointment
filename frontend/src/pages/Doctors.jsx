import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { GridLoader, PropagateLoader, PuffLoader, RingLoader } from 'react-spinners';

const Doctors = () => {

  const { speciality } = useParams();
  const { doctors } =  useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  console.log(speciality);
  const naviagte = useNavigate();

  // Filter the doctors based on the speciality

  const applyFilter = () => {

    if( speciality )
    {
      let data = doctors.filter( (item) => item.speciality === speciality );
      setFilterDoc(data);
    }
    else
    {
      setFilterDoc(doctors);
    }
  }

  useEffect( () => {
    
    applyFilter();
  }, [ doctors, speciality]);

  return !doctors ? <div className="flex justify-center mx-auto my-10 ">
                    <RingLoader loading={ true } color="blue" size={120} />
                  </div> : (

    <div>
      <p className='text-gray-600'> Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        
        <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''} `} onClick={ () => setShowFilter( (prev) => !prev ) } > Filters  </button>

        <div className={`flex-col flex gap-4 text-sm text-gray-600 ${ showFilter ? 'flex' : 'hidden sm:flex'} `}> 

        <p onClick={ () => speciality === 'General Physician' ? naviagte('/doctors') : naviagte('/doctors/General Physician') } className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality == "General Physician" ? 'bg-indigo-100 text-black' : ""} `}> General Physician </p>
        <p onClick={ () => speciality === 'Gynecologist' ? naviagte('/doctors') : naviagte('/doctors/Gynecologist') } className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? 'bg-indigo-100 text-black' : ""} `} > Gynecologist </p>
        <p onClick={ () => speciality === 'Dermatologist' ? naviagte('/doctors') : naviagte('/doctors/Dermatologist') } className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? 'bg-indigo-100 text-black' : ""} `} > Dermatologist  </p>
        <p onClick={ () => speciality === 'Pediatricians' ? naviagte('/doctors') : naviagte('/doctors/Pediatricians') } className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? 'bg-indigo-100 text-black' : ""} `} > Pediatricians </p>
        <p onClick={ () => speciality === 'Neurology' ? naviagte('/doctors') : naviagte('/doctors/Neurology') } className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurology" ? 'bg-indigo-100 text-black' : ""} `} >  Neurology </p>
        <p onClick={ () => speciality === 'Gastroenterologist' ? naviagte('/doctors') : naviagte('/doctors/Gastroenterologist') } className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? 'bg-indigo-100 text-black' : ""} `} >  Gastroenterologist </p>
      </div>
      <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0' >
        {
            filterDoc.map( (item, index) => (

              <div onClick={ () => naviagte(`/appointment/${item._id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>

                  <img className='bg-blue-100 hover:bg-blue-600' src={item.image} alt='' />

                  <div className='p-4'>
                      <div className='flex items-center gap-2 text-sm text-center text-green-500'>

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
      </div>
    </div>
    </div>
  )
}

export default Doctors