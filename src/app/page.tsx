'use client';
import { FiArrowUpRight } from 'react-icons/fi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
export default function Page (){
  const router = useRouter();
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    router.push('/options');
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
        <div className="w-1/2 mx-40">
          <h1 className="text-white text-4xl font-bold mb-6 text-center w-1/2">
            Questionnaire
          </h1>
          <div className="bg-pink-300 p-6 rounded-lg text-black mb-6">
            <h2 className="text-lg font-semibold">Welcome!</h2>
            <p className="text-sm mt-2">
              We&apos;re excited to hear your thoughts, ideas, and insights. Don’t
              worry about right or wrong answers—just speak from the heart. Your
              genuine feedback is invaluable to us!
            </p>
          </div>
          <form className="space-y-4">
            <label className="block text-sm text-white" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter email address"
              className="w-full px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-800"
            />
            <button
              onClick={handleSubmit}
              type="submit"
              className="flex flex-row justify-between px-10 w-full py-2 mt-4 bg-lime-500 text-black font-semibold rounded-full hover:bg-lime-600 transition-colors"
            >
              <span className="py-1">Start Survey</span>
              <FiArrowUpRight className="w-8 h-8" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};