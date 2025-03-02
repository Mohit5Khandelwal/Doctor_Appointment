import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";


export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    // check if aToken is stored in the local storage then use it 
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '' );
    const [doctors, setDoctors] = useState([]);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const getAllDoctors = async () => {

        try
        {
            const { data } = await axios.get( backendUrl + '/api/admin/all-doctors', { headers: {aToken} } )

            if( data.success )
            {
                setDoctors(data.doctors)
                console.log( data.doctors);
                toast.success( 'Doctors Data fetched successfully', {
                    position: "top-center"
                } )
            }
            else 
            {
                toast.error( data.message )
            }
        }
        catch (error)
        {
            console.log( error )
            toast.error( error.message )
        }

    }

    // Calling this Doctors fetch function on All Doctors page

    const value = {
        aToken,
        setAToken,
        backendUrl,
        getAllDoctors,
        doctors

    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;

// Here we can access value object to any component where 
// use this AppContext 