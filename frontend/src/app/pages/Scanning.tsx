import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Globe, Database, Wifi, AlertCircle } from "lucide-react";
import { useScan } from "../store/scanStore";

const LOG_MESSAGES = [
  "Initializing CLIP neural network...",
  "Extracting video frames...",
  "Generating visual embeddings...",
  "Loading internet source dataset...",
  "Scanning YouTube thumbnails...",
  "Running FAISS similarity search...",
  "Comparing embeddings across sources...",
  "Ranking matches by confidence...",
  "Generating legal recommendations...",
  "Finalizing piracy report...",
];

export function Scanning() {
  const navigate = useNavigate();
  const { status, file } = useScan();
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>(["Initializing neural network...", "Connecting to CDN nodes..."]);
  const [sourcesScanned, setSourcesScanned] = useState(0);
  const [matchesFound, setMatchesFound] = useState(0);

  // Redirect if landed here without a scan in progress
  useEffect(() => {
    if (status === "idle") navigate("/");
    if (status === "results" || status === "error") navigate("/results");
  }, [status, navigate]);

  // Animate progress bar — slow crawl that never hits 100 (backend controls completion)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev; // hold at 92% until results arrive
        return prev + (prev < 30 ? 2 : prev < 60 ? 1 : 0.4);
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Animate log messages
  useEffect(() => {
    const interval = setInterval(() => {
      setLogIndex((prev) => {
        const next = prev + 1;
        if (next < LOG_MESSAGES.length) {
          setLogs((l) => [...l.slice(-5), LOG_MESSAGES[next]]);
        }
        return next;
      });
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  // Animate stats counters
  useEffect(() => {
    const interval = setInterval(() => {
      setSourcesScanned((prev) => Math.min(prev + Math.floor(Math.random() * 80 + 20), 9999));
      setMatchesFound((prev) => prev + (Math.random() > 0.75 ? 1 : 0));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const statusLabel = status === "uploading" ? "Uploading video..." : "Scanning the internet...";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0F1A] to-[#0f1419] relative overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(96, 165, 250, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(96, 165, 250, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }} />
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full blur-[150px] opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(96, 165, 250, 0.4) 0%, rgba(147, 51, 234, 0.4) 70%, transparent 100%)",
            left: "50%", top: "50%", transform: "translate(-50%, -50%)",
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 px-8 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-400/30 rounded-full mb-6">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-xs text-blue-400 uppercase tracking-[2px]">Operational Status: Active</span>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4">{statusLabel}</h1>
          {file && (
            <p className="text-gray-400 text-lg">
              Analyzing: <span className="text-blue-400 font-medium">{file.name}</span>
            </p>
          )}
        </motion.div>

        {/* AI Core Orb */}
        <div className="flex flex-col items-center mb-16">
          <motion.div
            className="relative w-80 h-80"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: `rgba(96, 165, 250, ${0.3 - i * 0.1})`, transform: `scale(${1 - i * 0.15})` }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
              />
            ))}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={`pulse-${i}`}
                className="absolute inset-0 rounded-full border-2 border-blue-400"
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: [0, 2], opacity: [0.8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500"
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: ["0 0 60px rgba(96,165,250,0.6)", "0 0 80px rgba(147,51,234,0.8)", "0 0 60px rgba(96,165,250,0.6)"],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-4 rounded-full bg-[#0B0F1A] flex items-center justify-center">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            </div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2">
              <div className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-blue-400/30 rounded-full">
                <span className="text-xs text-blue-400 uppercase tracking-[2px]">Global CDN</span>
              </div>
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
              <div className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-purple-400/30 rounded-full">
                <span className="text-xs text-purple-400 uppercase tracking-[2px]">P2P Nodes</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">{logs[logs.length - 1]}</span>
            <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
          </div>
          <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/40 to-transparent rounded-full"
              style={{ width: `${progress}%` }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Live Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
        >
          {[
            { label: "Sources", value: sourcesScanned.toLocaleString(), icon: Database, highlight: false },
            { label: "Matched", value: matchesFound, icon: Wifi, highlight: true },
            { label: "Speed", value: "4.2 TB/s", icon: Globe, highlight: false },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className={`p-6 rounded-xl backdrop-blur-xl border text-center ${stat.highlight ? "bg-purple-500/10 border-purple-400/30" : "bg-white/5 border-white/10"}`}
            >
              <div className="flex items-center justify-center mb-2">
                <stat.icon className={`w-5 h-5 ${stat.highlight ? "text-purple-400" : "text-gray-400"}`} />
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-[1.5px] mb-2">{stat.label}</div>
              <div className={`text-3xl font-bold ${stat.highlight ? "text-purple-400" : "text-white"}`}>{stat.value}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Activity Log + Threat Delta */}
        <div className="grid grid-cols-2 gap-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Active Surveillance Log</h3>
            </div>
            <div className="space-y-2 font-mono text-sm">
              {logs.map((log, i) => (
                <motion.div
                  key={`${i}-${log}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2 text-gray-400"
                >
                  <span className="text-blue-400 shrink-0">
                    {new Date().toLocaleTimeString("en-US", { hour12: false })}
                  </span>
                  <span>{log}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl border border-red-400/30 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-semibold text-white">Threat Delta</h3>
            </div>
            <div className="mb-6">
              <div className="text-6xl font-bold text-red-400 mb-2">+18.4%</div>
              <p className="text-sm text-gray-300">
                System has detected a sharp increase in illicit sharing activities across decentralized storage networks.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-xs text-gray-400 uppercase tracking-[1.5px] mb-2">Live Feed: B002</div>
              <div className="text-sm text-white font-semibold">San Francisco - Data Center B</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
