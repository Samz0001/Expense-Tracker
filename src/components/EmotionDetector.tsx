import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { saveEmotion } from '../lib/api';
import { Camera, RefreshCw } from 'lucide-react';

const emotions = ['happy', 'sad', 'angry','neutral'];

const EmotionDetector: React.FC = () => {
  const { user } = useAuth();
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const analyzeEmotion = () => {
    setLoading(true);
    
    // Simulate emotion detection (in a real app, this would use a camera and ML)
    setTimeout(() => {
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setCurrentEmotion(randomEmotion);
      setLoading(false);
      setSaved(false);
    }, 1500);
  };

  const saveEmotionRecord = async () => {
    if (!user || !currentEmotion) return;
    
    try {
      setLoading(true);
      const { error } = await saveEmotion(currentEmotion, intensity);
      
      if (error) throw new Error(error);
      
      setSaved(true);
    } catch (err: any) {
      setError(err.message || 'Failed to save emotion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-indigo-900 bg-opacity-50 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Camera className="mr-2" /> Emotion Detection
      </h2>
      
      <div className="mb-6 bg-black bg-opacity-30 rounded-lg overflow-hidden">
        <div className="aspect-w-16 aspect-h-9 relative">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            alt="Camera feed" 
            className="w-full h-64 object-cover"
          />
          
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      </div>
      
      {currentEmotion && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Detected Emotion</h3>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <p className="text-2xl font-bold capitalize">{currentEmotion}</p>
            
            <div className="mt-4">
              <label htmlFor="intensity" className="block mb-2">
                Intensity: {intensity}/10
              </label>
              <input
                id="intensity"
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            {user ? (
              <button
                onClick={saveEmotionRecord}
                disabled={loading || saved}
                className={`mt-4 w-full py-2 px-4 rounded-lg transition ${
                  saved
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {saved ? 'Saved!' : 'Save to History'}
              </button>
            ) : (
              <div className="mt-4 bg-gray-800 bg-opacity-50 p-3 rounded-lg text-center">
                <p>Please log in to save your emotion history</p>
              </div>
            )}
            
            {error && (
              <p className="mt-2 text-red-400 text-sm">{error}</p>
            )}
          </div>
        </div>
      )}
      
      <button
        onClick={analyzeEmotion}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition flex items-center justify-center"
      >
        {loading ? (
          <>
            <RefreshCw className="animate-spin mr-2" size={20} />
            Analyzing...
          </>
        ) : (
          <>
            {currentEmotion ? 'Analyze Again' : 'Analyze Mood'}
          </>
        )}
      </button>
    </div>
  );
};

export default EmotionDetector;