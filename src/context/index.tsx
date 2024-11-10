'use client';
import { createContext, useContext, useState } from 'react';

type AppContextType = {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
};

// Provide a default empty context to avoid the error
const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppWrapper({ children }: { children: React.ReactNode }) {
    const [email, setEmail] = useState('');

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
