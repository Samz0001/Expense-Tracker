// src/App.tsx
import React, { useState, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Element } from 'react-scroll';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import EmotionHistory from './pages/EmotionHistory';
import { Camera, Loader2, RefreshCw, Image as ImageIcon } from 'lucide-react';

function App() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [lastMood, setLastMood] = useState<string | null>(null);
  const [videoList, setVideoList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch & analyze ────────────────────────────────────────────────────────
  const fetchSongs = async (endpoint: string, body: FormData | string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: body instanceof FormData ? body : JSON.stringify({}),
        headers:
          body instanceof FormData
            ? {}
            : { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (!data.emotion || !data.videos) throw new Error('Bad data');

      if (data.emotion === lastMood && videoList.length > 0) {
        return setIsAnalyzing(false);
      }

      setCurrentMood(data.emotion);
      setLastMood(data.emotion);
      setVideoList(data.videos);

      // save history if logged in
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('http://localhost:5000/api/save_emotion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ emotion: data.emotion }),
        });
      }
    } catch (e) {
      console.error(e);
      setError('Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startAnalysis = () =>
    fetchSongs('http://localhost:5000/api/detect_emotion', '');

  const analyzeImage = () => {
    if (!uploadedImage) return;
    const fd = new FormData();
    fd.append('image', uploadedImage);
    fetchSongs('http://localhost:5000/api/detect_emotion_from_image', fd);
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadedImage(f);
    setImagePreview(URL.createObjectURL(f));
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
            <Navbar />
            <main className="container mx-auto px-6 py-12 flex justify-center">
              <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">

                {/* ── Left: Emotion Controls ───────────────────────── */}
                <div className="w-full md:w-1/2">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Camera className="w-5 h-5" /> Emotion Detection
                    </h2>
                    <div className="aspect-video bg-black/50 rounded-lg overflow-hidden mb-2 flex items-center justify-center">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <img
                          src="http://localhost:5000/api/video_feed"
                          alt="Webcam"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <button
                      onClick={startAnalysis}
                      disabled={isAnalyzing}
                      className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Analyzing…
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-5 h-5" />
                          Analyze (Webcam)
                        </>
                      )}
                    </button>
                    <label className="mt-4 block">
                      <span className="text-sm flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Upload Image
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full mt-2 bg-purple-700 text-white py-2 rounded-lg file:cursor-pointer file:px-4 file:bg-purple-600"
                      />
                    </label>
                    {uploadedImage && (
                      <button
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing…
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-5 h-5" />
                            Analyze Image
                          </>
                        )}
                      </button>
                    )}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                  </div>
                </div>

                <div className="w-full md:w-1/2">
                  {currentMood && (
                    <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20 shadow-md">
                      <h3 className="text-lg font-medium mb-2">
                        Current Mood
                      </h3>
                      <p className="text-4xl font-extrabold text-purple-300 mb-4 animate-pulse">
                        {currentMood.toUpperCase()}
                      </p>

                      {videoList.length > 0 && (
                        <div
                          id="video-list"
                          className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto"
                        >
                          {videoList.map((vid, idx) => (
                            <Element name={`video-${idx}`} key={idx}>
                              <a
                                href={`https://www.youtube.com/watch?v=${vid.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block bg-black/40 rounded-lg overflow-hidden hover:shadow-lg transform hover:scale-105 transition"
                              >
                                <img
                                  src={vid.thumbnail}
                                  alt={vid.title}
                                  className="w-full h-36 object-cover rounded-t-lg"
                                  loading="lazy"
                                />
                                <div className="p-2 text-sm font-semibold truncate text-white">
                                  {vid.title}
                                </div>
                              </a>
                            </Element>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/history" element={<EmotionHistory />} />
    </Routes>
  );
}

export default App;
