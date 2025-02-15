import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets_frontend/assets';
import RelatedDoctors from '../components/RelatedDoctors';


const Appointments = () => {

  const { docId } = useParams();
const { doctors, currentSymbol } = useContext(AppContext);
const [docInfo, setDocInfo] = useState(null);
const [docSlots, setDocSlots] = useState([]);
const [slotIndex, setSlotIndex] = useState(0);
const [slotTime, setSlotTime] = useState('');
const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const fetchDocInfo = async() => {
    const docInfo = doctors.find((item) => item._id === docId);
    setDocInfo(docInfo || null);
  };

// Function to get available slots
  const getAvailableSlots = async() => {
    if (!docInfo) return; // Prevent execution if docInfo is null

    let today = new Date();
    let allSlots = []; // Create a new array instead of mutating state

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      if (timeSlots.length > 0) { // Only add if slots are available
        allSlots.push(timeSlots);
      }

    }

    setDocSlots(allSlots); // Set the new array instead of appending to previous state
  };

  // First useEffect to fetch doctor info
  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  // Second useEffect to get available slots
  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]); // Only runs when docInfo changes

  useEffect( () => {
    console.log( docSlots );
  }, [docSlots]);





  return docInfo && (

    <div>

      {/* --------------- Doctors Details -------- */}

      <div className='flex flex-col sm:flex-row gap-4'>

        <div >
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt='' />
        </div>

      

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/* ------- Doc Info : name, degree */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt='' />
          </p>

          <div className='flex items-center text-sm mt-1 text-gray-600'>
            <p> {docInfo.degree} - {docInfo.speciality} </p>
            <p className='py-0.5 px-2 border text-xs rounded-full ml-4' > {docInfo.experience} </p>
          </div>

          {/* ------- Doctors About ------ */}
          <div >
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-4'> About <img src={assets.info_icon} /> </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1' > {docInfo.about} </p>
          </div>

          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee:  <span className='text-gray-800'> {currentSymbol} {docInfo.fees} </span>
          </p>

        </div>
      </div>

      {/* ----- Booking Slots ------- */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>
          Booking slots 
        </p>

        <div className='flex gap-5 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots?.length && docSlots.map( (item, index) => (
              <div onClick={ () => { setSlotIndex(index)}} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${ slotIndex === index ? 'bg-primary text-white border-black' : 'border border-gray-700'} `} key={index}>
                <p> { item[0] && daysOfWeek[ item[0].datetime.getDay() ] } </p>
                <p> { item[0] && item[0].datetime.getDate() } </p>
                
              </div>
            ))
          }
        </div>

      

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-10'>
          {
            docSlots.length && docSlots[slotIndex]?.map( (item, index) => (
              <div  key={index}>
                <p className={`text-sm font-light flex-shrink-2 px-10 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'border border-gray-700'}`} onClick={ () => { setSlotTime(item.time) } }>
                  { item.time.toLowerCase() } 
                </p>
              </div>
            ))
          }

        </div>
          <button className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'> Book an appointment </button>
        </div>

        {/* Listing Related Doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />

      


     
      
    </div>
  )
}

export default Appointments
