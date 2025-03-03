import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets_frontend/assets';
import { Button } from '../components/ui/button';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';


const MyProfile = () => {

  // const [userData, setUserData] = useState({
  //   name: 'Rohan Kumar',
  //   image: assets.profile_pic,
  //   email: 'rohan@gmail.com',
  //   phone: '+ 123 456 7890',

  //   address: {
  //     line1: "wall street, xxxxx",
  //     line2: "Circle, London",
    
  //   },
  //   gender: 'Male',
  //   dob: '2000-01-20'
  // })

  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext( AppContext );

  console.log( userData );

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  // Function to update the user profile data 
  const updateUserProfileData = async () => {

    try
    {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);


      image &&  formData.append('image', image);

      // Calling an API to update the user data 
      const {data} = await axios.post( backendUrl + '/api/user/update-profile', formData, { headers: { token }})

      if( data.success )
      {
        toast.success(data.message)
        // fetch updated user data 
        await loadUserProfileData()
        setIsEdit(false)
        setImage( false )
      }
      else 
      {
        toast.error(data.message)
        
      }



    }
    catch (error)
    {
      console.log(error);
      toast.error( error.message );
    }


  }


  return userData && (
    <div className='max-w-lg flex flex-col gap-2 text-sm' >

      {
        isEdit 
        ? 
        <label htmlFor='image'>
          <div className='inline-block relative cursor-pointer'>
            <img className='w-36 rounded opacity-80' src={ image ? URL.createObjectURL(image) : userData.image } alt='' />
            <img className='w-10 absolute bottom-12 right-12' src={ image ? '' : assets.upload_icon} alt='' />
          </div>
          <input onChange={ (e) => setImage(e.target.files[0]) } type='file' id='image' hidden />
        </label>
        :
        <img className='w-36 rounded' src={userData.image} alt='' />
      }
      

      {
        isEdit 
        ?
        <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' type="text" value={userData.name} onChange={ (e) => setUserData(  (prev) => ({ ...prev, name: e.target.value }) ) } />
        :
        <p className='font-medium text-3xl text-neutral-800 mt-4' > {userData.name} </p>

      }

      <hr className='bg-zinc-400 h-[1px] border-none' />

      <div >
        <p className='text-neutral-500 underline mt-3' > CONTACT INFORMATION </p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium' > Email Id : </p>
          <p className='text-blue-500 text-md font-semibold'> {userData.email} </p>


          <p className='font-medium font-bold'> Phone : </p>

          {
            isEdit 
            ?
            <input className='bg-gray-300 p-2 rounded font-bold max-w-52' type="text" value={userData.phone} onChange={ (e) => setUserData(  (prev) => ({ ...prev, phone: e.target.value }) ) } />
            :
            <p className='text-blue-500 text-md font-semibold'> {userData.phone} </p>

          }

          <p className='font-medium' > Address :  </p>
          {
            isEdit 
            ? 
            <p>
              <input className='bg-gray-300 p-2 rounded font-bold max-w-52 mb-3' type='text' value={userData.address.line1} onChange={ (e) => setUserData( (prev) => ({ ...prev, address: { ...prev.address, line1: e.target.value } })) }/>
              <br />
              <input className='bg-gray-300 p-2 rounded font-bold max-w-52' type='text' value={userData.address.line2} onChange={ (e) => setUserData( (prev) => ({ ...prev, address: { ...prev.address, line2: e.target.value } })) }/>
            </p>
            :
            <p className='text-gray-500 text-md font-semibold' >
              {userData.address.line1} 
              <br />
              {userData.address.line2}
            </p>
          }


        </div>
      </div>

      <div>
        <p className='text-neutral-500 underline mt-3' > BASIC INFORMATION </p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-3 mt-3 text-neutral-700'>


          <p className='font-medium' > Gender: </p>
          {
            isEdit 
            ?
            <select className='max-w-40 bg-gray-300 p-2 rounded font-bold ' onChange={ (e) => setUserData( (prev) => ({ ...prev, gender: e.target.value}) ) }  value={userData.gender}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            :
            <p className='text-gray-600 font-bold text-md'> {userData.gender} </p>
          }


          <p className='font-medium' > Date Of Birth : </p>
          {
            isEdit 
            ?
            <input className='max-w-28 p-2 rounded bg-gray-300 font-bold' type='date' value={userData.dob} onChange={ (e) => setUserData( (prev) => ({ ...prev, dob: e.target.value }) ) } />
            :
            <p className='text-gray-600 font-bold text-md'> {userData.dob} </p>
          }


        </div>
      </div>

      <div className='mt-10'>
        {
          isEdit 
          ?
          <Button variant='destructive' onClick={ updateUserProfileData } > Save Information </Button>
          :
          <Button  onClick={ () => setIsEdit(true) } > Edit   </Button>
          
        }
      </div>

      



    </div>
  )
}

export default MyProfile