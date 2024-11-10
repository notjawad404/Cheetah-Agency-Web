'use client';
import { FiArrowUpRight, FiArrowUpLeft } from "react-icons/fi";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
export default function Page (){
  const router = useRouter();
  const handleBacktoHome = (event: React.FormEvent) => {
    event.preventDefault();
    router.push('/');
  };

  const handleBack = () => {
    router.push('/survey');
  };
  return (
    <div className="h-screen bg-gradient-to-r from-gray-600 to-black flex items-center justify-center p-6">
      <div className="flex flex-row rounded-lg p-8 w-full">
        <div className="w-1/2 flex flex-col justify-center items-center">
          <Image
            src="/assets/Union.png"
            alt="Union"
            width={192}
            height={192}
            className="object-cover mb-40"
          />
          <Image
            src="/assets/shoe1.png"
            alt="Shoe"
            width={240} 
            height={240} 
            className="object-cover z-20 absolute mb-2"
          />
          <Image
            src="/assets/Ellipse.png"
            alt="Ellipse"
            width={192}
            height={20}
            className="object-cover"
          />
        </div>
        <div className="w-1/2 mx-40 my-auto">
        <div className="w-1/2">
        <h1 className="text-white text-4xl font-bold mb-6 text-center w-1/2">
            Questionnaire
          </h1>
          <p className="flex justify-end">for your feedback</p>
        </div>

          <div className="flex space-x-2 mt-10">
          <button
            type="button"
            onClick={handleBack}
            className="bg-pink-300 flex flex-row px-4 py-2  rounded-xl text-white hover:bg-pink-500"
          >

            <FiArrowUpLeft size={24} color="black" />
            <span>Back</span>
          </button>
          <button
            type="submit"
            onClick={handleBacktoHome}
            className="bg-white flex flex-row text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-200"
          >
            <span>Back to Home</span>
            <FiArrowUpRight size={24} color="black" />
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};