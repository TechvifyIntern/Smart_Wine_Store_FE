"use client";

import { useState, useEffect } from "react";
import { Wine } from "lucide-react";

export default function AgeVerificationModal() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user has already confirmed age (persistent across sessions)
    const ageConfirmed = localStorage.getItem("ageVerified");
    if (ageConfirmed === "true") {
      setIsVisible(false);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem("ageVerified", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Redirect to google.com
    window.location.href = "https://google.com";
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative max-w-lg w-full mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with wine theme */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Wine className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Wine Store</h1>
          <h1 className="text-3xl font-bold mb-2">Age Verification</h1>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-6">
            <p className="text-gray-600 text-lg">
              To access our wine collection, you must confirm you are 18 years
              or older.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col space-y-4 mb-6">
            <button
              onClick={handleConfirm}
              className="bg-black hover:bg-gray-800 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Wine className="w-5 h-5" />
              <span>I am 18 years or older</span>
            </button>
            <button
              onClick={handleDecline}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-medium transition-all duration-200 border-2 border-gray-300 hover:border-gray-400"
            >
              I am under 18
            </button>
          </div>

          {/* Legal notice */}
          <div className="text-xs text-gray-500 leading-relaxed">
            <div className="font-semibold text-gray-700 mb-2 text-center">
              ⚠️ Important Notice
            </div>
            <ul className="space-y-1 text-justify">
              <li>
                • Our wine products are intended only for individuals aged 18
                years and older
              </li>
              <li>• We are responsible for verifying age upon delivery</li>
              <li>
                • Recipients must prove they are 18 or older when age is in
                question
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
