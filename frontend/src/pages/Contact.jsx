import React from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { Button } from '../components/ui/button'

const Contact = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p> CONTACT <span className='text-gray-700 font-semibold' > INDIA </span></p>
      </div>

      <div className='my-10 flex flex-col items-center justify-center md:flex-row md-28 gap-10 text-sm'>
          
          <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt='' />

          <div className='flex flex-col justify-center items-center gap-6 ' >
            <p className='font-semibold text-lg text-gray-600' > Our OFFICE </p>
            <p className='text-gray-500 text-center'> 111/119 Vijay path <br/> Mansarovar, Jaipur, INDIA </p>
            <p className='text-gray-500 text-center'> Tel: (xxx-xxx-xx) <br /> Email: docConnect@gmail.com </p>
            <p className='font-semibold text-lg text-gray-600 text-center'> Careers at DocConnect </p>
            <p className='text-gray-500'> Learn more bout teams and job opening </p>
            <Button> Explore Jobs  </Button>
          </div>

      </div>
      
    </div>
  )
}

export default Contact
