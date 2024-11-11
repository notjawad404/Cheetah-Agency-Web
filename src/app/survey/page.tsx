"use client";
import { useEffect, useState } from "react";
import { FiArrowUpRight, FiArrowUpLeft } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context'; // Import context for email management
import { supabase } from '../lib/supabase'; // Import Supabase client to interact with the database

export default function Page() {
  const { email } = useAppContext(); // Retrieve email from the app context (global state)
  const [comfort, setComfort] = useState<number | null>(null); // State for storing comfort rating
  const [looks, setLooks] = useState<number | null>(null); // State for storing looks rating
  const [price, setPrice] = useState<number | null>(null); // State for storing price rating
  const [step1Data, setStep1Data] = useState<boolean | null>(null); // State to track if step1 is completed
  const router = useRouter(); // Use Next.js router to handle navigation

  useEffect(() => {
    // If there's no email (user is not logged in), redirect to the homepage
    if (!email) {
      router.push('/');
      return;
    }

    const fetchProgress = async () => {
      try {
        // Fetch the survey progress data from Supabase using the email
        const { data, error } = await supabase
          .from('survey_progress')
          .select('progress')
          .eq('email', email)
          .single(); // Fetch a single record for the email

        if (error) throw error; // Handle any errors from the Supabase query

        // If Step 1 is completed, set the step1Data state to true
        if (data?.progress?.step1) {
          setStep1Data(data.progress.step1);
        } else {
          // If Step 1 isn't completed, redirect to the options page
          router.push('/options');
          return;
        }

        // If Step 2 data exists, populate the ratings with the saved values
        if (data?.progress?.step2) {
          setComfort(data.progress.step2.comfort);
          setLooks(data.progress.step2.looks);
          setPrice(data.progress.step2.price);
        }
      } catch (error) {
        console.error("Error fetching progress:", error); // Log errors if the fetch fails
      }
    };

    fetchProgress(); // Call the function to fetch user progress
  }, [email, router]); // Dependency array: runs when email or router changes

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent page reload on form submission

    // Check if all rating values are selected before proceeding
    if (comfort && looks && price) {
      try {
        // Upsert the user's progress into the database (either insert or update)
        const { error } = await supabase
          .from('survey_progress')
          .upsert(
            {
              email, // User's email
              progress: {
                step1: step1Data, // Include step1 completion status
                step2: { comfort, looks, price }, // Include Step 2 ratings
              },
              status: 'completed', // Mark status as completed for Step 2
              step: 3 // Proceed to Step 3 after Step 2 completion
            },
            { onConflict: 'email' } // Ensure no duplicate records for the same email
          );

        if (error) {
          console.error("Error saving data:", error.message); // Log if an error occurs during save
          return;
        }

        console.log("Step 2 data saved:", { comfort, looks, price }); // Log the saved data
        router.push('/thanks'); // Redirect to the "Thank You" page after successful submission
      } catch (error) {
        console.error("Unexpected error saving data:", error); // Catch any unexpected errors
      }
    } else {
      // Show an error message if the user hasn't selected values for all ratings
      console.log("Please select values for all options.");
    }
  };

  // Handle the back button click to navigate to the options page
  const handleBack = () => {
    router.push('/options');
  };

  // Render rating buttons (stars or circles) for each rating (comfort, looks, price)
  const renderRatingButtons = (
    selectedValue: number | null,
    setValue: (value: number) => void
  ) => {
    return (
      <div className="flex items-center space-x-2">
        {/* Generate 5 buttons for ratings 1-5 */}
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setValue(value)} // Set the rating when clicked
            className={`h-8 w-8 rounded-full ${
              selectedValue && value <= selectedValue
                ? "bg-white" // Highlight selected buttons
                : "bg-gray-600" // Default button color for unselected
            }`}
          ></button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit} // Submit the form on button click
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center text-white"
      >
        <h2 className="text-lg font-bold mb-4">
          How important are these aspects for you?
        </h2>

        {/* Comfort rating */}
        <div className="mb-6 flex items-center justify-between">
          <label className="w-24 text-left">Comfort</label>
          {renderRatingButtons(comfort, setComfort)} {/* Render buttons for comfort rating */}
        </div>
        {!comfort && (
          <p className="text-red-500 text-sm mb-4">Please select a score</p> // Error message if no comfort rating is selected
        )}

        {/* Looks rating */}
        <div className="mb-6 flex items-center justify-between">
          <label className="w-24 text-left">Looks</label>
          {renderRatingButtons(looks, setLooks)} {/* Render buttons for looks rating */}
        </div>
        {!looks && (
          <p className="text-red-500 text-sm mb-4">Please select a score</p> // Error message if no looks rating is selected
        )}

        {/* Price rating */}
        <div className="mb-6 flex items-center justify-between">
          <label className="w-24 text-left">Price</label>
          {renderRatingButtons(price, setPrice)} {/* Render buttons for price rating */}
        </div>
        {!price && (
          <p className="text-red-500 text-sm mb-4">Please select a score</p> // Error message if no price rating is selected
        )}

        {/* Buttons */}
        <div className="flex justify-between">
          {/* Back button */}
          <button
            type="button"
            onClick={handleBack} // Navigate to options page on click
            className="bg-pink-300 flex flex-row px-4 py-2 rounded-xl text-white hover:bg-pink-500"
          >
            <FiArrowUpLeft size={24} color="black" />
            <span>Back</span>
          </button>

          {/* Submit button */}
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
