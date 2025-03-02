import { createContext } from "react";


export const AppContext = createContext();

const AppContextProvider = (props) => {

    const value = {


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