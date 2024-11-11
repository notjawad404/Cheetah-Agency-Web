"use client";
import { FiArrowUpRight, FiArrowUpLeft } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "@/context";
import { supabase } from "../lib/supabase";
import axios from "axios";

export default function Page() {
  const { email } = useAppContext(); // Fetching email from app context
  const router = useRouter(); // Router instance to navigate between pages

  // Check if the data is completed in Supabase and sync with MongoDB
  useEffect(() => {
    const checkAndSyncData = async () => {
      // If no email is available, redirect to the home page
      if (!email) {
        router.push("/"); // Redirecting user to home if no email found
        return;
      }

      try {
        // Fetch the user's survey data from the Supabase database
        const { data: surveyData, error } = await supabase
          .from("survey_progress") // Assuming this table stores all your survey data
          .select("email, progress, status") // Select only the email, progress, and status fields
          .eq("email", email) // Filtering by email
          .single(); // Ensuring we fetch a single row for the user

        // Handle any error while fetching the survey data
        if (error) {
          console.error("Error fetching Supabase data:", error);
          return;
        }

        // Ensure that we have both progress and status data before proceeding
        if (surveyData?.progress && surveyData?.status) {
          try {
            // Check if the data already exists in MongoDB using axios GET request
            const response = await axios.get(
              `https://cheetah-agnecy-survey-backend.vercel.app//api/survey/${email}`
            );
            const existingData = response.data;

            // If data exists in MongoDB, update it
            if (existingData) {
              await axios.put(
                `https://cheetah-agnecy-survey-backend.vercel.app//api/survey/${email}`,
                {
                  email,
                  progress: surveyData.progress,
                  status: surveyData.status,
                }
              );
            } else {
              // If data doesn't exist in MongoDB, post new data
              await axios.post("https://cheetah-agnecy-survey-backend.vercel.app//api/survey", {
                email,
                progress: surveyData.progress,
                status: surveyData.status,
              });
            }
          } catch (error) {
            console.error("Error posting/updating MongoDB data:", error);
          }
        } else {
          console.error("Survey data is incomplete"); // Log an error if survey data is incomplete
        }
      } catch (error) {
        console.error("Error in checking and syncing data:", error); // Log any errors during the overall sync process
      }
    };

    checkAndSyncData(); // Trigger the check and sync when the component is mounted
  }, [email, router]); // Dependencies: re-run if `email` or `router` changes

  // Handle "Back to Home" button click, redirecting the user to the homepage
  const handleBacktoHome = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior
    router.push("/"); // Redirect user to home
  };

  // Handle "Back" button click, redirecting the user to the survey page
  const handleBack = () => {
    router.push("/survey"); // Redirect user to the survey page
  };

  return (
    <div className="h-screen bg-gradient-to-r from-gray-600 to-black flex items-center justify-center p-6">
      {/* Left section with images (background) */}
      <div className="absolute inset-0 flex flex-col lg:flex-row rounded-lg p-8 w-full">
        <div className="w-full lg:w-1/2 flex justify-center items-center flex-col">
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
            className="object-cover z-0 absolute mb-2"
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

      {/* Right section with text and buttons */}
      <div className="relative z-10 w-full lg:w-1/2 mx-0 lg:mx-40 text-center">
        <div className="w-full lg:w-1/2 mx-auto">
          <h1 className="text-white text-4xl font-bold mb-6">
            Questionnaire
          </h1>
          <p className="text-white mb-10">for your feedback</p>

          <div className="flex justify-center space-x-4 mt-10">
            {/* Back button */}
            <button
              type="button"
              onClick={handleBack} // Trigger navigation to survey page
              className="bg-pink-300 flex flex-row px-6 py-2 rounded-xl text-black hover:bg-pink-500"
            >
              <FiArrowUpLeft size={24} />
              <span className="ml-2">Back</span>
            </button>

            {/* Back to Home button */}
            <button
              type="button"
              onClick={handleBacktoHome} // Trigger navigation to home page
              className="bg-white flex flex-row px-6 py-2 rounded-xl text-gray-800 hover:bg-gray-200"
            >
              <span className="mr-2">Back to Home</span>
              <FiArrowUpRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
