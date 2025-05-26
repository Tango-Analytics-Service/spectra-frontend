// src/components/navigation/WebNavigation.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  typography,
  spacing,
  animations,
  createButtonStyle,
} from "@/lib/design-system";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  CreditCard,
  Search,
  Home,
} from "lucide-react";

const WebNavigation: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#030d20] border-b border-blue-900/30 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/images/spectra-logo.png"
                alt="Spectra Logo"
                className="h-8 mr-2"
              />
              <span
                className={cn(typography.h3, "text-[#4395d3] hidden sm:block")}
              >
                SPECTRA
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <NavLink to="/" label="Главная" />
                <NavLink to="/channel-sets" label="Наборы каналов" />
                <NavLink to="/filters" label="Фильтры" />
                <NavLink to="/credits" label="Кредиты" />

                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="ml-2 p-2 rounded-full bg-[#4395d3]/10 hover:bg-[#4395d3]/20"
                    >
                      {user?.photo_url ? (
                        <img
                          src={user.photo_url}
                          alt={user.first_name}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <User className="h-5 w-5 text-[#4395d3]" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-[#041331] border-blue-900/50"
                  >
                    <div className="px-2 py-1.5 text-sm font-medium text-[#4395d3]">
                      {user?.first_name} {user?.last_name}
                    </div>
                    <DropdownMenuSeparator className="bg-blue-900/30" />
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-[#4395d3]/10"
                      asChild
                    >
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Профиль</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-[#4395d3]/10"
                      asChild
                    >
                      <Link to="/credits">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Кредиты</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-blue-900/30" />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-400 hover:bg-red-500/10"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Выйти</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                className="bg-[#4395d3] hover:bg-[#3a80b9] text-white"
                onClick={() => {}}
              >
                Войти
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#4395d3]"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#030d20] border-t border-blue-900/30 py-2 px-4">
          <nav className="flex flex-col space-y-2">
            <MobileNavLink
              to="/"
              icon={<Home size={18} />}
              label="Главная"
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink
              to="/channel-sets"
              icon={<Search size={18} />}
              label="Наборы каналов"
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink
              to="/filters"
              icon={<Settings size={18} />}
              label="Фильтры"
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink
              to="/credits"
              icon={<CreditCard size={18} />}
              label="Кредиты"
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink
              to="/profile"
              icon={<User size={18} />}
              label="Профиль"
              onClick={() => setMobileMenuOpen(false)}
            />

            {isAuthenticated && (
              <Button
                variant="ghost"
                className="justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300 mt-2"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Выйти
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

// Desktop nav link
interface NavLinkProps {
  to: string;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label }) => {
  return (
    <Link
      to={to}
      className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-[#4395d3] hover:bg-[#4395d3]/10 transition-colors"
    >
      {label}
    </Link>
  );
};

// Mobile nav link
interface MobileNavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({
  to,
  icon,
  label,
  onClick,
}) => {
  return (
    <Link
      to={to}
      className="flex items-center px-2 py-2 rounded-md text-gray-300 hover:text-[#4395d3] hover:bg-[#4395d3]/10 transition-colors"
      onClick={onClick}
    >
      <span className="mr-3 text-[#4395d3]">{icon}</span>
      {label}
    </Link>
  );
};

export default WebNavigation;
