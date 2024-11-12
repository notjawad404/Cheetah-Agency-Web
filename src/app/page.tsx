'use client';
import { FiArrowUpRight } from 'react-icons/fi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from './lib/supabase';
import { useAppContext } from '@/context';

const Page = () => {
  // Router hook to manage navigation
  const router = useRouter();
  
  // Context hook to set email in the global context
  const { setEmail: setContextEmail } = useAppContext();

  // Local state to manage email input
  const [emailState, setEmail] = useState('');

  // Form submit handler
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Set the email in the global context
    setContextEmail(emailState);
  
    // Check if the email exists in Supabase database
    const { data, error } = await supabase
      .from('survey_progress')
      .select('*')
      .eq('email', emailState)
      .single();
  
    if (error && error.code === 'PGRST116') {
      const { error: insertError } = await supabase
        .from('survey_progress')
        .insert([{ email: emailState, progress: {}, status: 'in-progress', step: 1 }]);
  
      if (insertError) {
        console.error('Error inserting new email: ', insertError.message);
        return;
      }
  
      router.push('/options');
    } else if (data) {
      const { status, progress } = data;
      console.log("Status",status);
      console.log("Progress",progress);
      if (status === 'completed') {
                router.push('/thanks');
      } else if (status === 'in-progress') {
        if (!progress.step1) {
          router.push('/options');
        } else if (!progress.step2) {
          router.push('/survey');
        } else {
                  router.push('/thanks');
        }
      }
    }
  };

  return (
    <div className="h-screen bg-gradient-to-r from-gray-600 to-black flex items-center justify-center p-6">
  <div className="absolute inset-0 flex flex-col lg:flex-row rounded-lg p-8 w-full lg:w-1/2">
    <div className="w-full lg:w-1/2 flex justify-center items-center flex-col mx-auto">
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
        className="object-cover z-0 lg:z-20 absolute mb-2"
      />
      <Image
        src="/assets/Ellipse.png"
        alt="Ellipse"
        width={192}
        height={20}
        className="object-cover"
      />
    </div>
  </div>

  <div className="relative z-10 lg:z-0 w-full lg:w-80 lg:ml-96">
    <h1 className="text-white text-4xl font-bold mb-6 text-center w-full lg:w-1/2">
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
    
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm text-white" htmlFor="email">
        Email
      </label>
      <input
        type="email"
        id="email"
        placeholder="Enter email address"
        className="w-full px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-800"
        value={emailState}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        type="submit"
        className="flex flex-row justify-between px-10 w-full py-2 mt-4 bg-lime-500 text-black font-semibold rounded-full hover:bg-lime-600 transition-colors"
      >
        <span className="py-1">Start Survey</span>
        <FiArrowUpRight className="w-8 h-8" />
      </button>
    </form>
  </div>
</div>

  );
}

export default Page;
