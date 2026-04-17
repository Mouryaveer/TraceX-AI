import { motion } from "motion/react";
import { Search, Upload, Shield, Activity, Globe, Zap, AlertCircle, CheckCircle } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { useScan } from "../store/scanStore";
import { searchVideo } from "../services/api";
import { checkHealth } from "../services/api";

const ACCEPTED_TYPES = ["video/mp4", "video/avi", "video/quicktime", "video/x-matroska", "video/webm"];
const ACCEPTED_EXT = [".mp4", ".avi", ".mov", ".mkv", ".webm"];

export function Home() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { file, setFile, setStatus, setResults, setError, status, reset } = useScan();

  // Check backend health on mount
  useEffect(() => {
    checkHealth().then(setBackendOnline);
  }, []);

  const validateFile = (f: File): string | null => {
    if (!ACCEPTED_TYPES.includes(f.type) && !ACCEPTED_EXT.some(ext => f.name.toLowerCase().endsWith(ext))) {
      return "Invalid file type. Please upload a video file (MP4, AVI, MOV, MKV, WebM).";
    }
    if (f.size > 500 * 1024 * 1024) {
      return "File too large. Maximum size is 500MB.";
    }
    return null;
  };

  const handleFileSelect = (f: File) => {
    const err = validateFile(f);
    if (err) {
      setError(err);
      navigate("/results");
      return;
    }
    setFile(f);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFileSelect(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileSelect(f);
  };

  const handleScan = async () => {
    if (!file) {
      fileInputRef.current?.click();
      return;
    }

    reset();
    setFile(file);
    setStatus("uploading");
    navigate("/scanning");

    try {
      setStatus("scanning");
      const data = await searchVideo(file);
      setResults(data);
      navigate("/results");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Processing failed. Please try again.";
      setError(msg);
      navigate("/results");
    }
  };

  const isProcessing = status === "uploading" || status === "scanning";

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl mx-auto text-center space-y-12"
        >
          {/* Logo */}
          <div className="space-y-4">
            <motion.h1
              className="text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              TraceX AI
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1  }}
              transition={{ delay: 0.3 }}
              className="text-sm text-blue-400/80 tracking-[3px] uppercase"
            >
              Digital Sentinel Active
            </motion.p>

            {/* Backend status indicator */}
            {backendOnline !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2"
              >
                {backendOnline ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400">Backend Online</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-red-400">Backend Offline — start with: uvicorn app:app --reload</span>
                  </>
                )}
              </motion.div>
            )}
          </div>

          {/* Upload / Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="relative"
          >
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`
                relative bg-white/5 backdrop-blur-xl rounded-2xl border transition-all duration-300
                ${searchFocused || dragOver
                  ? "border-blue-400/50 shadow-[0_0_40px_rgba(96,165,250,0.3)]"
                  : "border-white/10 hover:border-white/20"
                }
              `}
            >
              {(searchFocused || dragOver) && (
                <motion.div
                  className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-50 blur-sm -z-10"
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% 200%" }}
                />
              )}

              <div className="flex items-center gap-4 p-6">
                <Search className="w-6 h-6 text-blue-400 shrink-0" />
                <div
                  className="flex-1 text-left cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  tabIndex={0}
                >
                  {file ? (
                    <span className="text-white text-lg">{file.name}</span>
                  ) : (
                    <span className="text-gray-500 text-lg">
                      {dragOver ? "Drop video here..." : "Upload or drag a video to detect piracy..."}
                    </span>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_EXT.join(",")}
                  className="hidden"
                  onChange={handleInputChange}
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
                  title="Choose video file"
                >
                  <Upload className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>

            {file && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-sm text-green-400 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {file.name} — {(file.size / (1024 * 1024)).toFixed(1)} MB — ready to scan
              </motion.p>
            )}

            {!file && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 text-sm text-gray-400"
              >
                Supports MP4, AVI, MOV, MKV, WebM · Max 500MB
              </motion.p>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-4"
          >
            <motion.button
              onClick={handleScan}
              disabled={isProcessing}
              className="relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-white overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={!isProcessing ? { scale: 1.05 } : {}}
              whileTap={!isProcessing ? { scale: 0.98 } : {}}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                {file ? "Scan for Piracy" : "Choose Video & Scan"}
              </span>
              <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>

            {file && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                className="px-6 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl font-semibold text-gray-400 hover:text-white transition-all"
                whileHover={{ scale: 1.05 }}
              >
                Clear
              </motion.button>
            )}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-3 gap-6 pt-12"
          >
            {[
              { icon: Activity, label: "Real-time AI Detection", color: "blue" },
              { icon: Globe, label: "Cross-platform Scanning", color: "purple" },
              { icon: Shield, label: "Advanced Protection", color: "cyan" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="flex flex-col items-center gap-3 p-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-blue-400/30 transition-all group"
              >
                <div className={`p-3 bg-${item.color}-500/10 rounded-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                </div>
                <p className="text-sm text-gray-300 text-center">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Stats */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="fixed bottom-8 left-64 right-8 z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                142K+
              </div>
              <div className="text-sm text-gray-400 mt-1">Sentinels online worldwide</div>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">Active</div>
              <div className="text-sm text-gray-400 mt-1">AI-powered media protection engine</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
