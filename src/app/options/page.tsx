'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowUpRight, FiArrowUpLeft } from "react-icons/fi";
import Image from 'next/image';
import { useAppContext } from '@/context';
import { supabase } from '../lib/supabase';

// Type for the options, either 'Nike Orange', 'Nike Black', or null (no selection)
type OptionType = 'Nike Orange' | 'Nike Black' | null;

export default function Page() {
    const { email } = useAppContext(); // Access email from context
    const [selectedOption, setSelectedOption] = useState<OptionType>(null); // State to manage selected option
    const router = useRouter(); // Router for navigation between pages

    useEffect(() => {
        // Redirect to '/' if email is null, empty, or undefined
        if (!email) {
            router.push('/'); // Redirect user if no email is found
            return;
        }

        // Fetch the user's survey progress from Supabase
        const fetchUserData = async () => {
            try {
                // Fetch the progress data from Supabase for the current email
                const { data, error } = await supabase
                    .from('survey_progress')
                    .select('progress')
                    .eq('email', email) // Filter by email
                    .single(); // Fetch a single record for the user

                if (error) console.error("Error fetching data:", error.message);
                if (data?.progress?.step1) setSelectedOption(data.progress.step1); // Set the selected option based on stored progress
            } catch (error) {
                console.error("Unexpected error fetching data:", error);
            }
        };

        fetchUserData(); // Call the function to fetch data when the component is mounted
    }, [email, router]); // Dependencies: rerun this effect if `email` or `router` changes

    // Handle selection of an option (either Nike Orange or Nike Black)
    const handleSelect = (option: OptionType) => {
        setSelectedOption(option); // Update the selected option in state
    };

    // Handle the "Next" button click to save the selected option and progress
    const handleNext = async () => {
        if (!selectedOption) {
            console.log("Please select an option before proceeding."); // Log if no option is selected
            return;
        }

        try {
            // Upsert the survey progress in Supabase: either update or insert new data
            const { error } = await supabase
                .from('survey_progress')
                .upsert({
                    email, // The user's email
                    progress: { step1: selectedOption }, // Save the selected option as step1 in progress
                    status: 'in-progress', // Set the status to in-progress
                    step: 1 // Current step in the survey
                }, { onConflict: 'email' }); // Ensure email is unique, don't create duplicates

            if (error) {
                console.error("Error saving data:", error.message); // Handle any errors while saving data
                return;
            }

            console.log("Saved selected option:", selectedOption); // Log the saved selection
            router.push('/survey'); // Navigate to the next survey page after successful save
        } catch (error) {
            console.error("Unexpected error saving data:", error); // Catch any unexpected errors
        }
    };

    // Handle the "Back" button click, redirect to the home page
    const handleBack = () => {
        router.push('/'); // Navigate back to the home page
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-800">
            <div className="p-8 rounded-lg shadow-lg text-center text-white max-w-lg">
                {email && <p className="text-sm text-gray-400 mb-4">Logged in as: {email}</p>} {/* Show email if logged in */}
                <p className="uppercase tracking-wide text-sm font-semibold text-gray-400 mb-2">Question 1</p>
                <h2 className="text-2xl font-bold mb-6">What is your preferred choice?</h2>
                
                {/* Option selection section */}
                <div className="flex justify-center gap-8 mb-6">
                    {/* Nike Orange option */}
                    <div 
                        className={`p-4 rounded-lg ${selectedOption === 'Nike Orange' ? 'bg-gray-700 border border-green-500' : 'bg-gray-600'} cursor-pointer`} 
                        onClick={() => handleSelect('Nike Orange')} // Handle selection of Nike Orange
                    >
                        <p className="mt-2">Nike Orange</p>
                        <Image 
                            src="/assets/NikeOrange.png" 
                            alt="NikeOrange" 
                            width={128}
                            height={128}
                            className="mx-auto" 
                        />
                    </div>
                    
                    {/* Nike Black option */}
                    <div 
                        className={`p-4 rounded-lg ${selectedOption === 'Nike Black' ? 'bg-gray-700 border border-green-500' : 'bg-gray-600'} cursor-pointer`} 
                        onClick={() => handleSelect('Nike Black')} // Handle selection of Nike Black
                    >
                        <p className="mt-2">Nike Black</p>
                        <Image 
                            src="/assets/NikeBlack.png" 
                            alt="NikeBlack" 
                            width={128}
                            height={128}
                            className="mx-auto" 
                        />
                    </div>
                </div>
                
                {/* Display message if no option is selected */}
                {selectedOption === null && <p className="text-red-500 mb-4">Please select one</p>}
                
                {/* Button section */}
                <div className="flex justify-between mt-4">
                    {/* Back button */}
                    <button 
                        className="bg-pink-500 text-white py-2 px-6 rounded-full flex flex-row items-center hover:bg-pink-600 transition"
                        onClick={handleBack} // Trigger navigation to home page
                    >
                        <FiArrowUpLeft size={24} color="black" />
                        <span>Back</span>
                    </button>
                    
                    {/* Next button */}
                    <button 
                        className={`py-2 px-6 rounded-full flex flex-row items-center ${selectedOption ? 'bg-lime-500 text-gray-900 hover:bg-lime-600' : 'bg-gray-500 cursor-not-allowed'}`}
                        onClick={handleNext} // Trigger navigation to next survey page
                        disabled={!selectedOption} // Disable button if no option is selected
                    >
                        <span>Next</span>
                        <FiArrowUpRight size={24} color="black" />
                    </button>
                </div>
            </div>
        </div>
    );
}
