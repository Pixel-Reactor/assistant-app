import React, { FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

interface AppProps {

}

interface AppContextDataType {
    
}

export const AppContext = React.createContext<AppContextDataType>({
    
})

export const useAppContext = () => {
    return useContext(AppContext)
}

const AppProvider: FC<AppProps> = ({ children }) => {


    useEffect(() => {


    }, [])


    const value = useMemo(
        () => ({  }),
        []
    )
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider