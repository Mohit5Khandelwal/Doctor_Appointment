import React, { useContext, useState } from "react";
import { assets } from "../../../../frontend/src/assets/assets_admin/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from  'axios'
import { BarLoader, BeatLoader, DotLoader } from "react-spinners";

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false);
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [speciality, setSpeciality] = useState('General Physician')
    const [about, setAbout] = useState('')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [loading, setLoading] = useState(false)

    const {  backendUrl, aToken } = useContext(AdminContext);

    const onSubmitHandler = async(event) => {

        event.preventDefault();

        // Calling an api 
        try
        {
            setLoading(true)


            if( !docImg )
            {
                return toast.error('Image Not Selected')
            }

            const formData = new FormData();

            formData.append( 'image', docImg)
            formData.append( 'name', name)
            formData.append( 'email', email)
            formData.append( 'password', password)
            formData.append( 'experience', experience)
            formData.append( 'fees', Number( fees) )
            formData.append( 'about', about)
            formData.append( 'degree', degree)
            formData.append( 'address', JSON.stringify( { line1: address1, line2: address2}) )
            formData.append( 'speciality', speciality)

            // console form data 
            formData.forEach( (value, key) => {
                console.log( `${key} : ${value}` )
            })

            // Calling API To save doctor data 
            const { data } = await axios.post( backendUrl + '/api/admin/add-doctor', formData, { headers: {aToken} })

            // Here header aToken T is captial but in backed atoken it is small 

            if( data.success )
            {
                toast.success( data.message)

                // reset the data 
                setDocImg(false)
                setName('')
                setEmail('')
                setPassword('')
                setFees('')
                setAbout('')
                setDegree('')
                setAddress1('')
                setAddress2('')

            }
            else 
            {
                toast.error( data.message)

            }

        }
        catch (error) 
        {
            console.error( error )
            toast.error( error.message )

        }
        finally 
        {
            setLoading(false)

        }




    }



  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">

       
      <p className="mb-3 text-lg font-medium"> Add Doctor </p>

    

      {/* Form to add doctor in our database */}
        <div className="bg-indigo-100 px-8 py-9 border rounded w-full max-w-5xl max-h-[80vh] overflow-y-scroll">

            
            
            <div className="flex items-center gap-4 mb-8 text-gray-700">
            <label htmlFor="doc-img">
                <img
                className="w-16 bg-gray-100 rounded-full cursor-pointer"
                src={ docImg ? URL.createObjectURL(docImg) : assets.upload_area }
                alt=""
                />
            </label>
            <input onChange={ (e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
            
                <p>
                    
                    Upload doctor <br /> picture
                </p>
            
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
            <div className="w-full lg:flex-1 flex flex-col gap-4">

                <div className="flex-1 flex flex-col gap-1">
                    <p> Doctor Name </p>
                    <input onChange={ (e) => setName(e.target.value)} value={name} className="border rounded px-3 py-2"  type="text" placeholder="Enter doctor name" required />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                <p> Doctor Email </p>
                <input onChange={ (e) => setEmail(e.target.value)} value={email} className="border rounded px-3 py-2" type="email" placeholder="Enter doctor email" required />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                <p> Doctor Password </p>
                <input onChange={ (e) => setPassword(e.target.value)} value={password} className="border rounded px-3 py-2" type="password" placeholder="Enter password" required />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                <p> Experience </p>
                <select onChange={ (e) => setExperience(e.target.value)} value={experience} className="border rounded px-3 py-2" name="" id="">
                    <option value="1 Year"> 1 Year </option>
                    <option value="2 Years"> 2 Years </option>
                    <option value="3 Years"> 3 Years </option>
                    <option value="4 Years"> 4 Years </option>
                    <option value="5 Years"> 5 Years </option>
                    <option value="6 Years"> 6 Years </option>
                    <option value="7 Years"> 7 Years </option>
                    <option value="8 Years"> 8 Years </option>
                    <option value="9 Years"> 9 Years </option>
                    <option value="10 Years"> 10 Years </option>
                </select>
                </div>

                <div className="flex-1 flex flex-col gap-1">
                <p> Fees </p>
                <input onChange={ (e) => setFees(e.target.value)} value={fees} className="border rounded px-3 py-2" type="number" placeholder="fees" required />
                </div>
            </div>

            <div className="w-full lg:flex-1 flex flex-col gap-4">
                <div className="flex-1 flex flex-col gap-1">
                    <p> Speciality </p>
                    <select onChange={ (e) => setSpeciality(e.target.value)} value={speciality} className="border rounded px-3 py-2" name="" id="">
                        <option value="Cardiology"> Cardiology </option>
                        <option value="Dentist"> Dentist </option>
                        <option value="Dermatology"> Dermatology </option>
                        <option value="ENT"> ENT </option>
                        <option value="General Physician"> General Physician </option>
                        <option value="Gynecology"> Gynecology </option>
                        <option value="Neurology"> Neurology </option>
                        <option value="Orthopedic"> Orthopedic </option>
                        <option value="Pediatrician"> Pediatrician </option>
                        <option value="Psychiatry"> Psychiatry </option>
                        <option value="Urology"> Urology </option>
                    </select>
                </div>

                <div className="flex-1 flex flex-col gap-1">
                <p> Education </p>
                <input onChange={ (e) => setDegree(e.target.value)} value={degree} className="border rounded px-3 py-2" type="text" placeholder="Education" required />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                <p> Address </p>
                <input onChange={ (e) => setAddress1(e.target.value)} value={address1} className="border rounded px-3 py-2" type="text" placeholder="address 1" required />
                <input onChange={ (e) => setAddress2(e.target.value) } value={address2} className="border rounded px-3 py-2" type="text" placeholder="address 2" required />
                </div>
            </div>
            </div>

            <div className="flex-1 flex flex-col gap-1">
                <p className="mt-4 mb-2" > About Doctor </p>
                <textarea onChange={ (e) => setAbout(e.target.value)} value={about} className="w-full px-4 py-6 pt-2 border rounded" placeholder="write about doctor" row={5} required />
            </div>

            {/* <DotLoader loading={loading} /> */}
            {
                loading && <BeatLoader loading={loading} className="mt-4"/>
            }
            
            {
                !loading &&  <button type="submit" className="bg-primary px-10 py-3 mt-4 text-white rounded-full" >
                                Add Doctor 
                            </button>
            }

           
        </div>
        </form>
    );
};

export default AddDoctor;
