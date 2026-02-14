"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Loader2, Play, Check, ChevronRight, Sparkles, ChefHat, ArrowRight, Camera, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam";
import Background from "../components/Background";

// Types
interface Question {
  question: string;
  options: string[];
}

interface AnalysisResponse {
  ingredients_found: string[];
  questions: Question[];
}

interface RecipeResponse {
  recipe_title: string;
  steps: string[];
  missing_items: string[];
}

type AppState = "IDLE" | "ANALYZING" | "QUESTIONS" | "GENERATING_RECIPE" | "RECIPE";

export default function Home() {
  const [state, setState] = useState<AppState>("IDLE");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  // --- Image Handling ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setShowUploadModal(false);
    startAnalysis(file);
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
          processFile(file);
          setShowCamera(false);
        });
    }
  }, [webcamRef]);

  // --- API Calls ---

  const startAnalysis = async (file: File) => {
    setState("ANALYZING");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/api/analyze-pantry", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Analysis failed");
      
      const data: AnalysisResponse = await res.json();
      setIngredients(data.ingredients_found);
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(""));
      setState("QUESTIONS");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setState("IDLE");
      setPreview(null);
    }
  };

  const handleAnswerSelect = (questionIndex: number, option: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = option;
    setAnswers(newAnswers);
  };

  const generateFinalRecipe = async () => {
    setState("GENERATING_RECIPE");
    try {
      const res = await fetch("http://localhost:8000/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients_found: ingredients,
          user_answers: answers.filter(a => a !== ""), 
        }),
      });
      if (!res.ok) throw new Error("Recipe generation failed");

      const data: RecipeResponse = await res.json();
      setRecipe(data);
      setState("RECIPE");
    } catch (err) {
      console.error(err);
      alert("Failed to generate recipe.");
      setState("QUESTIONS");
    }
  };

  // --- Render Functions ---

  const renderHero = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="relative flex flex-col items-center justify-center min-h-[85vh] text-center space-y-12 px-4"
    >
      {/* Aurora Background Effect */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
           className="inline-block"
        >
          <span className="px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm font-semibold tracking-wider uppercase backdrop-blur-sm">
            Powered by <span className="text-white">Inshal AI</span>
          </span>
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 drop-shadow-2xl leading-none">
          Pantry<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Vision</span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-2xl font-light leading-relaxed max-w-2xl mx-auto">
          Turn your ingredients into a masterpiece. <br/> 
          <span className="text-white font-medium">No waste. Just taste.</span>
        </p>

        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setShowUploadModal(true)}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 text-lg font-bold text-white transition-all bg-emerald-600 rounded-full hover:bg-emerald-500 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] border border-white/10"
        >
          <Camera className="w-6 h-6" />
          <span>Analyze My Fridge</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      {/* Upload Choice Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 10, opacity: 0 }}
              className="bg-zinc-900/90 border border-white/10 p-6 rounded-3xl w-full max-w-sm shadow-2xl space-y-4 relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white tracking-tight">How do we eat today?</h3>
                <button onClick={() => setShowUploadModal(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                  <X className="text-gray-400 w-5 h-5" />
                </button>
              </div>
              
              <button 
                onClick={() => { setShowCamera(true); setShowUploadModal(false); }}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group"
              >
                <div className="bg-emerald-500/20 p-3 rounded-full text-emerald-400 group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white">Take Photo</div>
                  <div className="text-xs text-gray-400">Snap directly properly</div>
                </div>
              </button>

              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group"
              >
                <div className="bg-cyan-500/20 p-3 rounded-full text-cyan-400 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white">Upload from Gallery</div>
                  <div className="text-xs text-gray-400">Choose existing file</div>
                </div>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Modal */}
      <AnimatePresence>
        {showCamera && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-black"
          >
            <div className="flex justify-between items-center p-4 bg-black/50 absolute top-0 w-full z-10 backdrop-blur-sm">
              <span className="font-bold text-white">Capture</span>
              <button onClick={() => setShowCamera(false)}><X className="text-white w-8 h-8" /></button>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-black">
               <Webcam
                 audio={false}
                 ref={webcamRef}
                 screenshotFormat="image/jpeg"
                 videoConstraints={{ facingMode: "environment" }}
                 className="w-full h-full object-cover"
               />
            </div>

            <div className="p-8 bg-black/80 flex justify-center pb-12 backdrop-blur-md">
              <button 
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 shadow-lg active:scale-90 transition-transform ring-4 ring-emerald-500/30" 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*" 
      />
    </motion.div>
  );

  const renderAnalyzing = () => (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 px-4"
    >
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.4)]">
        {preview && (
          <Image src={preview} alt="Scanning" fill className="object-cover" />
        )}
        <div className="absolute inset-0 bg-emerald-500/20 animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_20px_#34d399] animate-[scan_2s_ease-in-out_infinite]" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-3xl font-bold text-white">Analyzing...</h2>
        <p className="text-emerald-400 animate-pulse">Identifying ingredients</p>
      </div>
    </motion.div>
  );

  const renderQuestions = () => (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto w-full space-y-8 pb-32 px-4 pt-8"
    >
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Ingredients Detected</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {ingredients.map((ing, i) => (
            <motion.span 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }}
              key={i} 
              className="px-4 py-1.5 bg-emerald-500/10 rounded-full text-emerald-300 text-sm font-medium border border-emerald-500/20"
            >
              {ing}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, qImg) => (
          <motion.div 
            key={qImg}
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: qImg * 0.1 }}
            className="bg-zinc-900/80 p-6 rounded-2xl border border-white/5 shadow-lg backdrop-blur-sm"
          >
            <h3 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              {q.question}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {q.options.map((option, optIdx) => (
                <button
                  key={optIdx}
                  onClick={() => handleAnswerSelect(qImg, option)}
                  className={`py-4 px-5 rounded-xl text-left text-sm font-medium transition-all duration-300 ${
                    answers[qImg] === option 
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg translate-x-2" 
                      : "bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/90 to-transparent z-50">
        <div className="max-w-xl mx-auto">
          <button
            onClick={generateFinalRecipe}
            disabled={answers.some(a => a === "")}
            className={`w-full flex justify-center items-center gap-2 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl ${
              answers.some(a => a === "")
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            Generate My Recipe <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderRecipe = () => (
    <motion.div 
     initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
     className="max-w-4xl mx-auto w-full pb-20 px-0 md:px-4"
    >
      <div className="bg-zinc-900/90 border-0 md:border border-white/10 md:rounded-3xl overflow-hidden shadow-2xl min-h-screen md:min-h-0 backdrop-blur-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900/80 to-teal-900/80 p-8 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-grid-pattern opacity-10" />
           
          <h2 className="text-2xl md:text-5xl font-black text-white mb-2 relative z-10 leading-tight">
            {recipe?.recipe_title}
          </h2>
          <div className="flex justify-center items-center gap-2 text-emerald-100 relative z-10 mt-4">
            <ChefHat className="w-5 h-5" />
            <span className="font-medium bg-white/10 px-3 py-1 rounded-full text-sm">AI Chef Special</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          
          {/* Sidebar */}
          <div className="p-6 md:p-8 bg-zinc-800/30 border-b md:border-b-0 md:border-r border-white/5 order-2 md:order-1">
            <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
              <span className="bg-amber-400/10 p-1 rounded">🛒</span> Missing Items
            </h3>
            {recipe?.missing_items?.length === 0 ? (
               <p className="text-gray-500 italic">You have everything!</p>
            ) : (
              <ul className="space-y-3 mb-8">
                {recipe?.missing_items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                    <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
              <span className="bg-emerald-400/10 p-1 rounded">🥕</span> Used Items
            </h3>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((item, i) => (
                <span key={i} className="text-xs text-gray-400 bg-black/20 px-2 py-1 rounded border border-white/5">
                  {item}
                </span>
              ))}
            </div>
            
            <button 
              onClick={() => { setState("IDLE"); setPreview(null); setRecipe(null); }}
              className="mt-8 w-full py-3 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-colors text-sm"
            >
              Start Over
            </button>
          </div>

          {/* Steps */}
          <div className="col-span-2 p-6 md:p-8 bg-transparent order-1 md:order-2">
            <h3 className="text-2xl font-bold text-white mb-6">Instructions</h3>
            <div className="space-y-8">
              {recipe?.steps.map((step, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-colors text-sm shadow-lg">
                    {i + 1}
                  </div>
                  <p className="text-gray-300 leading-relaxed mt-1 text-sm md:text-base">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative">
      <Background />
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full p-6 z-40 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="font-bold text-xl tracking-tighter text-white pointer-events-auto flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          PV <span className="text-gray-500">.v2.2</span>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container mx-auto pt-20 pb-0 relative z-10 min-h-screen flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {state === "IDLE" && renderHero()}
          {state === "ANALYZING" && renderAnalyzing()}
          {state === "QUESTIONS" && renderQuestions()}
          {state === "GENERATING_RECIPE" && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center justify-center min-h-[50vh] text-emerald-400 text-xl font-medium px-4 text-center">
               <Sparkles className="w-10 h-10 animate-spin mb-4" />
               Cruising through the flavor cosmos...
            </motion.div>
          )}
          {state === "RECIPE" && renderRecipe()}
        </AnimatePresence>
      </main>
    </div>
  );
}
