import { spacing } from "@/lib/design-system";
import { cn } from "@/lib/cn";
import { NavLink } from "react-router-dom";

export interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
}

export default function NavItem({ to, icon, label, active }: NavItemProps) {
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
}
