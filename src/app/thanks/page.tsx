"use client";
import { FiArrowUpRight, FiArrowUpLeft } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "@/context";
import { supabase } from '../lib/supabase';
import axios from "axios";

export default function Page() {
  const { email } = useAppContext();
  const router = useRouter();

  // Check if the data is completed in Supabase and sync with MongoDB
  useEffect(() => {
    const checkAndSyncData = async () => {
      if (!email) {
        router.push('/');
        return;
      }

      try {
        // Fetch relevant data from the survey_progress table for the current user
        const { data: surveyData, error } = await supabase
          .from('survey_progress') // Assuming this table stores all your survey data
          .select('email, progress, status') // Select only the email, progress, and status fields
          .eq('email', email)
          .single(); // Fetch a single row for the user

        if (error) {
          console.error("Error fetching Supabase data:", error);
          return;
        }

        // Ensure that we have the necessary progress and status data
        if (surveyData?.progress && surveyData?.status) {
          try {
            // Check if the data already exists in MongoDB
            const response = await axios.get(`http://localhost:5005/api/survey/${email}`);
            const existingData = response.data;

            // If data exists, update it
            if (existingData) {
              await axios.put(`http://localhost:5005/api/survey/${email}`, {
                email,
                progress: surveyData.progress,
                status: surveyData.status,
              });
            } else {
              // If data doesn't exist, post new data to MongoDB
              await axios.post("http://localhost:5005/api/survey", {
                email,
                progress: surveyData.progress,
                status: surveyData.status,
              });
            }
          } catch (error) {
            console.error("Error posting/updating MongoDB data:", error);
          }
        } else {
          console.error("Survey data is incomplete");
        }
      } catch (error) {
        console.error("Error in checking and syncing data:", error);
      }
    };

    checkAndSyncData();
  }, [email, router]);

  const handleBacktoHome = (event: React.FormEvent) => {
    event.preventDefault();
    router.push("/");
  };

  const handleBack = () => {
    router.push("/survey");
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
}
