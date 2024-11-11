"use client";
import { useEffect, useState } from "react";
import { FiArrowUpRight, FiArrowUpLeft } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context';
import { supabase } from '../lib/supabase';

export default function Page() {
  const { email } = useAppContext();
  const [comfort, setComfort] = useState<number | null>(null);
  const [looks, setLooks] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [step1Data, setStep1Data] = useState<boolean | null>(null); // Store Step 1 completion status
  const router = useRouter();

  useEffect(() => {
    if (!email) {
      router.push('/');
      return;
    }

    const fetchProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('survey_progress')
          .select('progress')
          .eq('email', email)
          .single();

        if (error) throw error;

        // Check if Step 1 is completed
        if (data?.progress?.step1) {
          setStep1Data(data.progress.step1); // Store Step 1 data
        } else {
          router.push('/options'); // If Step 1 isn't completed, redirect to '/options'
          return;
        }

        // If Step 2 exists, populate the ratings
        if (data?.progress?.step2) {
          setComfort(data.progress.step2.comfort);
          setLooks(data.progress.step2.looks);
          setPrice(data.progress.step2.price);
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchProgress();
  }, [email, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (comfort && looks && price) {
      try {
        const { error } = await supabase
          .from('survey_progress')
          .upsert(
            {
              email,
              progress: {
                step1: step1Data,
                step2: { comfort, looks, price }, // Update Step 2 data
              },
              status: 'completed',
              step: 3
            },
            { onConflict: 'email' }
          );

        if (error) {
          console.error("Error saving data:", error.message);
          return;
        }

        console.log("Step 2 data saved:", { comfort, looks, price });
        router.push('/thanks');
      } catch (error) {
        console.error("Unexpected error saving data:", error);
      }
    } else {
      // Show an error message if all ratings are not selected
      console.log("Please select values for all options.");
    }
  };

  const handleBack = () => {
    router.push('/options');
  };

  const renderRatingButtons = (
    selectedValue: number | null,
    setValue: (value: number) => void
  ) => {
    return (
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setValue(value)}
            className={`h-8 w-8 rounded-full ${
              selectedValue && value <= selectedValue
                ? "bg-white"
                : "bg-gray-600"
            }`}
          ></button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center text-white"
      >
        <h2 className="text-lg font-bold mb-4">
          How important are these aspects for you?
        </h2>

        {/* Comfort rating */}
        <div className="mb-6 flex items-center justify-between">
          <label className="w-24 text-left">Comfort</label>
          {renderRatingButtons(comfort, setComfort)}
        </div>
        {!comfort && (
          <p className="text-red-500 text-sm mb-4">Please select a score</p>
        )}

        {/* Looks rating */}
        <div className="mb-6 flex items-center justify-between">
          <label className="w-24 text-left">Looks</label>
          {renderRatingButtons(looks, setLooks)}
        </div>
        {!looks && (
          <p className="text-red-500 text-sm mb-4">Please select a score</p>
        )}

        {/* Price rating */}
        <div className="mb-6 flex items-center justify-between">
          <label className="w-24 text-left">Price</label>
          {renderRatingButtons(price, setPrice)}
        </div>
        {!price && (
          <p className="text-red-500 text-sm mb-4">Please select a score</p>
        )}

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="bg-pink-300 flex flex-row px-4 py-2 rounded-xl text-white hover:bg-pink-500"
          >
            <FiArrowUpLeft size={24} color="black" />
            <span>Back</span>
          </button>
          <button
            type="submit"
            className="bg-white flex flex-row text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-200"
          >
            <span>Send</span>
            <FiArrowUpRight size={24} color="black" />
          </button>
        </div>
      </form>
    </div>
  );
}
