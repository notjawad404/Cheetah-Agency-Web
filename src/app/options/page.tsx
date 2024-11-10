'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowUpRight, FiArrowUpLeft } from "react-icons/fi";
import Image from 'next/image'; // Import the Image component from Next.js

export default function Page() {
    const [selectedOption, setSelectedOption] = useState<OptionType>(null);
    const router = useRouter();

    type OptionType = 'Nike Orange' | 'Nike Black' | null;

    const handleSelect = (option: OptionType) => {
        setSelectedOption(option);
    };

    const handleNext = () => {
        if (selectedOption) {
            // Navigate to the next question
            console.log("Selected option:", selectedOption);
            router.push('/survey');
        }
    };

    const handleBack = () => {
        router.push('/');
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-800">
            <div className="p-8 rounded-lg shadow-lg text-center text-white max-w-lg">
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
                            width={128} // Set width
                            height={128} // Set height
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
                            width={128} // Set width
                            height={128} // Set height
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
