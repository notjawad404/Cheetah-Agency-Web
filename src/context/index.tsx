'use client';
import { createContext, useContext, useState } from 'react';

type AppContextType = {
    email: string;  
    setEmail: React.Dispatch<React.SetStateAction<string>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppWrapper({ children }: { children: React.ReactNode }) {
    const [email, setEmail] = useState('');  // Local state to store the email.

    return (
        <AppContext.Provider value={{ email, setEmail }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error('useAppContext must be used within an AppWrapper');
    }

    return context;
}
