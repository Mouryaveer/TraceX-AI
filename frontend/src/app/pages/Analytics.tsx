import { motion } from "motion/react";
import { BarChart3, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";

const detectionData = [
  { month: "Jan", detections: 45, highRisk: 12 },
  { month: "Feb", detections: 52, highRisk: 18 },
  { month: "Mar", detections: 38, highRisk: 8 },
  { month: "Apr", detections: 73, highRisk: 24 },
  { month: "May", detections: 61, highRisk: 19 },
  { month: "Jun", detections: 89, highRisk: 31 },
];

const platformData = [
  { name: "YouTube", value: 245 },
  { name: "Vimeo", value: 87 },
  { name: "Dailymotion", value: 43 },
  { name: "Telegram", value: 156 },
  { name: "Web", value: 92 },
];

export function Analytics() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0F1A] to-[#0f1419] px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          <span className="text-sm text-blue-400 uppercase tracking-[2px]">
            Analytics Dashboard
          </span>
        </div>
        <h1 className="text-6xl font-bold mb-4">
          <span className="text-white">Piracy </span>
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Analytics
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          Track detection trends, platform distribution, and threat levels over time.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-4 gap-6 mb-12"
      >
        {[
          { label: "Total Detections", value: "1,247", change: "+12.5%", trend: "up", icon: Activity },
          { label: "High Risk", value: "342", change: "+8.2%", trend: "up", icon: TrendingUp },
          { label: "Platforms Monitored", value: "42", change: "0%", trend: "neutral", icon: BarChart3 },
          { label: "Avg Response Time", value: "2.4h", change: "-15.3%", trend: "down", icon: TrendingDown },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-blue-400/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-5 h-5 text-gray-400" />
              <span className={`text-sm font-semibold ${
                stat.trend === 'up' ? 'text-green-400' :
                stat.trend === 'down' ? 'text-red-400' :
                'text-gray-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400 uppercase tracking-[1px]">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Detection Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Detection Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={detectionData}>
              <defs>
                <linearGradient id="colorDetections" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorHighRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(11, 15, 26, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Area 
                key="detections-area"
                type="monotone" 
                dataKey="detections" 
                stroke="#60A5FA" 
                fillOpacity={1} 
                fill="url(#colorDetections)" 
              />
              <Area 
                key="highrisk-area"
                type="monotone" 
                dataKey="highRisk" 
                stroke="#EF4444" 
                fillOpacity={1} 
                fill="url(#colorHighRisk)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Platform Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Platform Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(11, 15, 26, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="#60A5FA" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Threat Level Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-400/30 rounded-xl p-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Current Threat Level</h3>
            <p className="text-gray-400">Based on last 24 hours of activity</p>
          </div>
          <div className="text-right">
            <div className="text-6xl font-bold text-orange-400 mb-2">ELEVATED</div>
            <div className="flex items-center gap-2 justify-end">
              <motion.div
                className="w-3 h-3 bg-orange-500 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm text-orange-400 uppercase tracking-[2px]">Active Monitoring</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}