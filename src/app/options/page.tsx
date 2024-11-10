'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowUpRight, FiArrowUpLeft } from "react-icons/fi";
import Image from 'next/image';
import { useAppContext } from '@/context'; // Assumes email context is here
import { supabase } from '../lib/supabase';

type OptionType = 'Nike Orange' | 'Nike Black' | null;

export default function Page() {
    const { email } = useAppContext(); // Access email from context
    const [selectedOption, setSelectedOption] = useState<OptionType>(null);
    const router = useRouter();

    useEffect(() => {
        // Redirect to '/' if email is null, empty, or undefined
        if (!email) {
            router.push('/');
            return;
        }

        const fetchUserData = async () => {
            try {
                const { data, error } = await supabase
                    .from('survey_progress')
                    .select('progress')
                    .eq('email', email)
                    .single();

                if (error) console.error("Error fetching data:", error.message);
                if (data?.progress?.step1) setSelectedOption(data.progress.step1);
            } catch (error) {
                console.error("Unexpected error fetching data:", error);
            }
        };

        fetchUserData();
    }, [email, router]);

    const handleSelect = (option: OptionType) => {
        setSelectedOption(option);
    };

    const handleNext = async () => {
        if (!selectedOption) {
            console.log("Please select an option before proceeding.");
            return;
        }

        try {
            const { error } = await supabase
                .from('survey_progress')
                .upsert({
                    email,
                    progress: { step1: selectedOption },
                    status: 'in-progress',
                    step: 1
                }, { onConflict: 'email' });

            if (error) {
                console.error("Error saving data:", error.message);
                return;
            }

            console.log("Saved selected option:", selectedOption);
            router.push('/survey'); // Navigate to the next page if successful
        } catch (error) {
            console.error("Unexpected error saving data:", error);
        }
    };

    const handleBack = () => {
        router.push('/');
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-800">
            <div className="p-8 rounded-lg shadow-lg text-center text-white max-w-lg">
                {email && <p className="text-sm text-gray-400 mb-4">Logged in as: {email}</p>}
                <p className="uppercase tracking-wide text-sm font-semibold text-gray-400 mb-2">Question 1</p>
                <h2 className="text-2xl font-bold mb-6">What is your preferred choice?</h2>
                
                <div className="flex justify-center gap-8 mb-6">
                    <div 
                        className={`p-4 rounded-lg ${selectedOption === 'Nike Orange' ? 'bg-gray-700 border border-green-500' : 'bg-gray-800'} cursor-pointer`} 
                        onClick={() => handleSelect('Nike Orange')}
                    >
                        <p className="mt-2">Nike Orange</p>
                        <Image 
                            src="/assets/NikeOrange.png" 
                            alt="Nike Orange" 
                            width={128}
                            height={128}
                            className="mx-auto" 
                        />
                    </div>
                    
                    <div 
                        className={`p-4 rounded-lg ${selectedOption === 'Nike Black' ? 'bg-gray-700 border border-green-500' : 'bg-gray-800'} cursor-pointer`} 
                        onClick={() => handleSelect('Nike Black')}
                    >
                        <p className="mt-2">Nike Black</p>
                        <Image 
                            src="/assets/NikeBlack.png" 
                            alt="Nike Black" 
                            width={128}
                            height={128}
                            className="mx-auto" 
                        />
                    </div>
                </div>
                
                {selectedOption === null && <p className="text-red-500 mb-4">Please select one</p>}
                
                <div className="flex justify-between mt-4">
                    <button 
                        className="bg-pink-500 text-white py-2 px-6 rounded-full flex flex-row items-center hover:bg-pink-600 transition"
                        onClick={handleBack}
                    >
                        <FiArrowUpLeft size={24} color="black" />
                        <span>Back</span>
                    </button>
                    <button 
                        className={`py-2 px-6 rounded-full flex flex-row items-center ${selectedOption ? 'bg-lime-500 text-gray-900 hover:bg-lime-600' : 'bg-gray-500 cursor-not-allowed'}`}
                        onClick={handleNext}
                        disabled={!selectedOption}
                    >
                        <span>Next</span>
                        <FiArrowUpRight size={24} color="black" />
                    </button>
                </div>
            </div>
        </div>
    );
}
