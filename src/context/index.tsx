'use client';
import { createContext, useContext, useState } from 'react';

// Define the type for the context's value, which includes the email and a setter function.
type AppContextType = {
    email: string;  // The current email stored in the context.
    setEmail: React.Dispatch<React.SetStateAction<string>>;  // The function to update the email state.
};

// Create a context with a default value of `undefined`, so we can handle errors when context is used outside the provider.
const AppContext = createContext<AppContextType | undefined>(undefined);

// The provider component that wraps the app and makes the context available to its children.
export function AppWrapper({ children }: { children: React.ReactNode }) {
    const [email, setEmail] = useState('');  // Local state to store the email.

    return (
        // The context provider supplies the email and setEmail function to all components inside the provider.
        <AppContext.Provider value={{ email, setEmail }}>
            {children}
        </AppContext.Provider>
    );
}

// Custom hook to access the context's values.
export function useAppContext() {
    const context = useContext(AppContext);

    // If the context is `undefined`, it means the hook is used outside the provider, so throw an error.
    if (!context) {
        throw new Error('useAppContext must be used within an AppWrapper');
    }

    // Return the context value (email and setEmail) if it's valid.
    return context;
}
