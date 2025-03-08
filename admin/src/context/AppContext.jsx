import { createContext } from "react";


export const AppContext = createContext();

const AppContextProvider = (props) => {

    const calculateAge = (dob) => {

        const today = new Date()
        const birthDate = new Date(dob)

        let age = today.getFullYear() - birthDate.getFullYear()
        return age
    }

    const months = [ "", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    const slotDateFormat = (slotdate) => {
        const dateArray = slotdate.split('_')
        return dateArray[0] + ' ' + months[ Number( dateArray[1])] + ' ' + dateArray[2] 
    }

    const value = {

        calculateAge,
        slotDateFormat 

    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;

// Here we can access value object to any component where 
// use this AppContext 