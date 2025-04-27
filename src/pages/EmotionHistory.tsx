// src/pages/EmotionHistory.tsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { FaTwitter, FaFacebook, FaWhatsapp } from "react-icons/fa";

interface EmotionEntry {
  mood: string;
  date: string;
}

const EmotionHistory: React.FC = () => {
  const [history, setHistory] = useState<EmotionEntry[]>([]);
  const [shareLinks, setShareLinks] = useState<{
    twitter?: string;
    facebook?: string;
    whatsapp?: string;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/history", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((error) => console.error("Error fetching history:", error));
  }, []);

  const shareMood = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/share_mood", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setShareLinks(data))
      .catch((error) => console.error("Error fetching share links:", error));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      {/* Navbar at the top */}
      <Navbar />

      <div className="container mx-auto p-6 pt-20">
        <h2 className="text-2xl font-bold mb-6 text-center">Emotion History</h2>

        {history.length === 0 ? (
          <p className="text-gray-400 text-center">No emotion history found.</p>
        ) : (
          <div className="bg-black/30 p-6 rounded-xl backdrop-blur-sm max-w-lg mx-auto">
            <ul className="space-y-3">
              {history.map((item, idx) => (
                <li
                  key={idx}
                  className="p-3 bg-gray-800 rounded-lg text-center text-white shadow-md"
                >
                  <span className="font-semibold text-lg">
                    {item.mood.charAt(0).toUpperCase() + item.mood.slice(1)}
                  </span>{" "}
                  -{" "}
                  <span className="text-gray-300">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={shareMood}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow-lg transition duration-300"
          >
            Share Latest Mood
          </button>
        </div>

        {shareLinks && (
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold mb-3">Share on:</p>
            <div className="flex justify-center space-x-6">
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 text-lg font-semibold transition duration-300 shadow-md"
              >
                <FaTwitter size={20} /> <span>Twitter</span>
              </a>
              <span className="text-gray-400">|</span>
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-500 hover:text-blue-300 text-lg font-semibold transition duration-300 shadow-md"
              >
                <FaFacebook size={20} /> <span>Facebook</span>
              </a>
              <span className="text-gray-400">|</span>
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-green-400 hover:text-green-300 text-lg font-semibold transition duration-300 shadow-md"
              >
                <FaWhatsapp size={20} /> <span>WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionHistory;
