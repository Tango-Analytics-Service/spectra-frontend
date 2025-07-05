// src/components/navigation/WebNavigation.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";
import { typography, spacing, createButtonStyle } from "@/lib/design-system";
import { Button } from "@/ui/components/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/ui/components/dropdown-menu";
import DropdownMenuContent from "@/ui/components/dropdown-menu/DropdownMenuContent";
import DropdownMenuItem from "@/ui/components/dropdown-menu/DropdownMenuItem";
import DropdownMenuSeparator from "@/ui/components/dropdown-menu/DropdownMenuSeparator";
import { Menu, X, User, LogOut, Settings, CreditCard, Search, Home } from "lucide-react";
import { useAuthStore } from "@/auth/stores/useAuthStore";
import NavLink from "./NavLink";
import MobileNavLink from "./MobileNavLink";

export default function WebNavigation() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header
            className={cn(
                "border-b sticky top-0 z-50",
                "bg-[#030d20] border-blue-900/30",
            )}
        >
            <div className={cn("container mx-auto", `px-${spacing.md}`)}>
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
                                className={cn(typography.h3, "text-blue-400 hidden sm:block")}
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
                                            className={cn(
                                                "ml-2 p-2 rounded-full transition-colors",
                                                "bg-blue-500/10 hover:bg-blue-500/20",
                                            )}
                                        >
                                            {user?.photo_url ? (
                                                <img
                                                    src={user.photo_url}
                                                    alt={user.first_name}
                                                    className="h-8 w-8 rounded-full"
                                                />
                                            ) : (
                                                <User className="h-5 w-5 text-blue-400" />
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="bg-[#041331] border-blue-900/50"
                                    >
                                        <div className="px-2 py-1.5 text-sm font-medium text-blue-400">
                                            {user?.first_name} {user?.last_name}
                                        </div>
                                        <DropdownMenuSeparator className="bg-blue-900/30" />
                                        <DropdownMenuItem
                                            className="cursor-pointer hover:bg-blue-500/10"
                                            asChild
                                        >
                                            <Link to="/profile">
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Профиль</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="cursor-pointer hover:bg-blue-500/10"
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
                                className={createButtonStyle("primary")}
                                onClick={() => { }}
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
                            className="text-blue-400"
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div
                    className={cn(
                        "md:hidden border-t border-blue-900/30 py-2",
                        "bg-[#030d20]",
                        `px-${spacing.md}`,
                    )}
                >
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
}
