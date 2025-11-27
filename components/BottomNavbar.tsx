
// Modern 2025 Bottom Navbar ✨
import React from "react";
import { View } from "../types";
import {
  DashboardIcon,
  ResidentsIcon,
  PaymentsIcon,
  SettingsIcon,
  ChartPieIcon,
} from "./icons";
import { triggerHapticFeedback } from "../utils/nativeFeedback";

interface BottomNavbarProps {
  currentView: View;
  navigateTo: (view: View) => void;
  overduePaymentsCount: number;
}

const NavItem: React.FC<{
  label: string;
  icon: React.FC<{ className?: string }>;
  isActive: boolean;
  onClick: () => void;
  notificationCount?: number;
}> = ({ label, icon: Icon, isActive, onClick, notificationCount = 0 }) => (
  <button
    onClick={() => {
      triggerHapticFeedback();
      onClick();
    }}
    className={`relative flex flex-col items-center justify-center w-full h-full pt-2 pb-1 space-y-1 transition-all duration-300 
      ${isActive ? "scale-105" : "hover:scale-105 active:scale-95"} focus:outline-none group`}
  >
    <div className="relative flex items-center justify-center w-12 h-10">
      {/* Active Indicator Background */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
          isActive
            ? "bg-gradient-to-tr from-blue-500/20 to-purple-500/20 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.4)] opacity-100"
            : "bg-transparent opacity-0"
        }`}
      ></div>

      <Icon
        className={`w-6 h-6 z-10 transition-all duration-300 ${
          isActive
            ? "text-blue-600 dark:text-blue-400 drop-shadow-[0_4px_6px_rgba(99,102,241,0.5)] scale-110 filter brightness-110"
            : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        }`}
      />

      {notificationCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold ring-2 ring-light-surface dark:ring-dark-surface z-20 shadow-sm animate-bounce">
          {notificationCount > 9 ? "9+" : notificationCount}
        </span>
      )}
    </div>

    <span
      className={`text-[11px] transition-all duration-300 ${
        isActive
          ? "opacity-100 text-blue-600 dark:text-blue-400 font-extrabold tracking-wide drop-shadow-md translate-y-0"
          : "opacity-70 text-gray-500 dark:text-gray-400 font-medium group-hover:opacity-90"
      }`}
    >
      {label}
    </span>

    {isActive && (
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all animate-pulse"></div>
    )}
  </button>
);

const BottomNavbar: React.FC<BottomNavbarProps> = ({
  currentView,
  navigateTo,
  overduePaymentsCount,
}) => {
  const navItems: { view: View; label: string; icon: React.FC<{ className?: string }> }[] = [
    { view: "dashboard", label: "Home", icon: DashboardIcon },
    { view: "residents", label: "Residents", icon: ResidentsIcon },
    { view: "payments", label: "Payments", icon: PaymentsIcon },
    { view: "financials", label: "Stats", icon: ChartPieIcon },
    { view: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg rounded-3xl border border-white/20 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 ring-1 ring-white/10">
      <div className="flex justify-around items-center h-20 px-2">
        {navItems.map(({ view, label, icon }) => (
          <NavItem
            key={view}
            label={label}
            icon={icon}
            isActive={currentView === view}
            onClick={() => navigateTo(view)}
            notificationCount={view === "payments" ? overduePaymentsCount : 0}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNavbar;
