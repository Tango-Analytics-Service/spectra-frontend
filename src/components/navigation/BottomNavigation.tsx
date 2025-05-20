// src/components/navigation/BottomNavigation.tsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, CreditCard, Search, User } from "lucide-react";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => {
  return (
    <NavLink
      to={to}
      className="flex flex-col items-center justify-center px-3 py-1"
    >
      <div
        className={`p-1 ${
          active ? "text-blue-400" : "text-slate-400 hover:text-blue-300"
        }`}
      >
        {icon}
      </div>
      <span
        className={`text-[10px] mt-0.5 transition-colors ${
          active ? "text-blue-400 font-medium" : "text-slate-500"
        }`}
      >
        {label}
      </span>
    </NavLink>
  );
};

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-safe z-50 px-4 sm:px-6 mb-3">
      <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-lg shadow-black/30 flex justify-around items-center py-1.5 w-full max-w-md">
        <NavItem
          to="/"
          icon={<Home size={18} />}
          label="Главная"
          active={currentPath === "/" || currentPath === "/home"}
        />
        <NavItem
          to="/filters"
          icon={<Search size={18} />}
          label="Фильтры"
          active={currentPath.startsWith("/credit")}
        />
        <NavItem
          to="/credits"
          icon={<CreditCard size={18} />}
          label="Кредиты"
          active={currentPath.startsWith("/credit")}
        />
        <NavItem
          to="/profile"
          icon={<User size={18} />}
          label="Профиль"
          active={currentPath.startsWith("/profile")}
        />
      </div>
    </div>
  );
};

export default BottomNavigation;
