import { motion } from "motion/react";
import { Settings as SettingsIcon, Bell, Shield, Database, Zap, User } from "lucide-react";
import { useState } from "react";

export function Settings() {
  const [settings, setSettings] = useState({
    autoReport: true,
    blockchainLogging: true,
    emailNotifications: true,
    realTimeAlerts: false,
    aiEnhancement: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0F1A] to-[#0f1419] px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <SettingsIcon className="w-6 h-6 text-blue-400" />
          <span className="text-sm text-blue-400 uppercase tracking-[2px]">
            System Configuration
          </span>
        </div>
        <h1 className="text-6xl font-bold mb-4">
          <span className="text-white">Platform </span>
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Settings
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          Configure your TraceX AI platform preferences and security settings.
        </p>
      </motion.div>

      {/* Settings Sections */}
      <div className="max-w-4xl space-y-6">
        {/* Automation Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Automation</h2>
          </div>

          <div className="space-y-6">
            {[
              { 
                key: 'autoReport' as const,
                label: 'Auto-Reporting', 
                description: 'Automatically file DMCA takedown requests for high-confidence matches',
                enabled: settings.autoReport
              },
              { 
                key: 'blockchainLogging' as const,
                label: 'Blockchain Logging', 
                description: 'Record all detection events on the TraceX blockchain ledger',
                enabled: settings.blockchainLogging
              },
              { 
                key: 'aiEnhancement' as const,
                label: 'AI Enhancement', 
                description: 'Use advanced neural networks for improved detection accuracy',
                enabled: settings.aiEnhancement
              },
            ].map((setting, i) => (
              <motion.div
                key={setting.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
              >
                <div>
                  <div className="text-white font-semibold mb-1">{setting.label}</div>
                  <div className="text-sm text-gray-400">{setting.description}</div>
                </div>
                <button
                  onClick={() => toggleSetting(setting.key)}
                  className={`
                    w-14 h-7 rounded-full transition-colors relative
                    ${setting.enabled ? 'bg-blue-500' : 'bg-gray-600'}
                  `}
                >
                  <motion.div
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                    animate={{
                      left: setting.enabled ? '30px' : '4px'
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Notifications</h2>
          </div>

          <div className="space-y-6">
            {[
              { 
                key: 'emailNotifications' as const,
                label: 'Email Notifications', 
                description: 'Receive email alerts for new detections',
                enabled: settings.emailNotifications
              },
              { 
                key: 'realTimeAlerts' as const,
                label: 'Real-time Alerts', 
                description: 'Get instant push notifications for high-risk matches',
                enabled: settings.realTimeAlerts
              },
            ].map((setting, i) => (
              <motion.div
                key={setting.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
              >
                <div>
                  <div className="text-white font-semibold mb-1">{setting.label}</div>
                  <div className="text-sm text-gray-400">{setting.description}</div>
                </div>
                <button
                  onClick={() => toggleSetting(setting.key)}
                  className={`
                    w-14 h-7 rounded-full transition-colors relative
                    ${setting.enabled ? 'bg-purple-500' : 'bg-gray-600'}
                  `}
                >
                  <motion.div
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                    animate={{
                      left: setting.enabled ? '30px' : '4px'
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Security</h2>
          </div>

          <div className="space-y-4">
            <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold mb-1">Change Password</div>
                  <div className="text-sm text-gray-400">Update your account password</div>
                </div>
                <div className="text-gray-400 group-hover:text-white transition-colors">→</div>
              </div>
            </button>

            <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold mb-1">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-400">Add an extra layer of security</div>
                </div>
                <div className="text-gray-400 group-hover:text-white transition-colors">→</div>
              </div>
            </button>

            <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold mb-1">API Keys</div>
                  <div className="text-sm text-gray-400">Manage your API access tokens</div>
                </div>
                <div className="text-gray-400 group-hover:text-white transition-colors">→</div>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Account</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Account Email</div>
              <div className="text-white font-semibold">admin@tracexai.com</div>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Plan</div>
              <div className="text-white font-semibold">Enterprise</div>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">API Quota</div>
              <div className="text-white font-semibold mb-2">87,234 / 100,000 requests</div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-[87%]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-end gap-4"
        >
          <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg font-semibold transition-all">
            Cancel
          </button>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow-[0_0_20px_rgba(96,165,250,0.3)] hover:shadow-[0_0_30px_rgba(96,165,250,0.5)] transition-all">
            Save Changes
          </button>
        </motion.div>
      </div>
    </div>
  );
}
