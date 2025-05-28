// src/components/navigation/BottomNavigation.tsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, CreditCard, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  components,
  gradients,
  typography,
  spacing,
  createCardStyle,
  colors,
  radius,
  shadows,
  animations,
} from "@/lib/design-system";

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
      className={cn(
        "flex flex-col items-center justify-center",
        `px-${spacing.sm} py-1`,
      )}
    >
      <div
        className={cn(
          "p-1 transition-colors",
          active ? "text-blue-400" : "text-slate-400 hover:text-blue-300",
        )}
      >
        {icon}
      </div>
      <span
        className={cn(
          "text-[10px] mt-0.5 transition-colors",
          active ? "text-blue-400 font-medium" : "text-slate-500",
        )}
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
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 flex justify-center pb-safe z-50",
        `px-${spacing.md} sm:px-${spacing.lg} mb-${spacing.sm}`,
      )}
    >
      <div
        className={cn(
          createCardStyle(),
          "bg-slate-800/80 backdrop-blur-md flex justify-around items-center w-full max-w-md",
          `py-${spacing.xs}`,
          "shadow-lg shadow-black/30",
          animations.slideIn,
        )}
      >
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
          active={currentPath.startsWith("/filters")}
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
