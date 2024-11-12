"use client";
import { useEffect, useState } from "react";
import { FiArrowUpRight, FiArrowUpLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context";
import { supabase } from "../lib/supabase";

export default function Page() {
  const { email } = useAppContext();
  const [comfort, setComfort] = useState<number | null>(null);
  const [looks, setLooks] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [step1Data, setStep1Data] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!email) {
      router.push("/");
      return;
    }

    const fetchProgress = async () => {
      try {
        const { data, error } = await supabase
          .from("survey_progress")
          .select("progress")
          .eq("email", email)
          .single();

        if (error) throw error;

        if (data?.progress?.step1) {
          setStep1Data(data.progress.step1);
        } else {
          router.push("/options");
          return;
        }

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
        const { error } = await supabase.from("survey_progress").upsert(
          {
            email,
            progress: {
              step1: step1Data,
              step2: { comfort, looks, price },
            },
            status: "completed",
            step: 3,
          },
          { onConflict: "email" }
        );

        if (error) {
          console.error("Error saving data:", error.message);
          return;
        }

        console.log("Step 2 data saved:", { comfort, looks, price });
        router.push("/thanks");
      } catch (error) {
        console.error("Unexpected error saving data:", error);
      }
    } else {
      console.log("Please select values for all options.");
    }
  };

  const handleBack = () => {
    router.push("/options");
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
            className={`h-4 w-4  rounded-full ${
              selectedValue && value <= selectedValue
                ? "bg-black"
                : "bg-gray-500"
            }`}
          ></button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-600 to-black">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center text-white"
      >
        <p className="uppercase tracking-wide text-sm font-semibold text-gray-400 mb-2">
          Question 2
        </p>
        <h2 className="text-lg font-bold mb-4">
          How important are these aspects for you?
        </h2>

        <div className="mb-6 bg-white rounded-3xl px-2 py-1 flex items-center justify-between">
          <label className="w-24 text-left font-semibold text-black">
            Comfort
          </label>
          {renderRatingButtons(comfort, setComfort)}
        </div>
        {!comfort && (
          <p className="text-red-500 text-sm mb-4">Please select a score</p>
        )}

        <div className="mb-6 bg-white rounded-3xl px-2  flex items-center justify-between">
          <label className="w-24 text-left font-semibold text-black">
            Looks
          </label>
          {renderRatingButtons(looks, setLooks)}
        </div>
        {!looks && (
          <p className="text-red-500 text-sm mb-4">Please select a score</p>
        )}

        <div className="mb-6 bg-white rounded-3xl px-2  flex items-center justify-between">
          <label className="w-24 text-left text-black font-semibold">
            Price
          </label>
          {renderRatingButtons(price, setPrice)}
        </div>
        {!price && (
          <p className="text-red-500 text-sm mb-4">Please select a score</p>
        )}

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
