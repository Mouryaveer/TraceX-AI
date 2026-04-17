import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Bell, User } from "lucide-react";

export function Layout() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      <Sidebar />
      
      {/* Main content */}
      <div className="ml-64">
        {/* Top bar */}
        <div className="fixed top-0 right-0 left-64 h-16 bg-[#0B0F1A]/80 backdrop-blur-xl border-b border-white/5 z-40">
          <div className="h-full px-8 flex items-center justify-end gap-6">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-[#0B0F1A] group-hover:animate-pulse" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="pt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
