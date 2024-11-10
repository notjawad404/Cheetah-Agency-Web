"use client";
import { useState } from "react";
import { FiArrowUpRight, FiArrowUpLeft } from "react-icons/fi";
import { useRouter } from 'next/navigation';

export default function Page () {
  const [comfort, setComfort] = useState<number | null>(null);
  const [looks, setLooks] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  const router = useRouter();
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Add form submission logic here

    console.log({ comfort, looks, price });
    router.push('/thanks');
  };

  const handleBack = () => {
    router.push('/options');
  };

  // Helper function to render rating buttons with cumulative selection
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
            onClick={handleSubmit}
            className="bg-white flex flex-row text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-200"
          >
            <span>Send</span>
            <FiArrowUpRight size={24} color="black" />
          </button>
        </div>
      </form>
    </div>
  );
};