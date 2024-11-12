"use client";
import { FiArrowUpRight, FiArrowUpLeft } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "@/context";
import { supabase } from "../lib/supabase";
import axios from "axios";

export default function Page() {
  const { email } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    const checkAndSyncData = async () => {
      if (!email) {
        router.push("/");
        return;
      }
  
      console.log("Checking", email);
      try {
        const { data: surveyData, error } = await supabase
          .from("survey_progress")
          .select("email, progress, status")
          .eq("email", email)
          .single();
          console.log("Survey", surveyData);
        if (error) {
          console.error("Error fetching Supabase data:", error);
          return;
        }
  
        if (surveyData?.progress && surveyData?.status) {
          try {
            const email = surveyData?.email
            console.log("Syncing", email);
            const response = await axios.get(
              `https://cheetah-agnecy-survey-backend.vercel.app/api/survey/${email}`,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
            const existingData = response.data;
  
            const payload = {
              email,
              progress: {
                step1: surveyData.progress.step1,
                step2: {
                  comfort: surveyData.progress.step2.comfort,
                  looks: surveyData.progress.step2.looks,
                  price: surveyData.progress.step2.price,
                },
              },
              status: surveyData.status,
            };
  
            if (existingData) {
              await axios.put(
                `https://cheetah-agnecy-survey-backend.vercel.app/api/survey/${email}`,
                payload,
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              );
            } else {
              await axios.post(
                "https://cheetah-agnecy-survey-backend.vercel.app/api/survey",
                payload,
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              );
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
  

  const handleBacktoHome = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.push("/");
  };

  const handleBack = () => {
    router.push("/survey");
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

        <div className="flex justify-center space-x-4 mt-10">
          <button
            type="button"
            onClick={handleBack}
            className="bg-pink-300 flex flex-row px-6 py-2 rounded-xl text-black hover:bg-pink-500"
          >
            <FiArrowUpLeft size={24} />
            <span className="ml-2">Back</span>
          </button>

          <button
            type="button"
            onClick={handleBacktoHome}
            className="bg-white flex flex-row w-60 px-6 py-2 rounded-xl text-gray-800 hover:bg-gray-200"
          >
            <span className="mr-2">Back to Home</span>
            <FiArrowUpRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
