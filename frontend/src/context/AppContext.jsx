import React, { createContext } from 'react'
import { doctors } from '../assets/assets_frontend/assets'

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currentSymbol = '₹';

    const value = {

        doctors, currentSymbol
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider