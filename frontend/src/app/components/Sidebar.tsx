import { Link, useLocation } from "react-router";
import { LayoutDashboard, History, BarChart3, Settings, HelpCircle, LogOut } from "lucide-react";
import { motion } from "motion/react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: History, label: "Scan History", path: "/results" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-0 h-screen w-64 bg-[#0B0F1A] border-r border-white/5 flex flex-col z-50"
    >
      {/* Logo */}
      <div className="px-8 pt-12 pb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            TraceX AI
          </h1>
          <p className="text-xs text-blue-400/60 tracking-[1.5px] uppercase">
            Digital Sentinel Active
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative block group"
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className={`
                flex items-center gap-4 px-6 py-3.5 rounded-lg transition-all duration-300
                ${isActive 
                  ? 'bg-blue-500/10 text-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.15)]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }
              `}>
                <Icon className={`w-5 h-5 transition-all duration-300 ${
                  isActive ? 'drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]' : 'group-hover:scale-110'
                }`} />
                <span className="text-sm font-medium uppercase tracking-[1.4px]">
                  {item.label}
                </span>
              </div>

              {/* Hover glow effect */}
              {!isActive && (
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-4 pb-8 space-y-2">
        <button className="flex items-center gap-4 px-6 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 w-full group">
          <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-sm uppercase tracking-[1.4px]">Support</span>
        </button>
        <button className="flex items-center gap-4 px-6 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all duration-300 w-full group">
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-sm uppercase tracking-[1.4px]">Logout</span>
        </button>
      </div>
    </motion.div>
  );
}
