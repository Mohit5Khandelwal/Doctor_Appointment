import { createContext } from "react";


export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {

    const value = {


    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider;

// Here we can access value object to any component where 
// use this AppContext 