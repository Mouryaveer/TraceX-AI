import { motion } from "motion/react";
import {
  Search, FileText, TrendingUp, Download, ExternalLink,
  Youtube, Globe, Shield, AlertTriangle, CheckCircle,
  AlertCircle, RefreshCw, ChevronDown, ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useScan } from "../store/scanStore";
import type { SearchResult } from "../services/api";

function getRiskColors(status: string) {
  if (status === "High Risk Piracy") return { bg: "bg-red-500/10", border: "border-red-400/30", text: "text-red-400", bar: "from-red-500 to-orange-500", badge: "bg-red-500/90 text-white" };
  if (status === "Possible Copy") return { bg: "bg-yellow-500/10", border: "border-yellow-400/30", text: "text-yellow-400", bar: "from-yellow-500 to-orange-500", badge: "bg-yellow-500/90 text-black" };
  return { bg: "bg-green-500/10", border: "border-green-400/30", text: "text-green-400", bar: "from-green-500 to-cyan-500", badge: "bg-green-500/90 text-white" };
}

function PlatformIcon({ platform }: { platform: string }) {
  if (platform.toLowerCase().includes("youtube")) return <Youtube className="w-4 h-4 text-red-400" />;
  return <Globe className="w-4 h-4 text-gray-400" />;
}

function ResultCard({ result, index }: { result: SearchResult; index: number }) {
  const colors = getRiskColors(result.status);
  const [showAdvice, setShowAdvice] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className={`${colors.bg} backdrop-blur-xl border ${colors.border} rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(96,165,250,0.2)]`}
    >
      <div className="flex gap-6 p-6">
        {/* Risk badge + score */}
        <div className="flex flex-col items-center justify-center w-24 shrink-0 gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${colors.badge}`}>
            {result.status === "High Risk Piracy" ? "High" : result.status === "Possible Copy" ? "Medium" : "Safe"}
          </div>
          <div className={`text-3xl font-bold ${colors.text}`}>{result.similarity_pct.toFixed(0)}%</div>
          <div className="text-xs text-gray-500 text-center">similarity</div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2 truncate">
              {result.title || result.url || "Unknown Source"}
            </h3>
            <div className="flex items-center gap-4 mb-3 flex-wrap">
              <div className="flex items-center gap-2">
                <PlatformIcon platform={result.platform} />
                <span className="text-sm text-gray-400">{result.platform}</span>
              </div>
              {result.url && (
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-400 hover:underline truncate max-w-xs"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span className="truncate">{result.url}</span>
                </a>
              )}
            </div>

            {/* Similarity bar */}
            <div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.similarity_pct}%` }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                  className={`h-full rounded-full bg-gradient-to-r ${colors.bar}`}
                />
              </div>
            </div>
          </div>

          {/* Legal advice toggle */}
          <button
            onClick={() => setShowAdvice((v) => !v)}
            className="mt-4 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors w-fit"
          >
            {showAdvice ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showAdvice ? "Hide" : "Show"} Legal Advice
          </button>

          {showAdvice && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                {result.legal_advice.risk_level} — {result.legal_advice.confidence_pct}% confidence
              </p>
              <ul className="space-y-1">
                {result.legal_advice.actions.map((action, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5 shrink-0">›</span>
                    {action}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 shrink-0">
          {result.url && (
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-medium uppercase tracking-[1px] transition-colors border border-blue-400/30 text-center"
            >
              Inspect Source
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Results() {
  const navigate = useNavigate();
  const { results, error, status, file, reset } = useScan();
  const [filter, setFilter] = useState<"all" | "high" | "medium">("all");

  const handleNewScan = () => {
    reset();
    navigate("/");
  };

  // Error state
  if (status === "error" || error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B0F1A] to-[#0f1419] flex items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-red-500/10 backdrop-blur-xl border border-red-400/30 rounded-2xl p-10 text-center"
        >
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Scan Failed</h2>
          <p className="text-gray-300 mb-8">{error || "An unexpected error occurred."}</p>
          <button
            onClick={handleNewScan}
            className="flex items-center gap-2 mx-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // No results yet (navigated directly)
  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B0F1A] to-[#0f1419] flex items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Search className="w-16 h-16 text-gray-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">No Scan Results</h2>
          <p className="text-gray-400 mb-8">Upload a video on the home page to start scanning.</p>
          <button
            onClick={handleNewScan}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold"
          >
            Go to Search
          </button>
        </motion.div>
      </div>
    );
  }

  const allResults = results.results ?? [];
  const highRisk = allResults.filter((r) => r.status === "High Risk Piracy");
  const medium = allResults.filter((r) => r.status === "Possible Copy");

  const filtered = filter === "high" ? highRisk : filter === "medium" ? medium : allResults;

  // Collect all unique legal actions from high-risk results
  const topActions = highRisk.length > 0
    ? highRisk[0].legal_advice.actions
    : allResults[0]?.legal_advice?.actions ?? ["No action required."];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0F1A] to-[#0f1419] px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-400" />
            <span className="text-sm text-blue-400 uppercase tracking-[2px]">
              Surveillance Module // Scan Results
            </span>
          </div>
          <h1 className="text-6xl font-bold mb-4">
            <span className="text-white">System </span>
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Detections</span>
          </h1>
          {file && (
            <p className="text-gray-400 text-lg">
              Scanned: <span className="text-blue-400 font-medium">{file.name}</span>
              {" · "}{results.total_scanned} sources checked
            </p>
          )}
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400 uppercase tracking-[1.5px]">Total Matches</span>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-5xl font-bold text-white mb-2">{allResults.length}</div>
            <div className="h-1 bg-blue-500/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-3/4" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl border border-red-400/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-red-400 uppercase tracking-[1.5px]">High Risk</span>
              {highRisk.length > 0 && (
                <motion.div
                  className="w-3 h-3 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
            <div className="text-5xl font-bold text-red-400 mb-2">{highRisk.length}</div>
            <div className="h-1 bg-red-500/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-orange-500" style={{ width: `${allResults.length ? (highRisk.length / allResults.length) * 100 : 0}%` }} />
            </div>
          </div>

          <div className={`backdrop-blur-xl border rounded-xl p-6 ${results.piracy_detected ? "bg-red-500/5 border-red-400/20" : "bg-green-500/5 border-green-400/20"}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400 uppercase tracking-[1.5px]">Verdict</span>
              {results.piracy_detected
                ? <AlertTriangle className="w-5 h-5 text-red-400" />
                : <CheckCircle className="w-5 h-5 text-green-400" />
              }
            </div>
            <div className={`text-2xl font-bold mb-2 ${results.piracy_detected ? "text-red-400" : "text-green-400"}`}>
              {results.piracy_detected ? "Piracy Detected" : "Content Safe"}
            </div>
            <p className="text-xs text-gray-500">{results.matches_found} matches ranked</p>
          </div>
        </motion.div>

        {/* Filters + New Scan */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4 mb-8 flex-wrap"
        >
          <span className="text-sm text-gray-400 uppercase tracking-[1.5px]">Filter</span>
          {(["all", "high", "medium"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium uppercase tracking-[1px] transition-all ${
                filter === f
                  ? "bg-blue-500/20 text-blue-400 border border-blue-400/30"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20"
              }`}
            >
              {f === "all" ? "All Results" : f === "high" ? "High Risk" : "Possible Copy"}
            </button>
          ))}
          <button
            onClick={handleNewScan}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 rounded-lg text-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            New Scan
          </button>
        </motion.div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-8">
        {/* Results List */}
        <div className="col-span-2 space-y-4">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No matches for this filter</h3>
              <p className="text-gray-400">Try "All Results" to see everything.</p>
            </motion.div>
          ) : (
            filtered.map((result, index) => (
              <ResultCard key={index} result={result} index={index} />
            ))
          )}
        </div>

        {/* Legal Action Panel */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-400/30 rounded-xl p-6 sticky top-24"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center"
                animate={{ boxShadow: ["0 0 20px rgba(96,165,250,0.4)", "0 0 30px rgba(147,51,234,0.6)", "0 0 20px rgba(96,165,250,0.4)"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Shield className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-lg font-bold text-white">Legal Action Panel</h3>
                <p className="text-xs text-blue-400">AI Assistant</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="text-xs text-gray-400 uppercase tracking-[1.5px] mb-3">Recommended Actions</div>
              {topActions.slice(0, 4).map((action, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-lg"
                >
                  {i === 0 && <FileText className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}
                  {i === 1 && <TrendingUp className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />}
                  {i >= 2 && <Download className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />}
                  <span className="text-sm text-gray-300">{action}</span>
                </motion.div>
              ))}
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.print()}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold text-sm uppercase tracking-[1px] shadow-[0_0_20px_rgba(96,165,250,0.3)] hover:shadow-[0_0_30px_rgba(96,165,250,0.5)] transition-all"
              >
                Generate Report
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNewScan}
                className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-blue-400/30 rounded-lg font-semibold text-sm uppercase tracking-[1px] transition-all"
              >
                New Scan
              </motion.button>
            </div>
          </motion.div>

          {/* Threat Distribution */}
          {allResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-sm text-gray-400 uppercase tracking-[1.5px] mb-6">Threat Distribution</h3>
              <div className="space-y-4">
                {[
                  { label: "High Risk", count: highRisk.length, color: "from-red-500 to-red-600" },
                  { label: "Possible Copy", count: medium.length, color: "from-yellow-500 to-orange-500" },
                  { label: "Safe", count: allResults.filter(r => r.status === "Safe").length, color: "from-green-500 to-cyan-500" },
                ].map((item) => {
                  const pct = allResults.length ? Math.round((item.count / allResults.length) * 100) : 0;
                  return (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white">{item.label}</span>
                        <span className="text-sm font-bold text-white">{pct}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1 }}
                          className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
