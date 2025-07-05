import { useLocation } from "react-router-dom";
import { Home, CreditCard, Search, BarChart3 } from "lucide-react";
import { cn } from "@/lib/cn";
import {
    spacing,
    createCardStyle,
    animations,
} from "@/lib/design-system";
import NavItem from "./NavItem";

export default function BottomNavigation() {
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
                    to="/analysis/tasks"
                    icon={<BarChart3 size={18} />}
                    label="Анализ"
                    active={currentPath.startsWith("/analysis")}
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
            </div>
        </div>
    );
}
